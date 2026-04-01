import { NextResponse } from "next/server";
import { verifyDownloadAccessToken } from "@/lib/downloadAccess";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, error: "Belirteç eksik." }, { status: 400 });
  }

  const verification = verifyDownloadAccessToken(token);

  if (!verification.valid) {
    return NextResponse.json({ valid: false, error: verification.reason }, { status: 401 });
  }

  return NextResponse.json({
    valid: true,
    orderId: verification.payload.orderId,
    conversationId: verification.payload.conversationId,
    paidPrice: verification.payload.paidPrice,
    email: verification.payload.email,
  });
}
