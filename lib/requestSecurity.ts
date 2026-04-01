const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __petitionRateLimitStore?: Map<string, RateEntry>;
};

const rateLimitStore =
  globalStore.__petitionRateLimitStore ??
  (globalStore.__petitionRateLimitStore = new Map<string, RateEntry>());

function getAllowedHosts(request: Request) {
  const allowed = new Set<string>([
    "www.itirazdilekcesi.com",
    "itirazdilekcesi.com",
    "localhost:3000",
    "localhost:3001",
    "localhost:3002",
    "localhost:3003",
    "localhost:3004",
    "localhost:3005",
    "localhost:3006",
    "localhost:3011",
    "localhost:3013",
    "localhost:3014",
    "localhost:3015",
    "localhost:3016",
  ]);

  const requestHost = request.headers.get("host");
  if (requestHost) {
    allowed.add(requestHost);
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    allowed.add(vercelUrl);
  }

  return allowed;
}

export function isTrustedOrigin(request: Request) {
  const allowedHosts = getAllowedHosts(request);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const isAllowed = (value: string | null) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);
      return allowedHosts.has(url.host);
    } catch {
      return false;
    }
  };

  return isAllowed(origin) && isAllowed(referer);
}

export function checkRateLimit(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();

  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  return { allowed: true, remaining: RATE_LIMIT_MAX - current.count };
}

export function sanitizeTrafficPayload(payload: {
  fullName: string;
  tckn: string;
  plate: string;
  penaltyDate: string;
  notificationDate: string;
  penaltyType: string;
  location: string;
  cameraStatus: string;
  institution: string;
  explanation: string;
}) {
  return {
    ...payload,
    fullName: payload.fullName.slice(0, 120),
    tckn: payload.tckn.slice(0, 11),
    plate: payload.plate.slice(0, 20),
    penaltyDate: payload.penaltyDate.slice(0, 10),
    notificationDate: payload.notificationDate.slice(0, 10),
    penaltyType: payload.penaltyType.slice(0, 50),
    location: payload.location.slice(0, 120),
    cameraStatus: payload.cameraStatus.slice(0, 20),
    institution: payload.institution.slice(0, 160),
    explanation: payload.explanation.slice(0, 3000),
  };
}
