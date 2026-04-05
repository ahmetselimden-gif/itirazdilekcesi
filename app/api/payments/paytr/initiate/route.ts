import { NextResponse } from "next/server";
import {
  buildMerchantOid,
  initializePaytrIframe,
  isTestMode,
} from "@/lib/paytr";
import { verifyPetitionToken } from "@/lib/petitionToken";
import { isTrustedOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";
}

function getAppUrl() {
  return process.env.APP_URL || "https://www.itirazdilekcesi.com";
}

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
    }

    const body = (await request.json()) as {
      fullName?: string;
      tckn?: string;
      petitionToken?: string;
    };

    const fullName = body.fullName?.trim() || "";
    const tckn = body.tckn?.trim() || "";
    const petitionToken = body.petitionToken?.trim() || "";

    if (!fullName || !petitionToken) {
      return NextResponse.json(
        { error: "Ödeme için ad soyad ve dilekçe belirteci gereklidir." },
        { status: 400 }
      );
    }

    if (tckn && !/^\d{11}$/.test(tckn)) {
      return NextResponse.json({ error: "TCKN 11 haneli olmalıdır." }, { status: 400 });
    }

    const petitionVerification = verifyPetitionToken(petitionToken);
    if (!petitionVerification.valid) {
      return NextResponse.json({ error: petitionVerification.reason }, { status: 401 });
    }

    const merchantOid = buildMerchantOid();
    const appUrl = getAppUrl();
    const okUrl = new URL("/", appUrl);
    okUrl.searchParams.set("payment", "success");
    okUrl.searchParams.set("oid", merchantOid);

    const failUrl = new URL("/", appUrl);
    failUrl.searchParams.set("payment", "failed");
    failUrl.searchParams.set("message", "Ödeme tamamlanamadı.");

    const response = await initializePaytrIframe({
      merchantOid,
      userIp: getClientIp(request),
      email: "destek@itirazdilekcesi.com",
      userName: fullName,
      userAddress: "Dijital hizmet teslimatı",
      userPhone: "05061021401",
      okUrl: okUrl.toString(),
      failUrl: failUrl.toString(),
    });

    if (response.status !== "success" || !response.token) {
      return NextResponse.json(
        {
          error:
            response.reason ||
            "PayTR ödeme formu başlatılamadı. Ayarlarınızı kontrol edin.",
        },
        { status: 400 }
      );
    }

    const checkoutUrl = `/odeme/paytr?token=${encodeURIComponent(
      response.token
    )}&test=${isTestMode() ? "1" : "0"}`;

    return NextResponse.json({
      checkoutUrl,
      merchantOid,
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
