import { NextResponse } from "next/server";
import { createDownloadAccessToken } from "@/lib/downloadAccess";
import { verifyPaymentStateToken } from "@/lib/paymentState";
import { queryPaytrPayment } from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantOid = searchParams.get("oid") || "";
    const stateToken = searchParams.get("state") || "";

    if (!merchantOid || !stateToken) {
      return NextResponse.json(
        { valid: false, error: "Ödeme doğrulama bilgisi eksik." },
        { status: 400 }
      );
    }

    const stateVerification = verifyPaymentStateToken(stateToken);
    if (!stateVerification.valid) {
      return NextResponse.json(
        { valid: false, error: stateVerification.reason },
        { status: 401 }
      );
    }

    if (stateVerification.payload.merchantOid !== merchantOid) {
      return NextResponse.json(
        { valid: false, error: "Sipariş numarası doğrulanamadı." },
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
