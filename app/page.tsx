import Script from "next/script";
import TrafficPetitionTool from "@/components/TrafficPetitionTool";
import { trafficNews } from "@/lib/news";

const siteUrl = "https://www.itirazdilekcesi.com";

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
              Trafik cezalarına itiraz edilirken cezanın dayandığı tespit, tutanak
              içeriği, tebliğ süreci, radar veya kamera kaydı gibi unsurlar dikkatle
              değerlendirilmelidir. Somut olayın açık biçimde ortaya konulamaması,
              delil eksikliği veya usul hatası gibi durumlar itirazı güçlendirebilir.
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
                Trafik cezası itirazlarında tebliğ tarihi kritik önem taşır. Bu nedenle
                ceza tarihi ile birlikte tebliğ tarihinin de doğru girilmesi gerekir.
                Başvuru süresi yönünden hak kaybı yaşamamak için tarihlerin net ve
                eksiksiz olması önemlidir.
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
                Yanlış plaka, eksik tutanak bilgisi, delil yetersizliği, kamera veya
                radar kaydının bulunmaması, olay yerinin belirsizliği ya da tebliğ
                usulüne aykırılık gibi durumlar itiraz bakımından önemli olabilir. Her
                dosya kendi koşullarına göre değerlendirilmelidir.
              </p>
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
