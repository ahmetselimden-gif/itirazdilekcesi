import { createHash } from "node:crypto";
import OpenAI from "openai";
import { validateTurnstileToken } from "next-turnstile";
import { NextResponse } from "next/server";
import {
  buildFallbackTrafficResult,
  buildTrafficPrompt,
  type TrafficFormData,
} from "@/lib/trafficPetition";
import { createPetitionToken } from "@/lib/petitionToken";
import {
  isTrustedOrigin,
  sanitizeTrafficPayload,
} from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateResponse = {
  petition: string;
  evaluationLevel: "Düşük" | "Orta" | "Yüksek";
  evaluationComment: string;
  source: "openai" | "fallback";
  petitionToken: string;
};

type GenerateRateEntry = {
  count: number;
  resetAt: number;
};

type GenerateCacheEntry = {
  result: GenerateResponse;
  expiresAt: number;
};

type CaptchaFailureEntry = {
  count: number;
  blockedUntil: number;
  resetAt: number;
};

const GENERATE_RATE_WINDOW_MS = 60_000;
const GENERATE_RATE_LIMIT_MAX = 2;
const DUPLICATE_CACHE_TTL_MS = 60_000;
const CAPTCHA_FAILURE_WINDOW_MS = 15 * 60_000;
const CAPTCHA_BLOCK_MS = 15 * 60_000;
const CAPTCHA_FAILURE_LIMIT = 5;

const globalStore = globalThis as typeof globalThis & {
  __generateRateLimitStore?: Map<string, GenerateRateEntry>;
  __generateDuplicateCacheStore?: Map<string, GenerateCacheEntry>;
  __generateCaptchaFailureStore?: Map<string, CaptchaFailureEntry>;
};

const generateRateLimitStore =
  globalStore.__generateRateLimitStore ??
  (globalStore.__generateRateLimitStore = new Map<string, GenerateRateEntry>());

const generateDuplicateCacheStore =
  globalStore.__generateDuplicateCacheStore ??
  (globalStore.__generateDuplicateCacheStore = new Map<string, GenerateCacheEntry>());

const generateCaptchaFailureStore =
  globalStore.__generateCaptchaFailureStore ??
  (globalStore.__generateCaptchaFailureStore = new Map<string, CaptchaFailureEntry>());

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function logSuspiciousAttempt(
  reason: string,
  request: Request,
  details: Record<string, unknown> = {}
) {
  console.warn("[generate-security]", {
    reason,
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent") || "",
    origin: request.headers.get("origin") || "",
    referer: request.headers.get("referer") || "",
    secFetchSite: request.headers.get("sec-fetch-site") || "",
    ...details,
  });
}

function getSuspiciousHeaderReason(request: Request) {
  const userAgent = request.headers.get("user-agent")?.trim() || "";
  if (!userAgent) {
    return "missing-user-agent";
  }

  if (/curl|wget|python-requests|httpclient|libwww|scrapy|postman|insomnia/i.test(userAgent)) {
    return "automation-user-agent";
  }

  const secFetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return "cross-site-fetch";
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return "oversized-request";
  }

  return "";
}

function isCaptchaBlocked(ip: string) {
  const entry = generateCaptchaFailureStore.get(ip);

  if (!entry) {
    return false;
  }

  if (entry.blockedUntil > Date.now()) {
    return true;
  }

  if (entry.resetAt <= Date.now()) {
    generateCaptchaFailureStore.delete(ip);
  }

  return false;
}

function recordCaptchaFailure(ip: string) {
  const now = Date.now();
  const current = generateCaptchaFailureStore.get(ip);
  const entry =
    !current || current.resetAt <= now
      ? {
          count: 1,
          blockedUntil: 0,
          resetAt: now + CAPTCHA_FAILURE_WINDOW_MS,
        }
      : {
          ...current,
          count: current.count + 1,
        };

  if (entry.count >= CAPTCHA_FAILURE_LIMIT) {
    entry.blockedUntil = now + CAPTCHA_BLOCK_MS;
  }

  generateCaptchaFailureStore.set(ip, entry);
  return entry;
}

function clearCaptchaFailures(ip: string) {
  generateCaptchaFailureStore.delete(ip);
}

function checkGenerateRateLimit(ip: string) {
  const now = Date.now();
  const current = generateRateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    generateRateLimitStore.set(ip, {
      count: 1,
      resetAt: now + GENERATE_RATE_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (current.count >= GENERATE_RATE_LIMIT_MAX) {
    return { allowed: false };
  }

  current.count += 1;
  generateRateLimitStore.set(ip, current);
  return { allowed: true };
}

function getDuplicateCacheKey(ip: string, payload: TrafficFormData) {
  const hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return `${ip}:${hash}`;
}

function getCachedDuplicate(cacheKey: string) {
  const cached = generateDuplicateCacheStore.get(cacheKey);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    generateDuplicateCacheStore.delete(cacheKey);
    return null;
  }

  return cached.result;
}

function setCachedDuplicate(cacheKey: string, result: GenerateResponse) {
  generateDuplicateCacheStore.set(cacheKey, {
    result,
    expiresAt: Date.now() + DUPLICATE_CACHE_TTL_MS,
  });
}

function withPetitionToken(petition: string, fullName: string) {
  return createPetitionToken(petition, fullName);
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const suspiciousHeaderReason = getSuspiciousHeaderReason(request);
    if (suspiciousHeaderReason) {
      logSuspiciousAttempt(suspiciousHeaderReason, request);
      return NextResponse.json(
        { error: "Güvenlik kontrolü başarısız oldu." },
        { status: 403 }
      );
    }

    if (isCaptchaBlocked(clientIp)) {
      logSuspiciousAttempt("captcha-failure-ip-blocked", request);
      return NextResponse.json(
        { error: "Çok fazla başarısız doğrulama denemesi yapıldı. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    if (!isTrustedOrigin(request)) {
      logSuspiciousAttempt("untrusted-origin", request);
      return NextResponse.json(
        { error: "Geçersiz istek kaynağı." },
        { status: 403 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Geçersiz içerik türü." },
        { status: 415 }
      );
    }

    const body = (await request.json()) as Partial<TrafficFormData> & {
      turnstileToken?: string;
    };

    const turnstileToken = body.turnstileToken?.trim() || "";
    if (!turnstileToken) {
      const failure = recordCaptchaFailure(clientIp);
      logSuspiciousAttempt("missing-turnstile-token", request, {
        captchaFailures: failure.count,
        blockedUntil: failure.blockedUntil || undefined,
      });
      return NextResponse.json(
        { error: "Lütfen güvenlik doğrulamasını tamamlayın." },
        { status: 400 }
      );
    }

    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey || turnstileSecretKey === "YOUR_SECRET_KEY") {
      return NextResponse.json(
        { error: "Güvenlik doğrulaması yapılandırması eksik." },
        { status: 500 }
      );
    }

    const verification = await validateTurnstileToken({
      token: turnstileToken,
      secretKey: turnstileSecretKey,
      remoteip: clientIp === "unknown" ? undefined : clientIp,
    });

    if (!verification.success) {
      const failure = recordCaptchaFailure(clientIp);
      logSuspiciousAttempt("invalid-turnstile-token", request, {
        captchaFailures: failure.count,
        blockedUntil: failure.blockedUntil || undefined,
        turnstileErrors: verification.error_codes || [],
      });
      return NextResponse.json(
        { error: "Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin." },
        { status: 403 }
      );
    }

    clearCaptchaFailures(clientIp);

    const payload = sanitizeTrafficPayload({
      fullName: body.fullName?.trim() || "",
      tckn: body.tckn?.trim() || "",
      plate: body.plate?.trim() || "",
      penaltyDate: body.penaltyDate?.trim() || "",
      notificationDate: body.notificationDate?.trim() || "",
      penaltyType: body.penaltyType?.trim() || "",
      location: body.location?.trim() || "",
      cameraStatus: body.cameraStatus?.trim() || "",
      institution: body.institution?.trim() || "",
      explanation: body.explanation?.trim() || "",
    }) satisfies TrafficFormData;

    if (
      !payload.fullName ||
      !payload.plate ||
      !payload.penaltyDate ||
      !payload.notificationDate ||
      !payload.penaltyType ||
      !payload.location ||
      !payload.cameraStatus ||
      !payload.explanation
    ) {
      return NextResponse.json(
        { error: "Lütfen zorunlu alanların tamamını doldurun." },
        { status: 400 }
      );
    }

    if (payload.tckn && !/^\d{11}$/.test(payload.tckn)) {
      return NextResponse.json(
        { error: "TCKN yalnızca 11 haneli rakamlardan oluşmalıdır." },
        { status: 400 }
      );
    }

    if (payload.notificationDate < payload.penaltyDate) {
      return NextResponse.json(
        { error: "Tebliğ tarihi, ceza tarihinden önce olamaz." },
        { status: 400 }
      );
    }

    const duplicateCacheKey = getDuplicateCacheKey(clientIp, payload);
    const cachedDuplicate = getCachedDuplicate(duplicateCacheKey);
    if (cachedDuplicate) {
      return NextResponse.json(cachedDuplicate);
    }

    const generateRateLimit = checkGenerateRateLimit(clientIp);
    if (!generateRateLimit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const fallbackResult = buildFallbackTrafficResult(payload);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const result = {
        ...fallbackResult,
        petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
      } satisfies GenerateResponse;
      setCachedDuplicate(duplicateCacheKey, result);
      return NextResponse.json(result);
    }

    try {
      const client = new OpenAI({ apiKey });
      const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

      const response = await client.responses.create({
        model,
        input: buildTrafficPrompt(payload),
      });

      const rawText = response.output_text?.trim();
      if (!rawText) {
        const result = {
          ...fallbackResult,
          petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
        } satisfies GenerateResponse;
        setCachedDuplicate(duplicateCacheKey, result);
        return NextResponse.json(result);
      }

      const parsed = JSON.parse(rawText) as {
        petition?: string;
        evaluationLevel?: "Düşük" | "Orta" | "Yüksek";
        evaluationComment?: string;
      };

      if (
        !parsed.petition ||
        !parsed.evaluationLevel ||
        !parsed.evaluationComment
      ) {
        const result = {
          ...fallbackResult,
          petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
        } satisfies GenerateResponse;
        setCachedDuplicate(duplicateCacheKey, result);
        return NextResponse.json(result);
      }

      const petition = parsed.petition.trim();

      const result = {
        petition,
        evaluationLevel: parsed.evaluationLevel,
        evaluationComment: parsed.evaluationComment.trim(),
        source: "openai",
        petitionToken: withPetitionToken(petition, payload.fullName),
      } satisfies GenerateResponse;
      setCachedDuplicate(duplicateCacheKey, result);
      return NextResponse.json(result);
    } catch (openAiError) {
      console.error("OpenAI generation failed, fallback returned:", openAiError);
      const result = {
        ...fallbackResult,
        petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
      } satisfies GenerateResponse;
      setCachedDuplicate(duplicateCacheKey, result);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Generate route failed before verified generation:", error);
    return NextResponse.json(
      { error: "Dilekçe oluşturulurken beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
