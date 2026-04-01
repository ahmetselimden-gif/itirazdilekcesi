import { NextResponse } from "next/server";
import { createDownloadAccessToken } from "@/lib/downloadAccess";
import { retrieveCheckoutForm } from "@/lib/iyzico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildReturnUrl(searchParams: URLSearchParams) {
  const appUrl = process.env.APP_URL || "https://www.itirazdilekcesi.com";
  const url = new URL("/", appUrl);

  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = String(formData.get("token") || "");
    const conversationId = String(formData.get("conversationId") || "");

    if (!token) {
      const failedUrl = buildReturnUrl(
        new URLSearchParams({
          payment: "failed",
          message: "Odeme sonucu alinamadi.",
        })
      );
      return NextResponse.redirect(failedUrl, 303);
    }

    const result = await retrieveCheckoutForm(token, conversationId);

    if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      const failedUrl = buildReturnUrl(
        new URLSearchParams({
          payment: "failed",
          message: result.errorMessage || "Odeme dogrulanamadi.",
        })
      );
      return NextResponse.redirect(failedUrl, 303);
    }

    const accessToken = createDownloadAccessToken({
      orderId: String(result.paymentId || result.basketId || token),
      conversationId: result.conversationId || conversationId || "petition-payment",
      email: String(formData.get("buyerEmail") || ""),
      paidPrice: String(result.paidPrice || result.price || "19.99"),
    });

    const successUrl = buildReturnUrl(
      new URLSearchParams({
        payment: "success",
        access: accessToken,
      })
    );

    return NextResponse.redirect(successUrl, 303);
  } catch {
    const failedUrl = buildReturnUrl(
      new URLSearchParams({
        payment: "failed",
        message: "Odeme sonucu islenirken hata olustu.",
      })
    );
    return NextResponse.redirect(failedUrl, 303);
  }
}
