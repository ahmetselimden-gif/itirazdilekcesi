"use client";

import type { ReactNode } from "react";
import { trackBeginCheckout } from "@/lib/analytics";
import { PAYMENT_INITIATE_ENDPOINT } from "@/lib/payment";

type PaymentButtonProps = {
  fullName: string;
  tckn?: string;
  petitionToken?: string;
  returnPath: string;
  disabled?: boolean;
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string) => void;
  children?: ReactNode;
};

const buttonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto";

export default function PaymentButton({
  fullName,
  tckn = "",
  petitionToken = "",
  returnPath,
  disabled = false,
  isLoading = false,
  onLoadingChange,
  onError,
  children = "PDF indir (Ücretli)",
}: PaymentButtonProps) {
  const handlePaymentStart = async () => {
    onError?.("");

    if (!petitionToken) {
      onError?.("Dilekçe güvenlik belirteci oluşturulamadı. Lütfen metni yeniden üretin.");
      return;
    }

    onLoadingChange?.(true);

    try {
      const response = await fetch(PAYMENT_INITIATE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          tckn,
          petitionToken,
          returnPath,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Ödeme sayfası açılamadı.");
      }

      trackBeginCheckout();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Ödeme başlatılırken beklenmeyen bir hata oluştu."
      );
      onLoadingChange?.(false);
    }
  };

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={disabled || isLoading}
      onClick={handlePaymentStart}
    >
      {isLoading ? "Ödeme sayfası açılıyor..." : children}
    </button>
  );
}
