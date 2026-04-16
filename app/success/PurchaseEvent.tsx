"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function PurchaseEvent() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtagFallback(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    window.gtag("event", "purchase", {
      transaction_id: Date.now().toString(),
      value: 20,
      currency: "TRY",
    });
  }, []);

  return null;
}
