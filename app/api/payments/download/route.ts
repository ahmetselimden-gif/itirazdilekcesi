import { NextResponse } from "next/server";
import { verifyDownloadAccessToken } from "@/lib/downloadAccess";
import { buildPetitionPdf } from "@/lib/pdf";
import { verifyPetitionToken } from "@/lib/petitionToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let accessToken = "";
    let petitionToken = "";
    let editedPetition = "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        access?: string;
        petition?: string;
        editedPetition?: string;
      };
      accessToken = body.access?.trim() || "";
      petitionToken = body.petition?.trim() || "";
      editedPetition = body.editedPetition?.trim() || "";
    } else {
      const formData = await request.formData();
      accessToken = String(formData.get("access") || "").trim();
      petitionToken = String(formData.get("petition") || "").trim();
      editedPetition = String(formData.get("editedPetition") || "").trim();
    }

    const accessVerification = verifyDownloadAccessToken(accessToken);
    if (!accessVerification.valid) {
      return NextResponse.json(
        { error: accessVerification.reason },
        { status: 401 }
      );
    }

    const petitionVerification = verifyPetitionToken(petitionToken);
    if (!petitionVerification.valid) {
      return NextResponse.json(
        { error: petitionVerification.reason },
        { status: 401 }
      );
    }

    const pdfBytes = await buildPetitionPdf(
      editedPetition || petitionVerification.payload.petition
    );

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="itiraz-dilekcesi.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PDF oluşturulurken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
