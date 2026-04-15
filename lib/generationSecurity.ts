import { validateTurnstileToken } from "next-turnstile";
import { NextResponse } from "next/server";

type CaptchaFailureEntry = {
  count: number;
  blockedUntil: number;
  resetAt: number;
};

const CAPTCHA_FAILURE_WINDOW_MS = 15 * 60_000;
const CAPTCHA_BLOCK_MS = 15 * 60_000;
const CAPTCHA_FAILURE_LIMIT = 5;

const globalStore = globalThis as typeof globalThis & {
  __generationCaptchaFailureStore?: Map<string, CaptchaFailureEntry>;
};

const generationCaptchaFailureStore =
  globalStore.__generationCaptchaFailureStore ??
  (globalStore.__generationCaptchaFailureStore = new Map<string, CaptchaFailureEntry>());

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export function logSuspiciousGenerationAttempt(
  reason: string,
  request: Request,
  details: Record<string, unknown> = {}
) {
  console.warn("[generation-security]", {
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
  const entry = generationCaptchaFailureStore.get(ip);

  if (!entry) {
    return false;
  }

  if (entry.blockedUntil > Date.now()) {
    return true;
  }

  if (entry.resetAt <= Date.now()) {
    generationCaptchaFailureStore.delete(ip);
  }

  return false;
}

function recordCaptchaFailure(ip: string) {
  const now = Date.now();
  const current = generationCaptchaFailureStore.get(ip);
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

  generationCaptchaFailureStore.set(ip, entry);
  return entry;
}

function clearCaptchaFailures(ip: string) {
  generationCaptchaFailureStore.delete(ip);
}

export async function validateGenerationSecurity(
  request: Request,
  turnstileToken: string
) {
  const clientIp = getClientIp(request);
  const suspiciousHeaderReason = getSuspiciousHeaderReason(request);

  if (suspiciousHeaderReason) {
    logSuspiciousGenerationAttempt(suspiciousHeaderReason, request);
    return NextResponse.json(
      { error: "Güvenlik kontrolü başarısız oldu." },
      { status: 403 }
    );
  }

  if (isCaptchaBlocked(clientIp)) {
    logSuspiciousGenerationAttempt("captcha-failure-ip-blocked", request);
    return NextResponse.json(
      { error: "Çok fazla başarısız doğrulama denemesi yapıldı. Lütfen daha sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  if (!turnstileToken) {
    const failure = recordCaptchaFailure(clientIp);
    logSuspiciousGenerationAttempt("missing-turnstile-token", request, {
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
    logSuspiciousGenerationAttempt("invalid-turnstile-token", request, {
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
  return null;
}
