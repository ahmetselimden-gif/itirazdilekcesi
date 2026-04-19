"use client";

type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

type EcommercePayload = {
  transaction_id?: string;
  value: number;
  currency: "TRY";
  items: EcommerceItem[];
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const PETITION_ITEM: EcommerceItem = {
  item_id: "digital-petition-pdf",
  item_name: "Dijital Dilekce PDF",
  price: 19.99,
  quantity: 1,
};

function pushDataLayerEvent(event: string, ecommerce: EcommercePayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event,
    ecommerce,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, ecommerce);
  }
}

export function trackBeginCheckout() {
  pushDataLayerEvent("begin_checkout", {
    value: 19.99,
    currency: "TRY",
    items: [PETITION_ITEM],
  });
}

export function trackPurchase(transactionId: string, paidPrice?: string | number) {
  const numericPrice =
    typeof paidPrice === "number"
      ? paidPrice
      : Number(String(paidPrice || "19.99").replace(",", "."));
  const value = Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : 19.99;

  pushDataLayerEvent("purchase", {
    transaction_id: transactionId,
    value,
    currency: "TRY",
    items: [
      {
        ...PETITION_ITEM,
        price: value,
      },
    ],
  });
}
