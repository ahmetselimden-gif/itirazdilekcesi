import { createHmac, randomUUID } from "node:crypto";

type IyzicoBuyerInput = {
  fullName: string;
  tckn?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  ip: string;
};

type IyzicoInitPayload = {
  buyer: IyzicoBuyerInput;
  conversationId: string;
  callbackUrl: string;
};

type IyzicoBaseResponse = {
  status?: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
};

export type IyzicoInitializeResponse = IyzicoBaseResponse & {
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
  conversationId?: string;
};

export type IyzicoRetrieveResponse = IyzicoBaseResponse & {
  conversationId?: string;
  token?: string;
  paymentStatus?: string;
  paidPrice?: number | string;
  price?: number | string;
  paymentId?: string | number;
  basketId?: string;
};

const PRODUCT_PRICE = "19.99";
const CURRENCY = "TRY";

function getBaseUrl() {
  return process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
}

function getCredentials() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("Ödeme altyapısı anahtarları eksik.");
  }

  return { apiKey, secretKey };
}

function normalizePrice(value: string) {
  return Number(value).toFixed(2);
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "Başvuran";
  const lastName = parts.join(" ") || "Kullanıcı";
  return { firstName, lastName };
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+9${digits}`;
  }

  if (digits.length === 10) {
    return `+90${digits}`;
  }

  return value;
}

function createAuthorization(uriPath: string, body: string) {
  const { apiKey, secretKey } = getCredentials();
  const randomKey = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  const signature = createHmac("sha256", secretKey)
    .update(`${randomKey}${uriPath}${body}`)
    .digest("hex");

  const authorization = Buffer.from(
    `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`,
    "utf8"
  ).toString("base64");

  return {
    randomKey,
    authorization: `IYZWSv2 ${authorization}`,
  };
}

async function iyzicoRequest<TResponse>(
  uriPath: string,
  payload: Record<string, unknown>
) {
  const body = JSON.stringify(payload);
  const { randomKey, authorization } = createAuthorization(uriPath, body);

  const response = await fetch(`${getBaseUrl()}${uriPath}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      "x-iyzi-rnd": randomKey,
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as TResponse;
  return data;
}

export function getProductPrice() {
  return PRODUCT_PRICE;
}

export function isSandboxMode() {
  return getBaseUrl().includes("sandbox");
}

export function getCallbackUrl() {
  const appUrl = process.env.APP_URL || "https://www.itirazdilekcesi.com";
  return `${appUrl}/api/payments/iyzico/callback`;
}

export function buildConversationId() {
  return `petition-${randomUUID()}`;
}

export function validateBuyerIdentity(tckn?: string) {
  if (tckn && /^\d{11}$/.test(tckn)) {
    return tckn;
  }

  if (isSandboxMode()) {
    return "11111111110";
  }

  throw new Error("Canlı ödeme için geçerli bir TCKN gereklidir.");
}

export async function initializeCheckoutForm({
  buyer,
  conversationId,
  callbackUrl,
}: IyzicoInitPayload) {
  const { firstName, lastName } = splitFullName(buyer.fullName);
  const identityNumber = validateBuyerIdentity(buyer.tckn);
  const contactAddress = buyer.address.trim();
  const city = buyer.city.trim();
  const email = buyer.email.trim();
  const gsmNumber = normalizePhone(buyer.phone);

  return iyzicoRequest<IyzicoInitializeResponse>(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    {
      locale: "tr",
      conversationId,
      price: normalizePrice(PRODUCT_PRICE),
      paidPrice: normalizePrice(PRODUCT_PRICE),
      currency: CURRENCY,
      basketId: conversationId,
      paymentGroup: "PRODUCT",
      callbackUrl,
      buyer: {
        id: conversationId,
        name: firstName,
        surname: lastName,
        gsmNumber,
        email,
        identityNumber,
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: contactAddress,
        ip: buyer.ip,
        city,
        country: "Turkey",
        zipCode: "34000",
      },
      billingAddress: {
        contactName: buyer.fullName,
        city,
        country: "Turkey",
        address: contactAddress,
        zipCode: "34000",
      },
      basketItems: [
        {
          id: conversationId,
          name: "Dijital Dilekçe Hazırlama",
          category1: "Hukuk",
          category2: "Dijital Hizmet",
          itemType: "VIRTUAL",
          price: normalizePrice(PRODUCT_PRICE),
        },
      ],
    }
  );
}

export async function retrieveCheckoutForm(token: string, conversationId?: string) {
  return iyzicoRequest<IyzicoRetrieveResponse>(
    "/payment/iyzipos/checkoutform/auth/ecom/detail",
    {
      locale: "tr",
      conversationId: conversationId || `retrieve-${Date.now()}`,
      token,
    }
  );
}
