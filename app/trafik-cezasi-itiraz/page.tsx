import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import TrafficPetitionTool from "@/components/TrafficPetitionTool";
import { trafficNews } from "@/lib/news";

const siteUrl = "https://www.itirazdilekcesi.com";

export const metadata: Metadata = {
  title: "Trafik Cezası İtiraz Dilekçesi Hazırla",
  description:
    "Trafik cezasına itiraz dilekçesi hazırlayın. Radar, kırmızı ışık, park ve diğer trafik cezaları için resmi PDF dilekçe oluşturun.",
  keywords: [
    "trafik cezası itiraz dilekçesi",
    "trafik cezasına itiraz",
    "radar cezası itiraz dilekçesi",
    "kırmızı ışık cezası itiraz",
    "park cezası itiraz",
    "sulh ceza hakimliği trafik cezası itiraz",
  ],
  alternates: {
    canonical: "/trafik-cezasi-itiraz",
  },
};

const faqItems = [
  {
    question: "Trafik cezasına itiraz süresi ne zaman başlar?",
    answer:
      "Uygulamada itiraz süresi çoğu durumda tebliğ tarihinden itibaren değerlendirilir. Bu nedenle cezanın yazıldığı gün ile tebliğ tarihi karıştırılmamalı, başvuru hazırlığı mümkün olan en kısa sürede tamamlanmalıdır.",
  },
  {
    question: "Kırmızı ışık veya hız cezası hangi durumlarda tartışmalı hale gelir?",
    answer:
      "Teknik delilin eksik olması, radar veya kamera kaydının sunulmaması, ölçüm cihazının kalibrasyonunun belirsizliği, yanlış plaka bilgisi ya da tutanakta olayın açık anlatılmaması itiraz gerekçesi olarak değerlendirilebilir.",
  },
  {
    question: "Hazırlanan dilekçe tek başına yeterli olur mu?",
    answer:
      "Dilekçe başvurunun temelidir; ancak varsa tebligat belgesi, ceza tutanağı, fotoğraf, video, rota bilgisi veya olayı destekleyen diğer belgelerle birlikte sunulması daha güçlü bir dosya oluşturur.",
  },
  {
    question: "Ödeme yapıldıktan sonra kullanıcı ne alır?",
    answer:
      "Ödeme doğrulandıktan sonra kullanıcıya sadece dilekçe metnini içeren resmi PDF çıktısı açılır. Değerlendirme bölümü ekranda kalır ancak PDF dosyasına dahil edilmez.",
  },
];

const conversionHighlights = [
  "1000+ kişi kullandı",
  "Resmi dilekçe formatı",
  "5 dakikada hazır",
];

const featuredTrafficGuides = [
  {
    href: "/radar-cezasi-itiraz-edilir-mi",
    title: "Radar cezası itiraz edilir mi?",
    description: "Radar ölçümü, delil eksikliği ve itiraz gerekçeleri hakkında rehber.",
  },
  {
    href: "/trafik-cezasi-itiraz-dilekcesi-nasil-yazilir",
    title: "Trafik cezası itiraz dilekçesi nasıl yazılır?",
    description: "Başvuruda hangi bilgilerin yer alması gerektiğini adım adım inceleyin.",
  },
  {
    href: "/trafik-cezasi-itiraz-sureci-2026",
    title: "Trafik cezası itiraz süreci 2026",
    description: "Tebligat, 15 günlük süre ve başvuru akışı için özet kılavuz.",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "itirazdilekcesi.com",
  url: siteUrl,
  email: "destek@itirazdilekcesi.com",
  sameAs: [siteUrl],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "itirazdilekcesi.com",
  url: siteUrl,
  inLanguage: "tr-TR",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Dijital trafik cezası itiraz dilekçesi hazırlama",
  name: "Trafik Cezası İtiraz Dilekçesi Hazırlama",
  provider: {
    "@type": "Organization",
    name: "itirazdilekcesi.com",
    url: siteUrl,
  },
  areaServed: {
    "@type": "Country",
    name: "Türkiye",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Trafik cezasına itiraz etmek isteyen kullanıcılar",
  },
  offers: {
    "@type": "Offer",
    price: "19.99",
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    url: siteUrl,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Trafik Cezası İtiraz Dilekçesi Hazırla",
  url: siteUrl,
  description:
    "Trafik cezasına itiraz dilekçesi oluşturma aracı, başvuru rehberi ve güncel bilgilendirme içerikleri.",
  inLanguage: "tr-TR",
  about: {
    "@type": "Thing",
    name: "Trafik cezasına itiraz",
  },
};

const breadcrumbSchema = {
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
      name: "Trafik Cezası İtiraz Dilekçesi",
      item: siteUrl,
    },
  ],
};

export default function HomePage() {
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
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-6 lg:space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
          <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                T.C.
              </div>

              <h1 className="font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-navy-deep sm:text-5xl lg:text-[4.1rem]">
                Trafik Cezası İtiraz Dilekçesi Hazırla
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Trafik cezanıza karşı resmi, temiz ve güven veren bir itiraz dilekçesini
                dakikalar içinde oluşturun.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="border-l-2 border-gold pl-4">
                  <p className="text-sm font-bold text-navy">Hızlı başvuru</p>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    Formu doldurun, metni anında oluşturun.
                  </p>
                </div>
                <div className="border-l-2 border-gold pl-4">
                  <p className="text-sm font-bold text-navy">Resmi görünüm</p>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    Dilekçe ve PDF alanı evrak düzenine göre hazırlanır.
                  </p>
                </div>
                <div className="border-l-2 border-gold pl-4">
                  <p className="text-sm font-bold text-navy">Tek odak</p>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    Sistem yalnızca trafik cezası itirazına odaklanır.
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-[24px] bg-navy px-6 py-7 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/65">
                Hazırlık notu
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight">
                Başvuru öncesi temel kontrol
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-white/85">
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Ceza tarihi ve tebliğ tarihini doğru girin.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Olay yerini mümkün olduğunca açık yazın.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Usul, delil veya tebligat eksikliğini belirtin.
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="rounded-[24px] border border-gold/45 bg-gold-soft/55 px-5 py-5 shadow-[0_20px_48px_rgba(31,58,95,0.08)] sm:px-7">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] lg:items-center">
            <div className="grid gap-3 sm:grid-cols-3">
              {conversionHighlights.map((item) => (
                <div
                  key={item}
                  className="flex min-h-14 items-center gap-3 rounded-lg border border-line/80 bg-surface px-4 py-3"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 flex-none text-gold"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span className="text-sm font-bold text-navy">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex min-h-14 items-start gap-3 rounded-lg border border-danger/25 bg-white px-4 py-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5 flex-none text-danger"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
              <p className="text-sm font-bold leading-7 text-danger">
                Trafik cezalarına 15 gün içinde itiraz edilmezse hak kaybı olur.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
          <div className="mb-5">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              Rehberler
            </span>
            <h2 className="mt-3 font-display text-3xl text-navy-deep">
              Başvuru öncesi okunabilecek trafik cezası rehberleri
            </h2>
            <p className="mt-3 max-w-4xl text-[15px] leading-8 text-muted">
              Trafik cezasına itiraz etmeden önce radar ölçümü, dilekçe yazımı ve süre
              hesabı gibi en sık karışan konuları bu sayfalardan inceleyebilirsiniz.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredTrafficGuides.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[20px] border border-line bg-surface-soft p-5 transition duration-200 hover:-translate-y-0.5 hover:border-navy/40"
              >
                <p className="text-base font-bold text-navy-deep">{item.title}</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <TrafficPetitionTool />

        <section className="space-y-5">
          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
            <div className="mb-4">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Bilgilendirme
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Trafik cezası nasıl iptal edilir?
              </h2>
            </div>
            <p className="max-w-5xl text-[15px] leading-8 text-muted">
              Trafik cezasına itiraz edilirken önce cezanın hangi tutanak veya teknik
              tespite dayandığı incelenmelidir. Tutanakta araç, yer, tarih, saat ve
              fiilin niteliği açık değilse; radar veya kamera kaydı bulunmuyorsa;
              tebligat usulüne uygun yapılmadıysa ya da olayın gerçekleşme biçimi ile
              tutanak arasında çelişki varsa itiraz imkânı güçlenebilir. Başvuru
              yapılırken yalnızca “ceza haksız” denilmesi yerine, delil eksikliği, usul
              hatası, yanlış plaka, yanlış yer, hatalı tarih veya yetersiz açıklama gibi
              somut noktaların belirtilmesi daha güçlü sonuç verir.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Süre
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                İtiraz süresi kaç gün?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Trafik idari para cezalarına karşı başvuru süresi genel olarak tebliğ
                tarihinden itibaren 15 gündür. Uygulamada esas alınan kritik tarih, cezanın
                yazıldığı gün değil, cezanın size usulüne uygun biçimde tebliğ edildiği
                gündür. Bu nedenle sistemde tebliğ tarihinin doğru girilmesi çok önemlidir.
                Süre geçirilirse ceza kesinleşebilir; bu yüzden başvurunun mümkün olan en
                kısa sürede hazırlanması gerekir.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Eğer ceza tutanağı sonradan adresinize geldiyse, süre çoğu durumda tebliğ
                ile başlar. Tebligat usulsüzse veya hiç yapılmadıysa değerlendirme değişebilir.
                Bu sebeple tebligatın size nasıl ulaştığını ve hangi tarihte teslim edildiğini
                doğru yazmanız hak kaybı yaşamamanız açısından önem taşır.
              </p>
            </div>

            <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Dayanak
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Hangi durumlarda iptal olur?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Her dosya kendi içinde değerlendirilse de uygulamada bazı itiraz sebepleri
                daha sık öne çıkar. Yanlış plaka yazılması, olay yerinin veya saatinin tutanakta
                hatalı görünmesi, cezanın hangi delile dayandığının belirsiz olması, kamera veya
                radar kaydının sunulmaması, ölçüm cihazının kalibrasyonunun tartışmalı olması ve
                tebligat sürecindeki usulsüzlükler en sık ileri sürülen nedenler arasındadır.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Özellikle kırmızı ışık ve hız ihlali cezalarında teknik delil önemli yer tutar.
                Park cezalarında ise aracın bulunduğu yerin doğru tespiti, tutanak içeriği ve
                fotoğraf desteği daha çok önem kazanır. Dilekçede olayın neden hatalı tespit
                edildiğini kısa ama açık şekilde anlatmak, itirazın daha düzenli ve ikna edici
                görünmesini sağlar.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
            <div className="mb-5">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Başvuru Kılavuzu
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Hazırlanan dilekçe nereye verilir?
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">1. Doğru merciyi kontrol edin</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Trafik idari para cezalarına karşı başvuru uygulamada çoğu durumda sulh ceza
                  hâkimliğine yapılır. Özellikle cezanın düzenlendiği yer ve tebligat bilgileri,
                  başvurunun nereye sunulacağını belirlemede önem taşır.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">2. Adliyeden teslim edebilirsiniz</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Hazırladığınız dilekçeyi imzalayıp ekleriyle birlikte adliyedeki ilgili birime
                  teslim edebilirsiniz. Uygulamada başvuru çoğu zaman sulh ceza hâkimliği kalemine
                  ya da adliye ön büro/tevzi birimi üzerinden alınır.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">3. Dijital başvuru imkânını araştırın</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Bazı işlemler UYAP üzerinden de takip edilebilir. UYAP Vatandaş Portal veya
                  avukat aracılığıyla başvuru imkânı bulunup bulunmadığını, işlem yapmadan önce
                  ilgili adliye veya portal üzerinden kontrol etmek faydalı olur.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[20px] border border-gold/45 bg-gold-soft/40 p-5">
              <p className="text-[15px] leading-8 text-muted">
                Pratik öneri: Dilekçeyi vermeden önce cezanın yazıldığı yer, tebliğ tarihi ve
                başvurunun hangi sulh ceza hâkimliğine yöneltileceği konusunda ilgili adliye
                kaleminden teyit almak güvenli olur. Böylece yanlış birime başvuru nedeniyle süre
                kaybı yaşama ihtimali azalır.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
            <div className="mb-5">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Sık Sorulan Sorular
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Trafik cezası itirazında en çok merak edilenler
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <article
                  key={item.question}
                  className="rounded-[20px] border border-line bg-surface-soft px-5 py-5"
                >
                  <h3 className="text-lg font-semibold text-navy">{item.question}</h3>
                  <p className="mt-3 text-[15px] leading-8 text-muted">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
            <div className="mb-5">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Gündem
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Güncel trafik haberleri
              </h2>
            </div>

            <div className="space-y-5">
              {trafficNews.map((item) => (
                <article
                  key={item.href}
                  className="border-t border-line pt-5 first:border-t-0 first:pt-0"
                >
                  <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                    <span>{item.date}</span>
                    <span>{item.source}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-navy">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors duration-200 hover:text-navy-deep hover:underline"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="mt-2 max-w-5xl text-[15px] leading-8 text-muted">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
