"use client";

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

      <textarea
        className="min-h-[520px] w-full resize-y rounded-[22px] border border-line bg-white p-4 font-serif text-[15px] leading-8 text-ink outline-none transition duration-200 focus:border-navy focus:ring-4 focus:ring-navy/10 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted sm:p-6"
        value={petition}
        readOnly={!isPaid}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Dilekçe metni önizleme"
      />
    </div>
  );
}
