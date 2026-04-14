import Link from "next/link";
import Script from "next/script";
import type { SeoPageContent } from "@/lib/seoContent";
import { coreSeoPages, programmaticSeoPages } from "@/lib/seoContent";

type LegalSeoPageProps = {
  page: SeoPageContent;
};

const siteUrl = "https://www.itirazdilekcesi.com";

function buildFaqSchema(page: SeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(page: SeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: `${siteUrl}${page.path}`,
      },
    ],
  };
}

export default function LegalSeoPage({ page }: LegalSeoPageProps) {
  const relatedPages = [...coreSeoPages, ...programmaticSeoPages]
    .filter((item) => item.path !== page.path)
    .slice(0, 6);

  return (
    <>
      <Script
        id={`${page.slug}-faq-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(page)) }}
      />
      <Script
        id={`${page.slug}-breadcrumb-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(page)) }}
      />

      <article className="space-y-6 lg:space-y-8">
        <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-8 shadow-[0_24px_60px_rgba(17,34,51,0.08)] sm:px-8 lg:px-10 lg:py-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              {page.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-navy-deep sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {page.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={page.panelPath}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-gold bg-gold px-5 text-center text-sm font-bold text-white shadow-[0_16px_34px_rgba(31,58,95,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white focus:outline-none focus:ring-4 focus:ring-gold/30 sm:w-auto"
              >
                {page.ctaLabel}
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-line bg-surface px-5 text-center text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:border-navy focus:outline-none focus:ring-4 focus:ring-navy/15 sm:w-auto"
              >
                Tüm dilekçe panelleri
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {page.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="font-display text-3xl text-navy-deep">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              Sık sorulan sorular
            </span>
            <h2 className="mt-3 font-display text-3xl text-navy-deep">
              {page.title} hakkında merak edilenler
            </h2>
            <div className="mt-5 space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-line bg-surface-soft p-5">
                  <h3 className="text-lg font-bold text-navy">{faq.question}</h3>
                  <p className="mt-3 text-[15px] leading-8 text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl text-navy-deep">İlgili dilekçe rehberleri</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedPages.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="rounded-lg border border-line bg-surface-soft p-4 text-sm font-bold leading-7 text-navy transition duration-200 hover:-translate-y-0.5 hover:border-navy/40"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
