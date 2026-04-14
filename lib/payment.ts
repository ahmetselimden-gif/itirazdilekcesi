export const PAYMENT_INITIATE_ENDPOINT = "/api/payments/paytr/initiate";
export const PAYMENT_VERIFY_ENDPOINT = "/api/payments/paytr/verify";
export const PAYMENT_DOWNLOAD_ENDPOINT = "/api/payments/download";
export const PAYMENT_ACCESS_TOKEN_KEY = "petition_payment_access_v2";

const allowedReturnPaths = new Set(["/trafik-cezasi-itiraz", "/kiraci", "/ev-sahibi"]);

export function getCheckoutSnapshotKey(panel: string) {
  return `petition_checkout_snapshot_${panel}_v1`;
}

export function sanitizePaymentReturnPath(path?: string) {
  if (!path || !allowedReturnPaths.has(path)) {
    return "/";
  }

  return path;
}

export function buildPaymentReturnUrl(
  appUrl: string,
  returnPath: string | undefined,
  status: "success" | "failed",
  params: Record<string, string>
) {
  const url = new URL(sanitizePaymentReturnPath(returnPath), appUrl);
  url.searchParams.set("payment", status);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}
