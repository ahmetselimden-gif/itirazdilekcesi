"use client";

type EditablePetitionPreviewProps = {
  petition: string;
  isPaid: boolean;
  onChange: (petition: string) => void;
};

const beforePaymentMessage =
  "On izleme artik tamamen acik. Metni inceleyebilir ve duzenleyebilirsiniz; PDF indirme odeme sonrasinda aktif olur.";

const afterPaymentMessage =
  "Dilekcenizi duzenleyebilirsiniz (istege bagli). Yaptiginiz degisiklikler PDF'e yansitilir.";

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
        className="min-h-[520px] w-full resize-y rounded-[22px] border border-line bg-white p-4 font-serif text-[15px] leading-8 text-ink outline-none transition duration-200 focus:border-navy focus:ring-4 focus:ring-navy/10 sm:p-6"
        value={petition}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Dilekce metni onizleme"
      />
    </div>
  );
}
