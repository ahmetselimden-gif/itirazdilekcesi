import Script from "next/script";
import type { Metadata } from "next";
import HousingPetitionTool from "@/components/HousingPetitionTool";
import { housingNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Ev Sahibi İtiraz Dilekçesi",
  description:
    "Ev sahibi itiraz dilekçesi formunu doldurun ve dilekçe metninizi oluşturun.",
  alternates: {
    canonical: "/ev-sahibi",
  },
};

const siteUrl = "https://www.itirazdilekcesi.com";

const faqItems = [
  {
    question: "Kira ödenmediğinde hemen tahliye davası açabilir mi?",
    answer:
      "Hayır, kira ödenmemesi durumunda belirli usulün takip edilmesi gerekir. Çoğu durumda kiracıya yazılı ihtar gönderilmesi ve belirli bir süre geçmesi gerekir. Ihtar göndermeden veya ödeme süresini vermeden tahliye davası başarılı olmayabilir. Dilekçede ihtar tarihi ve yöntemi belirtilmelidir.",
  },
  {
    question: "Eve zarar için mahkemeden neler istenebilir?",
    answer:
      "Ev sahibi zarar iddiasında; tamirat maliyetinin ödenmesini, kiracının gayretinin giderilmesini veya tahliyeyi talep edebilir. Ancak tamirat faturası, ekspertiz raporu, teslim tutanağındaki not ve fotoğraflar gibi belgeler gereklidir. Belgeler olmadan sadece sözlü talep başarısız olabilir.",
  },
  {
    question: "Sözleşmeye aykırı kullanımda kiracıyı uyarmak zorunlu mu?",
    answer:
      "Evet, çoğu durumda kiracıya yazılı uyarı gönderilmesi gerekir. Eğer ihlal devam ederse ve kiracı uyarıya rağmen davranışını değiştirmezse tahliye davası açabilirsiniz. Dilekçede uyarı tarihi, yöntemi ve kiracının bu uyarıya yanıtı belirtilmelidir.",
  },
  {
    question: "Depozito kesintisi yaparken kiracıya bildir­mek zorunlu mu?",
    answer:
      "Evet, depozito kesintisi için sebeplerini ve belgeleri kiracıya yazılı biçimde bildirmek gerekir. Keyfi kesintiler yasal değildir. Tamirat, hasar veya ödenmemiş borçlar için haklı nedenleri belirtmelisiniz.",
  },
];

const conversionHighlights = [
  "8,000+ ev sahibi korundu",
  "Resmi dilekçe formatı",
  "3 dakikada hazır",
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

export default function EvSahibiPage() {
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

      <div className="space-y-6 lg:space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-[0_24px_60px_rgba(17,34,51,0.08)]">
          <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                EV SAHİBİ PANELİ
              </div>

              <h1 className="font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-navy-deep sm:text-5xl lg:text-[4.1rem]">
                Ev Sahibi İtiraz Dilekçesi Hazırla
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Kira uyuşmazlığınızı yazılı hale getirin ve ev sahibi haklarınızı resmi bir
                dilekçeyle korurun.
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
                  <p className="text-sm font-bold text-navy">Hukuki dayanak</p>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    Ev sahibi haklarını koruyan dilekçe metni.
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-[24px] bg-navy px-6 py-7 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/65">
                Başlamadan önce
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight">
                Hazırlık kontrol listesi
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-white/85">
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Kira sözleşmesi ve ödeme kayıtları hazır olsun.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Gönderilen ihtarnameleri ve yazışmaları toplayın.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Varsa hasar fotoğrafları ve belgeleri güvenli tutun.
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
                Tahliye ve ödeme davalarında usul ve belge eksikliği dosyayı zayıflatır.
              </p>
            </div>
          </div>
        </section>

        <HousingPetitionTool
          apiPath="/api/ev-sahibi"
          eyebrow="Ev sahibi paneli"
          title="Ev Sahibi İtiraz Dilekçesi"
          description="Ev sahibi olarak yaşadığınız probleme göre temel dilekçe metninizi oluşturun."
          counterpartyLabel="Kiracı Adı"
          problemOptions={[
            "Kira ödememe",
            "Tahliye talebi",
            "Sözleşme ihlali",
            "Eve zarar verme",
            "Diğer",
          ]}
        />

        <section className="space-y-5">
          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              Ev sahibi hakları
            </span>
            <h2 className="mt-3 font-display text-3xl text-navy-deep">
              Ev sahibi hangi durumlarda dilekçe hazırlayabilir?
            </h2>
            <p className="mt-4 max-w-5xl text-[15px] leading-8 text-muted">
              Ev sahibi, kira ilişkisinde yaşanan uyuşmazlığı yazılı hale getirmek ve ilgili
              kuruma sunmak için dilekçe hazırlayabilir. Kira bedelinin ödenmemesi, tahliye
              talebi, sözleşmeye aykırı kullanım, eve zarar verilmesi veya komşularla ilgili
              sorunlarda dilekçede kira sözleşmesi, ödeme durumu, olay tarihi, kiralanan adres
              ve talep açıkça belirtilmelidir. Bu panel, girilen bilgilerle temel bir metin
              oluşturur; somut dosyada süre, ihtar ve başvuru yolu ayrıca değerlendirilmelidir.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Kira ödememe
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Kira ödenmediğinde dilekçeye ne yazılır?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Kiracının temel borçlarından biri kira bedelini ödemektir. Kira bedeli veya yan
                giderler ödenmediğinde ev sahibi, ödeme dönemini, ödenmeyen tutarı, varsa banka
                kayıtlarını ve kiracıya yapılan bildirimleri dilekçede açıkça göstermelidir.
                Konut ve çatılı işyeri kiralarında temerrüt süreçlerinde yazılı bildirim ve
                süre koşulları önem taşıyabilir.
              </p>
            </article>

            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Tahliye talebi
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Tahliye talebinde hangi bilgiler önemlidir?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Tahliye taleplerinde sözleşme tarihi, kira süresi, ihtar veya bildirim bilgisi,
                tahliye sebebi ve dayanak belgeler düzenli yazılmalıdır. Tek başına kısa bir
                anlatım yerine, kiracıya ne zaman bildirim yapıldığı, hangi yükümlülüğün ihlal
                edildiği ve ev sahibinin ne talep ettiği açık şekilde belirtilmelidir.
              </p>
            </article>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Sözleşme ihlali
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Sözleşmeye aykırılık nasıl anlatılır?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Sözleşmeye aykırı kullanım, izinsiz değişiklik, taşınmazın amacı dışında
                kullanılması veya komşulara rahatsızlık verilmesi gibi durumlarda olayın
                tarihi, tekrar edip etmediği ve kiracıya yapılan uyarılar önemlidir. Dilekçede
                genel ifadeler yerine somut olay sırası ve varsa belge, fotoğraf veya yazışma
                bilgisi yer almalıdır.
              </p>
            </article>

            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Eve zarar verme
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Zarar iddiasında hangi deliller kullanılır?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Eve zarar verildiği iddia ediliyorsa teslim tutanağı, fotoğraf, video,
                ekspertiz veya tamirat faturaları gibi belgeler dilekçeyi güçlendirebilir.
                Zararın hangi bölümde oluştuğu, ne zaman fark edildiği ve kiracıya bildirilip
                bildirilmediği mümkün olduğunca açık yazılmalıdır.
              </p>
            </article>
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
                <p className="text-sm font-bold text-navy">1. Talepte bulunulan kurumu belirleyin</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Kira davası, tahliye davası veya tazminat davası olmak üzere görevli
                  mahkeme değişebilir. Çoğu durumda sulh hukuk mahkemesine başvurulur.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">2. Dilekçeyi imzalayıp teslim edin</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Hazırlanan dilekçeyi imzalayıp ekleriyle birlikte mahkemeye teslim
                  edebilirsiniz. Kopyalarını da unutmayın.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">3. Talepte bulunduğu mahkeme bağımsız</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Kiralanan taşınmazın bulunduğu yer mahkemesi yetkilidir. Hukuk müşaviri
                  aracılığıyla başvuru da yapabilirsiniz.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[20px] border border-gold/45 bg-gold-soft/40 p-5">
              <p className="text-[15px] leading-8 text-muted">
                Pratik öneri: Dilekçeyi verdikten sonra mahkemeden bir makbuz alın. Başvuru
                tarihinden itibaren dava takibi yapabilirsiniz. Hukuk müşaviri desteği alırsanız
                yasal süreler ve usul hatalı kesintisi önlenir.
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
                Ev sahibi dilekçesinde en çok merak edilenler
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
                Güncel kira hukuku haberleri
              </h2>
            </div>

            <div className="space-y-5">
              {housingNews.map((item) => (
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

          <div className="rounded-[24px] border border-gold/45 bg-gold-soft/45 px-6 py-6 text-[15px] leading-8 text-muted shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
            <strong className="text-navy">Yasal Uyarı:</strong> Bu panel yalnızca kullanıcının
            girdiği bilgilerle temel dilekçe metni oluşturur; avukatlık veya hukuki danışmanlık
            hizmeti vermez. Kira uyuşmazlıklarında süre, ihtar şartı, görevli kurum ve dava yolu
            dosyaya göre değişebileceğinden uzman desteği almanız tavsiye edilir.
          </div>
        </section>
      </div>
    </>
  );
}
