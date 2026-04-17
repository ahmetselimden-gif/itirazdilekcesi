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
          <PetitionDocument petition={petition} className="select-none blur-[1.25px]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-white/15 backdrop-blur-[4px]" />
        </div>
      )}
    </div>
  );
}
