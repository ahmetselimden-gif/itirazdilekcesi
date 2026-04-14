"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type HousingFormData = {
  fullName: string;
  address: string;
  counterpartyName: string;
  rentedAddress: string;
  problemType: string;
  explanation: string;
  institution: string;
};

export default function HousingPdfContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const oid = searchParams.get("oid");
  const type = searchParams.get("type") as "kiraci" | "evsahibi" | null;
  const data = searchParams.get("data");

  useEffect(() => {
    const generateAndDownloadPdf = async () => {
      try {
        if (!oid || !type || !data) {
          throw new Error("Eksik sonuç parametreleri");
        }

        // Decode form data
        const formData: HousingFormData = JSON.parse(atob(data));

        // Call the PDF generation API
        const pdfApiPath = type === "kiraci" ? "/api/kiraci/pdf" : "/api/ev-sahibi/pdf";
        const pdfResponse = await fetch(pdfApiPath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!pdfResponse.ok) {
          throw new Error("PDF oluşturulamadı");
        }

        // Create a blob URL for the PDF
        const pdfBlob = await pdfResponse.blob();
        const blobUrl = URL.createObjectURL(pdfBlob);
        setDownloadUrl(blobUrl);

        // Auto-download the PDF
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Dilekce-${oid}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "PDF oluşturulurken hata oluştu");
        setIsLoading(false);
      }
    };

    generateAndDownloadPdf();
  }, [oid, type, data]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
        <div className="border-b border-line/70 px-5 py-6 sm:px-8">
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
            <span className="h-px w-8 bg-navy/30" />
            Dilekçe İndir
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-navy-deep sm:text-5xl">
            {isLoading ? "PDF oluşturuluyor..." : error ? "Hata oluştu" : "İndirme başarılı"}
          </h1>
        </div>

        <div className="px-5 py-8 sm:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-navy/20 border-t-navy">
                <span className="sr-only">Yükleniyor...</span>
              </div>
              <p className="text-center text-muted">
                PDF dosyanız oluşturuluyor. Lütfen bekleyin...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-danger/25 bg-danger/5 p-6">
              <p className="text-sm font-semibold text-danger">❌ Hata</p>
              <p className="mt-2 text-sm text-danger">{error}</p>
              <p className="mt-4 text-xs text-muted">
                Lütfen ana sayfaya dönerek işlemi yeniden başlatın.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gold/30 bg-gold-soft/30 p-6 text-center">
              <p className="text-sm font-semibold text-navy">✅ Başarılı</p>
              <p className="mt-2 text-sm text-muted">
                PDF dosyanız başarıyla oluşturuldu ve bilgisayarınıza indirildi.
              </p>
              {downloadUrl && (
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = `Dilekce-${oid}.pdf`;
                    link.click();
                  }}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-navy bg-navy px-4 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep"
                >
                  📥 Yeniden İndir
                </button>
              )}
              <p className="mt-4 text-xs text-muted">
                Dilekçenizi imzalayarak 15 gün içinde mahkemeye sunmalısınız.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
