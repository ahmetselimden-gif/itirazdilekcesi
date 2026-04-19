"use client";

type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

type EventParams = Record<string, string | number | boolean | undefined>;

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

function pushDataLayerEvent(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  if ("ecommerce" in params) {
    window.dataLayer.push({ ecommerce: null });
  }

  window.dataLayer.push({
    event,
    ...params,
  });

  if (typeof window.gtag === "function") {
    const gtagParams =
      typeof params.ecommerce === "object" && params.ecommerce !== null
        ? {
            ...(params.ecommerce as Record<string, unknown>),
            event_category: params.event_category,
            panel: params.panel,
          }
        : params;

    window.gtag("event", event, gtagParams);
  }
}

export function trackEvent(event: string, params: EventParams = {}) {
  pushDataLayerEvent(event, {
    event_category: "petition_funnel",
    ...params,
  });
}

export function trackPetitionGenerateStart(panel: string) {
  trackEvent("petition_generate_start", { panel });
}

export function trackPetitionGenerateSuccess(panel: string) {
  trackEvent("petition_generate_success", { panel });
}

export function trackPetitionGenerateError(panel: string, message?: string) {
  trackEvent("petition_generate_error", {
    panel,
    error_message: message,
  });
}

export function trackPaymentPanelOpen(panel: string) {
  trackEvent("payment_panel_open", { panel });
}

export function trackPdfDownloadStart(fileName: string) {
  trackEvent("pdf_download_start", { file_name: fileName });
}

export function trackPdfDownloadSuccess(fileName: string) {
  trackEvent("pdf_download_success", { file_name: fileName });
}

export function trackPdfDownloadError(fileName: string, message?: string) {
  trackEvent("pdf_download_error", {
    file_name: fileName,
    error_message: message,
  });
}

export function trackBeginCheckout(panel?: string) {
  pushDataLayerEvent("begin_checkout", {
    event_category: "ecommerce",
    panel,
    ecommerce: {
    value: 19.99,
    currency: "TRY",
    items: [PETITION_ITEM],
    },
  });
}

export function trackPurchase(transactionId: string, paidPrice?: string | number) {
  const numericPrice =
    typeof paidPrice === "number"
      ? paidPrice
      : Number(String(paidPrice || "19.99").replace(",", "."));
  const value = Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : 19.99;

  pushDataLayerEvent("purchase", {
    event_category: "ecommerce",
    ecommerce: {
      transaction_id: transactionId,
      value,
      currency: "TRY",
      items: [
        {
          ...PETITION_ITEM,
          price: value,
        },
      ],
    },
  });
}
