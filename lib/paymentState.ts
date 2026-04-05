import { createHmac, timingSafeEqual } from "node:crypto";

type PaymentStatePayload = {
  merchantOid: string;
  petitionToken: string;
  fullName: string;
  exp: number;
};

function getSecret() {
  return (
    process.env.DOWNLOAD_ACCESS_SECRET ||
    process.env.PAYTR_MERCHANT_SALT ||
    process.env.IYZICO_SECRET_KEY ||
    "development-payment-state-secret"
  );
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createPaymentStateToken(
  merchantOid: string,
  petitionToken: string,
  fullName: string,
  ttlSeconds = 60 * 60
) {
  const payload: PaymentStatePayload = {
    merchantOid,
    petitionToken,
    fullName,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyPaymentStateToken(token: string) {
  const [encoded, providedSignature] = token.split(".");

  if (!encoded || !providedSignature) {
    return { valid: false as const, reason: "Geçersiz ödeme oturumu." };
  }

  const expectedSignature = sign(encoded);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false as const, reason: "Ödeme oturumu doğrulanamadı." };
  }

  try {
    const payload = JSON.parse(decode(encoded)) as PaymentStatePayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false as const, reason: "Ödeme oturumunun süresi dolmuş." };
    }

    return { valid: true as const, payload };
  } catch {
    return { valid: false as const, reason: "Ödeme oturumu çözümlenemedi." };
  }
}
