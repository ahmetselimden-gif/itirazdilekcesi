import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildFallbackTrafficResult,
  buildTrafficPrompt,
  type TrafficFormData,
} from "@/lib/trafficPetition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TrafficFormData>;
    const payload: TrafficFormData = {
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
    };

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

    const fallbackResult = buildFallbackTrafficResult(payload);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(fallbackResult);
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
        return NextResponse.json(fallbackResult);
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
        return NextResponse.json(fallbackResult);
      }

      return NextResponse.json({
        petition: parsed.petition.trim(),
        evaluationLevel: parsed.evaluationLevel,
        evaluationComment: parsed.evaluationComment.trim(),
        source: "openai",
      });
    } catch (openAiError) {
      console.error("OpenAI generation failed, fallback returned:", openAiError);
      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error("Route failed before generation, using emergency fallback:", error);

    return NextResponse.json(
      {
        petition:
          "T.C.\nNÖBETÇİ SULH CEZA HÂKİMLİĞİ'NE\n\nKONU: Trafik idari para cezasına itiraz ve iptal istemidir.\n\nBaşvuran Bilgileri\nAd Soyad: [Bilgi alınamadı]\n\nAçıklamalar\nBaşvuru işlenirken teknik bir hata oluşmuştur. Kullanıcının verileri tekrar alınarak yeniden değerlendirme yapılması gerekmektedir.\n\nHukuki Nedenler\nKarayolları Trafik Kanunu, İdari Yargılama Usulü Kanunu ve ilgili mevzuat.\n\nSonuç ve İstem\nHukuka aykırı olduğu değerlendirilen idari para cezasının iptaline karar verilmesini saygılarımla arz ve talep ederim.\n\nTarih: .... / .... / ........\nİmza: [Başvuran]",
        evaluationLevel: "Orta",
        evaluationComment:
          "Teknik nedenle yedek dilekçe metni üretildi. Form bilgileri yeniden gönderildiğinde daha ayrıntılı metin oluşturulabilir.",
        source: "fallback",
      },
      { status: 200 }
    );
  }
}
