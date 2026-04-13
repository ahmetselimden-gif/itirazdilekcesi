import { NextRequest, NextResponse } from "next/server";
import { buildMerchantOid, initializePaytrIframe } from "@/lib/paytr";

type PaymentInitRequest = {
  type: "kiraci" | "evsahibi";
  product: string;
  formData: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PaymentInitRequest;
    const { type, product, formData } = body;

    // Validate required parameters
    if (!type || !product || !formData) {
      return NextResponse.json(
        { error: "Eksik ödeme parametreleri" },
        { status: 400 }
      );
    }

    // Get user IP (from X-Forwarded-For or client IP)
    const userIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "0.0.0.0";

    const merchantOid = buildMerchantOid();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const encodedData = btoa(JSON.stringify(formData));

    // Initialize PayTR iframe
    const paytrResponse = await initializePaytrIframe({
      merchantOid,
      userIp,
      email: "payment@itirazdilekcesi.com",
      userName: "Dilekçe Ödeme",
      userAddress: "Türkiye",
      userPhone: "5555555555",
      okUrl: `${appUrl}/odeme/housing-pdf?oid=${merchantOid}&type=${type}&product=${product}&data=${encodeURIComponent(encodedData)}`,
      failUrl: `${appUrl}/odeme/paytr-sonuc?status=failed&oid=${merchantOid}`,
    });

    if (paytrResponse.status === "failed") {
      return NextResponse.json(
        { error: paytrResponse.reason || "Ödeme başlatılamadı" },
        { status: 500 }
      );
    }

    const token = paytrResponse.token;

    // Return token and redirect URL
    return NextResponse.json({
      success: true,
      token,
      redirectUrl: `/odeme/paytr?token=${encodeURIComponent(token)}&merchantOid=${merchantOid}&type=${type}&product=${product}`,
    });
  } catch (error) {
    console.error("PayTR initialization error:", error);
    return NextResponse.json(
      { error: "Ödeme işlemi başlatılırken hata oluştu" },
      { status: 500 }
    );
  }
}
