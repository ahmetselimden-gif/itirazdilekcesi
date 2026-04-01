import { NextResponse } from "next/server";
import {
  buildConversationId,
  getCallbackUrl,
  initializeCheckoutForm,
} from "@/lib/iyzico";
import { verifyPetitionToken } from "@/lib/petitionToken";
import { isTrustedOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
    }

    const body = (await request.json()) as {
      fullName?: string;
      tckn?: string;
      email?: string;
      phone?: string;
      petitionToken?: string;
    };

    const fullName = body.fullName?.trim() || "";
    const email = body.email?.trim() || "";
    const phone = body.phone?.trim() || "";
    const tckn = body.tckn?.trim() || "";
    const petitionToken = body.petitionToken?.trim() || "";

    if (!fullName || !email || !phone || !petitionToken) {
      return NextResponse.json(
        { error: "Ödeme için gerekli iletişim alanları ve dilekçe belirteci gereklidir." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    if (tckn && !/^\d{11}$/.test(tckn)) {
      return NextResponse.json({ error: "TCKN 11 haneli olmalıdır." }, { status: 400 });
    }

    const petitionVerification = verifyPetitionToken(petitionToken);
    if (!petitionVerification.valid) {
      return NextResponse.json({ error: petitionVerification.reason }, { status: 401 });
    }

    const conversationId = buildConversationId();
    const callbackUrl = new URL(getCallbackUrl());
    callbackUrl.searchParams.set("petition", petitionToken);
    callbackUrl.searchParams.set("email", email);

    const response = await initializeCheckoutForm({
      conversationId,
      callbackUrl: callbackUrl.toString(),
      buyer: {
        fullName,
        tckn,
        email,
        phone,
        address: "Dijital hizmet teslimatı",
        city: "Istanbul",
        ip: getClientIp(request),
      },
    });

    if (response.status !== "success" || !response.paymentPageUrl || !response.token) {
      return NextResponse.json(
        {
          error:
            response.errorMessage ||
            "Ödeme formu başlatılamadı. Ayarlarınızı kontrol edin.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      checkoutUrl: response.paymentPageUrl,
      token: response.token,
      conversationId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ödeme başlatılırken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
