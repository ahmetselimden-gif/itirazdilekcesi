import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildFallbackTrafficResult,
  buildTrafficPrompt,
  type TrafficFormData,
} from "@/lib/trafficPetition";
import { createPetitionToken } from "@/lib/petitionToken";
import {
  checkRateLimit,
  isTrustedOrigin,
  sanitizeTrafficPayload,
} from "@/lib/requestSecurity";
import { isTurnstileEnabled, validateTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withPetitionToken(petition: string, fullName: string) {
  return createPetitionToken(petition, fullName);
}

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json(
        { error: "Geçersiz istek kaynağı." },
        { status: 403 }
      );
    }

    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 }
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

    if (isTurnstileEnabled()) {
      const turnstileToken = body.turnstileToken?.trim() || "";
      if (!turnstileToken) {
        return NextResponse.json(
          { error: "Lütfen güvenlik doğrulamasını tamamlayın." },
          { status: 400 }
        );
      }

      const forwardedFor = request.headers.get("x-forwarded-for");
      const remoteip = forwardedFor?.split(",")[0]?.trim();
      const verification = await validateTurnstileToken(turnstileToken, remoteip);

      if (!verification.success) {
        return NextResponse.json(
          { error: "Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin." },
          { status: 400 }
        );
      }
    }

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

    const fallbackResult = buildFallbackTrafficResult(payload);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...fallbackResult,
        petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
      });
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
        return NextResponse.json({
          ...fallbackResult,
          petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
        });
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
        return NextResponse.json({
          ...fallbackResult,
          petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
        });
      }

      const petition = parsed.petition.trim();

      return NextResponse.json({
        petition,
        evaluationLevel: parsed.evaluationLevel,
        evaluationComment: parsed.evaluationComment.trim(),
        source: "openai",
        petitionToken: withPetitionToken(petition, payload.fullName),
      });
    } catch (openAiError) {
      console.error("OpenAI generation failed, fallback returned:", openAiError);
      return NextResponse.json({
        ...fallbackResult,
        petitionToken: withPetitionToken(fallbackResult.petition, payload.fullName),
      });
    }
  } catch (error) {
    console.error("Route failed before generation, using emergency fallback:", error);

    const emergencyPetition =
      "T.C.\nNÖBETÇİ SULH CEZA HÂKİMLİĞİ'NE\n\nKONU: Trafik idari para cezasına itiraz ve iptal istemidir.\n\nBaşvuran Bilgileri\nAd Soyad: [Bilgi alınamadı]\n\nAçıklamalar\nBaşvuru işlenirken teknik bir hata oluşmuştur. Kullanıcının verileri tekrar alınarak yeniden değerlendirme yapılması gerekmektedir.\n\nHukuki Nedenler\nKarayolları Trafik Kanunu, İdari Yargılama Usulü Kanunu ve ilgili mevzuat.\n\nSonuç ve İstem\nHukuka aykırı olduğu değerlendirilen idari para cezasının iptaline karar verilmesini saygılarımla arz ve talep ederim.\n\nTarih: .... / .... / ........\nİmza: [Başvuran]";

    return NextResponse.json(
      {
        petition: emergencyPetition,
        evaluationLevel: "Orta",
        evaluationComment:
          "Teknik nedenle yedek dilekçe metni üretildi. Form bilgileri yeniden gönderildiğinde daha ayrıntılı metin oluşturulabilir.",
        source: "fallback",
        petitionToken: withPetitionToken(emergencyPetition, "Başvuran"),
      },
      { status: 200 }
    );
  }
}
