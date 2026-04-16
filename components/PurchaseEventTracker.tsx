"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function PurchaseEventTracker() {
  useEffect(() => {
    if (!window.location.search.includes("payment=success")) {
      return;
    }

    const purchaseEvent = {
      transaction_id: Date.now().toString(),
      value: 20,
      currency: "TRY",
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase",
      ...purchaseEvent,
    });

    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", purchaseEvent);
    }
  }, []);

  return null;
}
