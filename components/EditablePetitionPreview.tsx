"use client";

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
  const shouldBlurPreview = !isPaid;

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
        <div className="relative overflow-hidden rounded-[22px] border border-line bg-white p-4 sm:p-6">
          <div className={shouldBlurPreview ? "blur-[6px]" : ""}>
            <PetitionDocument petition={petition} />
          </div>
          {shouldBlurPreview ? (
            <>
              <div className="pointer-events-none absolute inset-0 bg-white/20" />
              <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-lg border border-gold/50 bg-white/90 px-4 py-3 text-center text-sm font-bold leading-6 text-navy shadow-[0_14px_32px_rgba(17,34,51,0.12)] sm:inset-x-8">
                PDF metni ödeme sonrası tamamen netleşir.
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
