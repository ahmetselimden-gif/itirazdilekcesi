import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Script from "next/script";
import { allSeoPages } from "@/lib/seoContent";

const siteUrl = "https://www.itirazdilekcesi.com";

export const metadata: Metadata = {
  title: "İtiraz Dilekçesi Hazırla | Trafik, Kiracı ve Ev Sahibi",
  description:
    "Trafik cezası, kiracı ve ev sahibi itiraz dilekçesi hazırlama panelleri. Dakikalar içinde dilekçe oluşturun ve PDF olarak indirin.",
  keywords: [
    "itiraz dilekçesi hazırla",
    "trafik cezası itiraz dilekçesi",
    "kiracı itiraz dilekçesi",
    "ev sahibi itiraz dilekçesi",
    "dilekçe oluşturma",
  ],
  alternates: {
    canonical: "/",
  },
};

const panelItems = [
  {
    title: "Trafik Cezası İtiraz",
    description: "Radar, kırmızı ışık, park ve diğer trafik cezası itirazları.",
    href: "/trafik-cezasi-itiraz",
    className: "border-[#c92635] bg-[#df2f3f] text-white hover:bg-[#c92635]",
    isActive: true,
  },
  {
    title: "Kiracı İtiraz Dilekçesi",
    description: "Kiracı tarafı için itiraz dilekçesi paneli.",
    href: "/kiraci",
    className: "border-[#138a42] bg-[#19a14f] text-white hover:bg-[#138a42]",
    isActive: true,
  },
  {
    title: "Ev Sahibi İtiraz Dilekçesi",
    description: "Ev sahibi tarafı için itiraz dilekçesi paneli.",
    href: "/ev-sahibi",
    className: "border-[#1667a7] bg-[#1f78bf] text-white hover:bg-[#1667a7]",
    isActive: true,
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "itirazdilekcesi.com",
  url: siteUrl,
  email: "destek@itirazdilekcesi.com",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "itirazdilekcesi.com",
  url: siteUrl,
  inLanguage: "tr-TR",
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "İtiraz Dilekçesi Panel Seçimi",
  url: siteUrl,
  description:
    "Trafik cezası, kiracı ve ev sahibi itiraz dilekçesi panelleri için seçim ekranı.",
  inLanguage: "tr-TR",
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const payment = params?.payment;
  const access = params?.access;
  const message = params?.message;
  const oid = params?.oid;

  if (payment || access || message || oid) {
    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
        return;
      }

      if (value) {
        query.set(key, value);
      }
    });

    redirect(`/trafik-cezasi-itiraz?${query.toString()}`);
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <section className="mx-auto flex min-h-[68vh] max-w-5xl flex-col items-center justify-center py-12 text-center">
        <span className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
          <span className="h-px w-8 bg-navy/30" />
          Panel seçimi
          <span className="h-px w-8 bg-navy/30" />
        </span>

        <h1 className="font-display text-4xl font-semibold leading-tight text-navy-deep sm:text-5xl">
          Hızlı ve Kolay İtiraz Dilekçenizi Hazırlayın
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          İhtiyacınız olan dilekçe panelini seçin.
        </p>

        <div className="mt-10 grid w-full gap-5 md:grid-cols-3">
          {panelItems.map((item) =>
            item.isActive ? (
              <Link
                key={item.title}
                href={item.href}
                className={`flex min-h-44 flex-col items-center justify-center rounded-lg border px-5 py-6 shadow-[0_18px_42px_rgba(17,34,51,0.12)] transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-navy/15 ${item.className}`}
              >
                <span className="text-xl font-bold leading-7">{item.title}</span>
                <span className="mt-3 text-sm leading-7 text-white/90">{item.description}</span>
              </Link>
            ) : (
              <article
                key={item.title}
                id={item.href.slice(1)}
                className={`flex min-h-44 flex-col items-center justify-center rounded-lg border px-5 py-6 shadow-[0_18px_42px_rgba(17,34,51,0.12)] ${item.className}`}
              >
                <span className="text-xl font-bold leading-7">{item.title}</span>
                <span className="mt-3 text-sm leading-7 text-white/90">{item.description}</span>
                <span className="mt-4 rounded-full border border-white/40 px-3 py-1 text-xs font-bold">
                  Yakında
                </span>
              </article>
            )
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-[24px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
        <h2 className="font-display text-3xl text-navy-deep">Popüler dilekçe rehberleri</h2>
        <p className="mt-3 text-[15px] leading-8 text-muted">
          En çok aranan itiraz dilekçesi konularını inceleyin ve ihtiyacınıza uygun panele geçin.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allSeoPages.slice(0, 8).map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="rounded-lg border border-line bg-surface-soft p-4 text-sm font-bold leading-7 text-navy transition duration-200 hover:-translate-y-0.5 hover:border-navy/40"
            >
              {page.title}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
