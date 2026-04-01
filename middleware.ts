import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_HOST = "www.itirazdilekcesi.com";
const ROOT_HOST = "itirazdilekcesi.com";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  if (host === ROOT_HOST) {
    url.protocol = "https:";
    url.host = PRIMARY_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
