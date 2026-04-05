import { NextResponse } from "next/server";
import { createDownloadAccessToken } from "@/lib/downloadAccess";
import { verifyPetitionToken } from "@/lib/petitionToken";
import { queryPaytrPayment } from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      oid?: string;
      petitionToken?: string;
    };

    const merchantOid = body.oid?.trim() || "";
    const petitionToken = body.petitionToken?.trim() || "";

    if (!merchantOid || !petitionToken) {
      return NextResponse.json(
        { valid: false, error: "Ödeme doğrulama bilgisi eksik." },
        { status: 400 }
      );
    }

    const petitionVerification = verifyPetitionToken(petitionToken);
    if (!petitionVerification.valid) {
      return NextResponse.json(
        { valid: false, error: petitionVerification.reason },
        { status: 401 }
      );
    }

    const result = await queryPaytrPayment(merchantOid);
    if (result.status !== "success") {
      return NextResponse.json(
        {
          valid: false,
          error: result.err_msg || "PayTR ödeme sonucu doğrulanamadı.",
        },
        { status: 400 }
      );
    }

    const paidPrice = result.payment_total || result.payment_amount || "19.99";
    const accessToken = createDownloadAccessToken({
      orderId: merchantOid,
      conversationId: merchantOid,
      email: "destek@itirazdilekcesi.com",
      paidPrice: String(paidPrice).replace(",", "."),
    });

    return NextResponse.json({
      valid: true,
      accessToken,
      orderId: merchantOid,
      paidPrice,
    });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        error:
          error instanceof Error
            ? error.message
            : "Ödeme doğrulaması sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
