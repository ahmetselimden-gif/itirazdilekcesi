import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-[24px] border border-line/80 bg-surface px-6 py-10 text-center shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
          Odeme tamamlandi
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-navy-deep">
          Isleminiz basariyla tamamlandi.
        </h1>
        <p className="mt-4 text-[15px] leading-8 text-muted">
          Satin alma kaydi alindi. Dilekce ekranina donerek PDF indirme adimina devam
          edebilirsiniz.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg border border-navy bg-navy px-5 text-sm font-bold text-white transition duration-200 hover:bg-navy-deep"
        >
          Ana sayfaya don
        </Link>
      </section>
  );
}
