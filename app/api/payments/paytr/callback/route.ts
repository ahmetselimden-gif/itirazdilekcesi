import { verifyPaytrCallbackHash } from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    merchant_oid: String(formData.get("merchant_oid") || ""),
    status: String(formData.get("status") || ""),
    total_amount: String(formData.get("total_amount") || ""),
    hash: String(formData.get("hash") || ""),
    failed_reason_code: String(formData.get("failed_reason_code") || ""),
    failed_reason_msg: String(formData.get("failed_reason_msg") || ""),
    test_mode: String(formData.get("test_mode") || ""),
    payment_type: String(formData.get("payment_type") || ""),
    currency: String(formData.get("currency") || ""),
    payment_amount: String(formData.get("payment_amount") || ""),
  };

  if (!verifyPaytrCallbackHash(payload)) {
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
