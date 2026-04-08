const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

function pushEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const globalWindow = window as Window & {
    dataLayer?: Record<string, unknown>[];
  };

  globalWindow.dataLayer = globalWindow.dataLayer || [];
  globalWindow.dataLayer.push(payload);
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

export function trackPetitionGenerated(penaltyType?: string) {
  pushEvent({
    event: "petition_generated",
    event_category: "petition",
    event_label: penaltyType || "traffic-petition",
  });
}

export function trackBeginCheckout(value = 19.99, currency = "TRY") {
  pushEvent({
    event: "begin_checkout",
    currency,
    value,
    items: [
      {
        item_id: "traffic-petition-pdf",
        item_name: "Trafik Cezasi Itiraz Dilekcesi PDF",
        price: value,
        quantity: 1,
      },
    ],
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

export function trackPdfDownload() {
  pushEvent({
    event: "pdf_download",
    event_category: "petition",
    event_label: "traffic-petition-pdf",
  });
}
