import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

type PaytrInitInput = {
  merchantOid: string;
  userIp: string;
  email: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  okUrl: string;
  failUrl: string;
};

type PaytrTokenResponse = {
  status: "success" | "failed";
  token?: string;
  reason?: string;
};

type PaytrStatusResponse = {
  status: "success" | "error";
  payment_amount?: string;
  payment_total?: string;
  payment_date?: string;
  currency?: string;
  test_mode?: string;
  err_no?: string;
  err_msg?: string;
};

type PaytrCallbackPayload = {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
  failed_reason_code?: string;
  failed_reason_msg?: string;
  test_mode?: string;
  payment_type?: string;
  currency?: string;
  payment_amount?: string;
};

const PAYMENT_AMOUNT = "1999";
const CURRENCY = "TL";

function getCredentials() {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchantId || !merchantKey || !merchantSalt) {
    throw new Error("PayTR anahtarları eksik.");
  }

  return {
    merchantId,
    merchantKey,
    merchantSalt,
  };
}

function getBaseUrl() {
  return "https://www.paytr.com";
}

function signBinary(data: string, key: string) {
  return createHmac("sha256", key).update(data).digest();
}

function toBase64(value: Buffer) {
  return value.toString("base64");
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `0${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits;
  }

  return "05555555555";
}

function encodeBasket() {
  const basket = [["Dijital Dilekçe Hazırlama", "19.99", 1]];
  return Buffer.from(JSON.stringify(basket), "utf8").toString("base64");
}

function buildIframeTokenHash(input: {
  merchantId: string;
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: string;
  userBasket: string;
  noInstallment: string;
  maxInstallment: string;
  currency: string;
  testMode: string;
  merchantSalt: string;
  merchantKey: string;
}) {
  const hashStr =
    input.merchantId +
    input.userIp +
    input.merchantOid +
    input.email +
    input.paymentAmount +
    input.userBasket +
    input.noInstallment +
    input.maxInstallment +
    input.currency +
    input.testMode;

  return toBase64(signBinary(`${hashStr}${input.merchantSalt}`, input.merchantKey));
}

export function buildMerchantOid() {
  return `petition${randomUUID().replace(/[^a-zA-Z0-9]/g, "").slice(0, 24)}`;
}

export function isTestMode() {
  return process.env.PAYTR_TEST_MODE === "true";
}

export function getPaymentAmount() {
  return PAYMENT_AMOUNT;
}

export async function initializePaytrIframe(input: PaytrInitInput) {
  const { merchantId, merchantKey, merchantSalt } = getCredentials();
  const userBasket = encodeBasket();
  const noInstallment = "0";
  const maxInstallment = "0";
  const testMode = isTestMode() ? "1" : "0";
  const debugOn = isTestMode() ? "1" : "0";
  const paytrToken = buildIframeTokenHash({
    merchantId,
    userIp: input.userIp,
    merchantOid: input.merchantOid,
    email: input.email,
    paymentAmount: PAYMENT_AMOUNT,
    userBasket,
    noInstallment,
    maxInstallment,
    currency: CURRENCY,
    testMode,
    merchantSalt,
    merchantKey,
  });

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: input.userIp,
    merchant_oid: input.merchantOid,
    email: input.email,
    payment_amount: PAYMENT_AMOUNT,
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: debugOn,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: input.userName,
    user_address: input.userAddress,
    user_phone: normalizePhone(input.userPhone),
    merchant_ok_url: input.okUrl,
    merchant_fail_url: input.failUrl,
    timeout_limit: "30",
    currency: CURRENCY,
    test_mode: testMode,
    lang: "tr",
    iframe_v2: "1",
    iframe_v2_dark: "0",
  });

  const response = await fetch(`${getBaseUrl()}/odeme/api/get-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const data = (await response.json()) as PaytrTokenResponse;
  return data;
}

export function buildPaytrIframeUrl(token: string) {
  return `${getBaseUrl()}/odeme/guvenli/${token}`;
}

export function verifyPaytrCallbackHash(payload: PaytrCallbackPayload) {
  const { merchantKey, merchantSalt } = getCredentials();
  const expected = toBase64(
    signBinary(
      `${payload.merchant_oid}${merchantSalt}${payload.status}${payload.total_amount}`,
      merchantKey
    )
  );

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(payload.hash || "");

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

export async function queryPaytrPayment(merchantOid: string) {
  const { merchantId, merchantKey, merchantSalt } = getCredentials();
  const paytrToken = toBase64(
    signBinary(`${merchantId}${merchantOid}${merchantSalt}`, merchantKey)
  );

  const body = new URLSearchParams({
    merchant_id: merchantId,
    merchant_oid: merchantOid,
    paytr_token: paytrToken,
  });

  const response = await fetch(`${getBaseUrl()}/odeme/durum-sorgu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const data = (await response.json()) as PaytrStatusResponse;
  return data;
}
