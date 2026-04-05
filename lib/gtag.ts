declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

export function pageview(url: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_location: url,
    page_path: new URL(url).pathname,
  });
}

export function trackLead() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "generate_lead", {
    event_category: "petition",
    event_label: "traffic-petition-generated",
  });
}

export function trackPurchase(value = 19.99, currency = "TRY", transactionId?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "purchase", {
    value,
    currency,
    transaction_id: transactionId || `petition-${Date.now()}`,
  });

  if (adsId && conversionLabel) {
    window.gtag("event", "conversion", {
      send_to: `${adsId}/${conversionLabel}`,
      value,
      currency,
      transaction_id: transactionId || `petition-${Date.now()}`,
    });
  }
}

