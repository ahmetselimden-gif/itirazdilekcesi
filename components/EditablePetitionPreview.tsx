"use client";

import Image from "next/image";
import PetitionDocument from "@/components/PetitionDocument";

type EditablePetitionPreviewProps = {
  petition: string;
  isPaid: boolean;
  onChange: (petition: string) => void;
};

const beforePaymentMessage =
  "Bu metin profesyonel olarak hazırlanmıştır. Düzenleme yapmak için PDF satın aldıktan sonra metni düzenleyebilirsiniz.";

const afterPaymentMessage =
  "Dilekçenizi düzenleyebilirsiniz (isteğe bağlı). Yaptığınız değişiklikler PDF'e yansıtılır.";

export default function EditablePetitionPreview({
  petition,
  isPaid,
  onChange,
}: EditablePetitionPreviewProps) {
  return (
    <div className="mt-5 space-y-3">
      <div
        className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
          isPaid
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-gold/45 bg-gold-soft/45 text-muted"
        }`}
      >
        {isPaid ? afterPaymentMessage : beforePaymentMessage}
      </div>

      {isPaid ? (
        <textarea
          className="min-h-[520px] w-full resize-y rounded-[22px] border border-line bg-white p-4 font-serif text-[15px] leading-8 text-ink outline-none transition duration-200 focus:border-navy focus:ring-4 focus:ring-navy/10 sm:p-6"
          value={petition}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Dilekçe metni önizleme"
        />
      ) : (
        <div
          className="relative overflow-hidden rounded-[22px] border border-line bg-white p-4 sm:p-6"
          onCopy={(event) => event.preventDefault()}
          onCut={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <PetitionDocument
            petition={petition}
            className="pointer-events-none select-none"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="-rotate-12 text-center opacity-[0.13]">
              <Image
                src="/branding/itirazdilekcesi-logo-primary.svg"
                alt=""
                width={520}
                height={109}
                className="mx-auto h-auto w-[min(78vw,520px)] max-w-full"
                draggable={false}
              />
              <p className="mt-5 text-4xl font-bold uppercase tracking-[0.18em] text-navy sm:text-6xl">
                itirazdilekcesi.com
              </p>
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-28deg, transparent 0 96px, rgba(21, 52, 77, 0.55) 96px 98px, transparent 98px 170px)",
            }}
          />
        </div>
      )}
    </div>
  );
}
