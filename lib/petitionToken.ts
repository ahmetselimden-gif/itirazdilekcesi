import { createHmac, timingSafeEqual } from "node:crypto";

type PetitionTokenPayload = {
  petition: string;
  fullName: string;
  exp: number;
};

function getSecret() {
  return (
    process.env.DOWNLOAD_ACCESS_SECRET ||
    process.env.IYZICO_SECRET_KEY ||
    "development-petition-secret"
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

export function createPetitionToken(
  petition: string,
  fullName: string,
  ttlSeconds = 60 * 60 * 4
) {
  const payload: PetitionTokenPayload = {
    petition,
    fullName,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encoded = encode(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyPetitionToken(token: string) {
  const [encoded, providedSignature] = token.split(".");

  if (!encoded || !providedSignature) {
    return { valid: false as const, reason: "Geçersiz dilekçe belirteci." };
  }

  const expectedSignature = sign(encoded);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false as const, reason: "Dilekçe imzası doğrulanamadı." };
  }

  try {
    const payload = JSON.parse(decode(encoded)) as PetitionTokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false as const, reason: "Dilekçe belirtecinin süresi dolmuş." };
    }

    return { valid: true as const, payload };
  } catch {
    return { valid: false as const, reason: "Dilekçe belirteci çözümlenemedi." };
  }
}
