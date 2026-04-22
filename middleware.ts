import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_HOST = "www.itirazdilekcesi.com";
const ROOT_HOST = "itirazdilekcesi.com";

const defaultCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.clarity.ms https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.openai.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://challenges.cloudflare.com https://www.clarity.ms",
  "frame-src 'self' https://www.paytr.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const paytrResultCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.clarity.ms https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.openai.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://challenges.cloudflare.com https://www.clarity.ms",
  "frame-src 'self' https://www.paytr.com https://paytr.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-ancestors https://www.paytr.com https://paytr.com",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const GOOGLE_AD_QUERY_PARAMS = ["gclid", "gbraid", "wbraid", "gad_source"];

function isGoogleUrl(value: string) {
  try {
    const url = new URL(value);
    return /^([^/]+\.)?google\./i.test(url.hostname);
  } catch {
    return false;
  }
}

function isGoogleSourcedKiraciRequest(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  const hasGoogleAdParam = GOOGLE_AD_QUERY_PARAMS.some((param) =>
    request.nextUrl.searchParams.has(param)
  );

  return request.nextUrl.pathname === "/kiraci" && (isGoogleUrl(referer) || hasGoogleAdParam);
}

function applySecurityHeaders(response: NextResponse, pathname: string) {
  if (pathname === "/odeme/paytr-sonuc") {
    response.headers.delete("X-Frame-Options");
    response.headers.delete("Cross-Origin-Opener-Policy");
    response.headers.delete("Cross-Origin-Resource-Policy");
    response.headers.delete("Permissions-Policy");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Content-Security-Policy", paytrResultCsp);
    return response;
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Content-Security-Policy", defaultCsp);
  return response;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  if (host === ROOT_HOST) {
    url.protocol = "https:";
    url.host = PRIMARY_HOST;
    const redirectResponse = NextResponse.redirect(url, 308);
    return applySecurityHeaders(redirectResponse, url.pathname);
  }

  if (isGoogleSourcedKiraciRequest(request)) {
    url.pathname = "/trafik-cezasi-itiraz";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url, 307);
    return applySecurityHeaders(redirectResponse, url.pathname);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response, request.nextUrl.pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
