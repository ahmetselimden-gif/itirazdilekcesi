"use client";

import { Suspense } from "react";
import HousingPdfContent from "./content";

export const dynamic = "force-dynamic";

export default function HousingPdfPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HousingPdfContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
        <div className="border-b border-line/70 px-5 py-6 sm:px-8">
          <h1 className="font-display text-4xl font-semibold text-navy-deep sm:text-5xl">
            PDF oluşturuluyor...
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-5 sm:px-8">
          <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-navy/20 border-t-navy">
            <span className="sr-only">Yükleniyor...</span>
          </div>
          <p className="text-center text-muted">Lütfen bekleyin...</p>
        </div>
      </section>
    </main>
  );
}
