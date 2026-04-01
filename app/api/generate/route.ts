import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildFallbackTrafficResult,
  buildTrafficPrompt,
  type TrafficFormData,
} from "@/lib/trafficPetition";

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(buildFallbackTrafficResult(payload));
    }

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      input: buildTrafficPrompt(payload),
    });

    const rawText = response.output_text?.trim();

    if (!rawText) {
      return NextResponse.json(buildFallbackTrafficResult(payload));
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
      return NextResponse.json(buildFallbackTrafficResult(payload));
    }

    return NextResponse.json({
      petition: parsed.petition.trim(),
      evaluationLevel: parsed.evaluationLevel,
      evaluationComment: parsed.evaluationComment.trim(),
      source: "openai",
    });
  } catch (error) {
    console.error("Petition generation failed:", error);

    return NextResponse.json(
      {
        error:
          "Dilekçe oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
