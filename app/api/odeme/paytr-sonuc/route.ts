import { NextRequest, NextResponse } from "next/server";

type PaymentResultParams = {
  status?: string;
  oid?: string;
  type?: string;
  product?: string;
  data?: string;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const oid = searchParams.get("oid");
    const type = searchParams.get("type");
    const product = searchParams.get("product");
    const data = searchParams.get("data");

    // Validate parameters
    if (!status || !oid) {
      return NextResponse.json(
        { error: "Eksik sonuç parametreleri" },
        { status: 400 }
      );
    }

    if (status === "success" && type && product && data) {
      // Decode form data from base64
      try {
        const decodedData = JSON.parse(atob(data));

        // Determine which PDF API to call based on type
        const pdfApiPath = type === "kiraci" ? "/api/kiraci/pdf" : "/api/ev-sahibi/pdf";

        // Generate PDF
        const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${pdfApiPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(decodedData),
        });

        if (!pdfResponse.ok) {
          throw new Error("PDF oluşturulamadı");
        }

        // Get the PDF buffer
        const pdfBuffer = await pdfResponse.arrayBuffer();

        // Return the PDF with download headers
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Dilekce-${oid}.pdf"`,
            "Content-Length": pdfBuffer.byteLength.toString(),
          },
        });
      } catch (decodeError) {
        console.error("Form data decode error:", decodeError);
        return NextResponse.json(
          { error: "Form verisi işlenemedi" },
          { status: 400 }
        );
      }
    } else if (status === "failed") {
      // Payment failed
      return NextResponse.json(
        {
          status: "failed",
          message: "Ödeme başarısız oldu. Lütfen tekrar deneyin.",
        }
      );
    }

    return NextResponse.json(
      { error: "Bilinmeyen sonuç durumu" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment result processing error:", error);
    return NextResponse.json(
      { error: "Sonuç işleme hatası" },
      { status: 500 }
    );
  }
}
