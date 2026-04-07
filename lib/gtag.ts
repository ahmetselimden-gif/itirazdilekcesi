declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

function pushEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function pageview(url: string) {
  pushEvent({
    event: "page_view",
    page_location: url,
    page_path: new URL(url).pathname,
  });
}

export function trackLead() {
  pushEvent({
    event: "generate_lead",
    event_category: "petition",
    event_label: "traffic-petition-generated",
  });
}

export function trackPurchase(value = 19.99, currency = "TRY", transactionId?: string) {
  const resolvedTransactionId = transactionId || `petition-${Date.now()}`;

  pushEvent({
    event: "purchase",
    value,
    currency,
    transaction_id: resolvedTransactionId,
  });

  if (adsId && conversionLabel) {
    pushEvent({
      event: "ads_conversion",
      send_to: `${adsId}/${conversionLabel}`,
      value,
      currency,
      transaction_id: resolvedTransactionId,
    });
  }
}

