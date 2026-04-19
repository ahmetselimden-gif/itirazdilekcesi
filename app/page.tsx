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

const trustBadges = [
  {
    title: "SSL Güvenli",
    description: "256-bit şifreli bağlantı",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    title: "PayTR Güvenli Ödeme",
    description: "3D Secure destekli",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V9Z"
        />
      </svg>
    ),
  },
  {
    title: "KVKK Uyumlu",
    description: "Verileriniz korunur",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>
    ),
  },
  {
    title: "7 Gün İade Garantisi",
    description: "Mesafeli satış güvencesi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    ),
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Formu doldurun",
    description:
      "Olaya ait bilgileri (tarih, yer, taraflar, açıklama) kısa form üzerinden girin. Ortalama 2 dakika sürer.",
  },
  {
    step: "2",
    title: "Dilekçeniz hazırlansın",
    description:
      "Yapay zeka destekli sistem, bilgilerinizi hukuki terminolojiye uygun resmi dilekçe formatına dönüştürür.",
  },
  {
    step: "3",
    title: "PDF olarak indirin",
    description:
      "Güvenli ödemenin ardından dilekçenizi hazır PDF olarak indirin. Kurumlara teslim etmeye uygundur.",
  },
];

const samplePetition = `T.C.
İSTANBUL TRAFİK MAHKEMESİ'NE

İTİRAZ EDEN : [Ad Soyad] (T.C. [Kimlik No])
ADRES       : [Adres bilgisi]

KONU : .../.../2026 tarihinde tarafıma kesilen trafik idari
para cezasına itirazımın sunulmasıdır.

AÇIKLAMALAR:
1. Söz konusu tarih ve yerde tarafıma düzenlenen idari
   para cezası, 2918 sayılı Karayolları Trafik Kanunu'nun
   ilgili hükümleri uyarınca usulsüz düzenlenmiştir.

2. Olay anında aracımı yönetirken trafik kurallarına
   riayet ettiğim, tanık beyanları ve kamera kayıtları
   ile sabittir.

3. Cezanın dayanağı olan tespit tutanağında somut delil
   bulunmamakta, ...`;

const guarantees = [
  {
    title: "Şeffaf Fiyat",
    description: "Tek seferlik 19,99 TL. Gizli ücret, abonelik veya ek yük yok.",
  },
  {
    title: "Anında Teslim",
    description: "Ödeme tamamlandıktan sonra dilekçeniz PDF olarak hemen indirilir.",
  },
  {
    title: "İade Garantisi",
    description: "7 gün içinde cayma hakkınız saklıdır. Mesafeli satış güvencesi ile.",
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

      {/* HERO */}
      <section className="mx-auto flex max-w-5xl flex-col items-center py-10 text-center sm:py-14">
        <span className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
          <span className="h-px w-8 bg-navy/30" />
          İtiraz Dilekçesi Platformu
          <span className="h-px w-8 bg-navy/30" />
        </span>

        <h1 className="font-display text-4xl font-semibold leading-tight text-navy-deep sm:text-5xl">
          Hızlı ve Kolay İtiraz Dilekçenizi Hazırlayın
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Trafik cezası, kiracı veya ev sahibi uyuşmazlığı için yapay zeka destekli,
          resmi formatta dilekçe. <strong className="text-navy">2 dakikada hazır</strong>,
          anında PDF olarak indirin.
        </p>

        {/* Trust badge row */}
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-bold text-navy">
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-gold">
              ✓
            </span>
            SSL Güvenli
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-gold">
              ✓
            </span>
            PayTR Ödeme
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-gold">
              ✓
            </span>
            KVKK Uyumlu
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-gold">
              ✓
            </span>
            7 Gün İade Garantisi
          </li>
        </ul>

        {/* Panel cards */}
        <div className="mt-10 grid w-full gap-5 md:grid-cols-3">
          {panelItems.map((item) =>
            item.isActive ? (
              <Link
                key={item.title}
                href={item.href}
                className={`flex min-h-44 flex-col items-center justify-center rounded-lg border px-5 py-6 shadow-[0_18px_42px_rgba(17,34,51,0.12)] transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-navy/15 ${item.className}`}
              >
                <span className="text-xl font-bold leading-7">{item.title}</span>
                <span className="mt-3 text-sm leading-7 text-white/90">
                  {item.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Panele git →
                </span>
              </Link>
            ) : (
              <article
                key={item.title}
                id={item.href.slice(1)}
                className={`flex min-h-44 flex-col items-center justify-center rounded-lg border px-5 py-6 shadow-[0_18px_42px_rgba(17,34,51,0.12)] ${item.className}`}
              >
                <span className="text-xl font-bold leading-7">{item.title}</span>
                <span className="mt-3 text-sm leading-7 text-white/90">
                  {item.description}
                </span>
                <span className="mt-4 rounded-full border border-white/40 px-3 py-1 text-xs font-bold">
                  Yakında
                </span>
              </article>
            )
          )}
        </div>
      </section>

      {/* TRUST BADGES DETAILED */}
      <section className="mx-auto mt-4 max-w-5xl">
        <div className="grid gap-3 rounded-[24px] border border-line/80 bg-surface px-5 py-6 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 rounded-xl border border-line/60 bg-surface-soft px-4 py-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
                {badge.icon}
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-navy-deep">{badge.title}</p>
                <p className="text-xs leading-5 text-muted">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-12 max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
            <span className="h-px w-8 bg-navy/30" />
            Nasıl Çalışır
            <span className="h-px w-8 bg-navy/30" />
          </span>
          <h2 className="mt-3 font-display text-3xl text-navy-deep sm:text-4xl">
            3 adımda dilekçeniz hazır
          </h2>
          <p className="mt-3 text-[15px] leading-8 text-muted">
            Hukuki süreçlerin karmaşıklığıyla uğraşmadan, basit bir form üzerinden
            resmi dilekçenizi saniyeler içinde oluşturun.
          </p>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {howItWorks.map((item) => (
            <li
              key={item.step}
              className="relative flex flex-col rounded-[20px] border border-line/80 bg-surface px-6 py-7 shadow-[0_12px_32px_rgba(17,34,51,0.06)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-5 font-display text-xl text-navy-deep">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SAMPLE PETITION PREVIEW */}
      <section className="mx-auto mt-12 max-w-5xl">
        <div className="grid gap-8 rounded-[24px] border border-line/80 bg-surface px-6 py-8 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep">
              Örnek Çıktı
            </span>
            <h2 className="mt-4 font-display text-3xl text-navy-deep sm:text-4xl">
              Kurumlara teslim edilebilir resmi dilekçe
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">
              Hazırlanan dilekçeler Türk hukuk sistemi ve dilekçe yazım standartlarına
              uygun formatta olup doğrudan ilgili kurum, mahkeme veya noterliğe
              iletilebilir.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm leading-7 text-navy-deep">
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-1 text-gold">
                  ✓
                </span>
                Hukuki terminolojiye uygun
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-1 text-gold">
                  ✓
                </span>
                Kişiselleştirilmiş içerik (şablon değil)
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-1 text-gold">
                  ✓
                </span>
                İlgili kurum bilgileri otomatik doldurulur
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-1 text-gold">
                  ✓
                </span>
                Yazıcıya hazır PDF formatı
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[18px] border border-line/80 bg-white shadow-[0_12px_28px_rgba(17,34,51,0.08)]">
              <div className="flex items-center gap-1.5 border-b border-line/80 bg-surface-soft px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
                  dilekce-ornegi.pdf
                </span>
              </div>
              <pre className="whitespace-pre-wrap break-words px-5 py-5 font-mono text-[12px] leading-6 text-navy-deep sm:text-[13px]">
                {samplePetition}
              </pre>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              * Temsili örnek. Gerçek dilekçeniz form bilgilerinize göre oluşturulur.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING & GUARANTEE */}
      <section className="mx-auto mt-12 max-w-5xl">
        <div className="grid gap-6 rounded-[24px] border border-navy/15 bg-gradient-to-br from-surface to-surface-soft px-6 py-8 shadow-[0_20px_50px_rgba(17,34,51,0.08)] sm:px-10 sm:py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Şeffaf Fiyat
            </span>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-navy-deep sm:text-6xl">
                19,99
              </span>
              <span className="text-xl font-bold text-navy">TL</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-navy-deep">
              Tek seferlik ödeme · Gizli ücret yok
            </p>
            <p className="mt-4 text-[14px] leading-7 text-muted">
              Dilekçe önizlemeniz tamamen ücretsizdir. Sadece PDF olarak indirmek ve
              kullanmak için tek seferlik küçük bir ücret alıyoruz. Abonelik, otomatik
              yenileme veya ek ödeme bulunmamaktadır.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-1">
            {guarantees.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-[18px] border border-line/80 bg-surface px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-lg font-bold text-navy-deep">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-deep">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-6 text-muted">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* POPULAR GUIDES */}
      <section className="mx-auto mt-12 max-w-5xl rounded-[24px] border border-line/80 bg-surface px-5 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
        <h2 className="font-display text-3xl text-navy-deep">
          Popüler dilekçe rehberleri
        </h2>
        <p className="mt-3 text-[15px] leading-8 text-muted">
          En çok aranan itiraz dilekçesi konularını inceleyin ve ihtiyacınıza uygun
          panele geçin.
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

      {/* FINAL CTA */}
      <section className="mx-auto mt-12 max-w-5xl">
        <div className="rounded-[24px] border border-navy bg-navy px-6 py-10 text-center text-white shadow-[0_20px_50px_rgba(17,34,51,0.15)] sm:px-10 sm:py-12">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            İtirazınızı bugün başlatın
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-8 text-white/85">
            Önizleme ücretsiz. Dilekçenizin size uygun olduğundan emin olduğunuzda
            güvenli ödeme ile PDF olarak indirin.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/trafik-cezasi-itiraz"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gold bg-gold px-6 text-sm font-bold text-navy-deep transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Trafik Cezası İtiraz
            </Link>
            <Link
              href="/kiraci"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Kiracı Paneli
            </Link>
            <Link
              href="/ev-sahibi"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Ev Sahibi Paneli
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
