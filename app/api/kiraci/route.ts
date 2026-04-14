import { NextResponse } from "next/server";
import {
  generateHousingPetition,
  sanitizeHousingPetitionData,
  validateHousingPetitionData,
  type HousingPetitionData,
} from "@/lib/generatePetition";
import { createPetitionToken } from "@/lib/petitionToken";
import { checkRateLimit, isTrustedOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
    }

    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Partial<HousingPetitionData>;
    const payload = sanitizeHousingPetitionData(body);
    const validationError = validateHousingPetitionData(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = await generateHousingPetition("kiraci", payload);

    return NextResponse.json({
      ...result,
      petitionToken: createPetitionToken(result.petition, payload.fullName),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Dilekçe oluşturulurken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
