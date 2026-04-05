import { createHmac, timingSafeEqual } from "node:crypto";

type DownloadAccessPayload = {
  orderId: string;
  conversationId: string;
  email: string;
  paidPrice: string;
  exp: number;
};

function getSecret() {
  return (
    process.env.DOWNLOAD_ACCESS_SECRET ||
    process.env.PAYTR_MERCHANT_SALT ||
    process.env.IYZICO_SECRET_KEY ||
    "development-download-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

export function createDownloadAccessToken(
  payload: Omit<DownloadAccessPayload, "exp"> & { ttlSeconds?: number }
) {
  const fullPayload: DownloadAccessPayload = {
    orderId: payload.orderId,
    conversationId: payload.conversationId,
    email: payload.email,
    paidPrice: payload.paidPrice,
    exp: Math.floor(Date.now() / 1000) + (payload.ttlSeconds ?? 60 * 60 * 2),
  };

  const encodedPayload = toBase64Url(JSON.stringify(fullPayload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyDownloadAccessToken(token: string) {
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return { valid: false as const, reason: "Geçersiz erişim belirteci." };
  }

  const expectedSignature = sign(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false as const, reason: "İmza doğrulanamadı." };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as DownloadAccessPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false as const, reason: "Erişim süresi dolmuş." };
    }

    return { valid: true as const, payload };
  } catch {
    return { valid: false as const, reason: "Belirteç çözümlenemedi." };
  }
}
