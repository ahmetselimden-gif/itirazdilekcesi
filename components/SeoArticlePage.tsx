import Link from "next/link";
import type { ReactNode } from "react";

type SeoSection = {
  heading: string;
  paragraphs: ReactNode[];
};

type SeoArticlePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: SeoSection[];
};

function CtaButton() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-gold bg-gold px-5 text-center text-sm font-bold text-white shadow-[0_16px_34px_rgba(31,58,95,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white focus:outline-none focus:ring-4 focus:ring-gold/30 sm:w-auto"
    >
      Hemen dilekçe oluştur (19.99 TL)
    </Link>
  );
}

function ArticleCta() {
  return (
    <div className="rounded-[24px] border border-gold/50 bg-gold-soft/55 px-5 py-6 sm:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">
            Hazır dilekçe
          </p>
          <p className="mt-2 max-w-2xl text-[15px] leading-8 text-muted">
            Bilgilerinizi girin, trafik cezası itiraz dilekçesi metnini dakikalar içinde
            oluşturun ve PDF indirme adımına geçin.
          </p>
        </div>
        <CtaButton />
      </div>
    </div>
  );
}

export default function SeoArticlePage({
  eyebrow,
  title,
  description,
  sections,
}: SeoArticlePageProps) {
  const middleIndex = Math.max(1, Math.floor(sections.length / 2) - 1);

  return (
    <article className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-8 shadow-[0_24px_60px_rgba(17,34,51,0.08)] sm:px-8 lg:px-10 lg:py-10">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
            <span className="h-px w-8 bg-navy/30" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.02em] text-navy-deep sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            {description}
          </p>
          <div className="mt-7">
            <CtaButton />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-8">
          {sections.map((section, index) => (
            <div key={section.heading} className="space-y-4">
              <h2 className="font-display text-3xl text-navy-deep">{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-[15px] leading-8 text-muted">
                  {paragraph}
                </p>
              ))}
              {index === middleIndex ? <ArticleCta /> : null}
            </div>
          ))}
        </div>
      </section>

      <ArticleCta />
    </article>
  );
}
