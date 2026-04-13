import { NextRequest, NextResponse } from "next/server";
import { verifyPaytrCallbackHash, queryPaytrPayment } from "@/lib/paytr";

type PaytrCallbackPayload = {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
  failed_reason_code?: string;
  failed_reason_msg?: string;
  test_mode?: string;
  payment_type?: string;
  currency?: string;
  payment_amount?: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as PaytrCallbackPayload;

    // Verify the callback hash to ensure it's from PayTR
    const isValid = verifyPaytrCallbackHash(payload);

    if (!isValid) {
      console.error("Invalid PayTR callback hash");
      return NextResponse.json(
        { error: "Geçersiz imza" },
        { status: 401 }
      );
    }

    // Query PayTR to double-check payment status
    const paymentStatus = await queryPaytrPayment(payload.merchant_oid);

    if (paymentStatus.status !== "success") {
      console.error("Payment verification failed:", paymentStatus);
      return NextResponse.json(
        {
          status: "failed",
          message: paymentStatus.err_msg || "Ödeme doğrulanamadı",
        }
      );
    }

    // Payment is successful
    // In a real application, you would:
    // 1. Store the payment record in database
    // 2. Generate and store the PDF
    // 3. Send confirmation email
    // 4. Return a token that allows PDF download

    return NextResponse.json({
      status: "success",
      message: "Ödeme başarıyla tamamlandı",
      merchantOid: payload.merchant_oid,
    });
  } catch (error) {
    console.error("PayTR callback error:", error);
    return NextResponse.json(
      { error: "Callback işleme hatası" },
      { status: 500 }
    );
  }
}
