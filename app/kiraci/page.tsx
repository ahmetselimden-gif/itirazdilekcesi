import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import HousingPetitionTool from "@/components/HousingPetitionTool";
import { housingNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Kiracı İtiraz Dilekçesi",
  description: "Kiracı itiraz dilekçesi formunu doldurun ve dilekçe metninizi oluşturun.",
  alternates: {
    canonical: "/kiraci",
  },
};

const siteUrl = "https://www.itirazdilekcesi.com";

const faqItems = [
  {
    question: "Kiracı dilekçesi yazarken hangi belgeler hazırlanmalıdır?",
    answer:
      "Dilekçeyi güçlendiren önemli belgeler: kira sözleşmesi, ödeme dekontu veya banka ekstresi, teslim tutanağı, ev sahibinin yazılı talepleri, ihtarname, fotoğraf veya video kayıtları. Dilekçe tek başına dosyayı yeterli kılmaz; destekleyici belgeler ile birlikte sunulması başarı şansını artırır.",
  },
  {
    question: "Kira artışı itirazı nereden ve nasıl yapılır?",
    answer:
      "Kira artışı itirazı genellikle sulh hukuk mahkemesine yapılır. İtiraz süresi artış bildirimi tarihinden itibaren 15 gündür. Dilekçede artışın ne kadarının TÜFE oranını aştığı, mevcut kiranın ne olduğu ve yeni talebin neden kabul edilemediği açıkça anlatılmalıdır.",
  },
  {
    question: "Sözleşme süresi bitse bile ev sahibi tahliye edebilir mi?",
    answer:
      "Sadece süresi bitmiş olmak tahliye sebebi değildir. Tahliye için yasal sebep olması gerekir (kira ödememe, sözleşme ihlali vb.). Belirli süreli sözleşmede süreden önce bildirim yapmadıysa sözleşme otomatik uzar. Tahliye baskısı varsa bunu dilekçede belirtebilirsiniz.",
  },
  {
    question: "Depozito iadesi talebi kaç gün sonra sonuçlanır?",
    answer:
      "Depozito iade talebinin süresi hukuki duruma göre değişir. Doğrudan ev sahibine talep edilirse anlaşmayla çözülebilir; mahkeme yoluna gidilirse dava süreci birkaç aydan bir yıla kadar sürebilir. Teslim tutanağında ev konumunun belgelenmesi, iade talebini hızlandırır.",
  },
];

const conversionHighlights = [
  "Tek odaklı kiracı paneli",
  "Resmi dilekçe formatı",
  "3 dakikada hazır",
];

const compactTenantGuides = [
  {
    href: "/kiraci-itiraz-dilekcesi",
    label: "Kiracı rehberi",
  },
  {
    href: "/dilekce/kira-artisi-itiraz",
    label: "Kira artışı itirazı",
  },
  {
    href: "/dilekce/tahliye-itiraz",
    label: "Tahliye itirazı",
  },
  {
    href: "/dilekce/depozito-iade-dilekcesi",
    label: "Depozito iadesi",
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

export default function KiraciPage() {
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
                KİRACI PANELI
              </div>

              <h1 className="font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-navy-deep sm:text-5xl lg:text-[4.1rem]">
                Kiracı İtiraz Dilekçesi Hazırla
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Kira uyuşmazlığında yaşadığınız probleme karşı resmi, temiz ve güven veren bir
                dilekçeyi dakikalar içinde oluşturun.
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
                    Sistem yalnızca kira uyuşmazlıkları ile ilgilenir.
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
                  Kira sözleşmesini yanınızda hazırlayın.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Olayın tarihi ve dönemini doğru bilin.
                </li>
                <li className="relative pl-5 before:absolute before:left-0 before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-gold">
                  Varsa yazılı bildirimleri toplayın.
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
                Kira uyuşmazlıklarında başvuru süresini kaçırırsanız hak kaybı olabilir.
              </p>
            </div>
          </div>
        </section>

        <HousingPetitionTool
          apiPath="/api/kiraci"
          eyebrow="Kiracı paneli"
          title="Kiracı İtiraz Dilekçesi"
          description="Kiracı olarak yaşadığınız probleme göre temel dilekçe metninizi oluşturun."
          counterpartyLabel="Ev Sahibi Adı"
          problemOptions={[
            "Haksız kira artışı",
            "Tahliye baskısı",
            "Depozito iadesi",
            "Sözleşme ihlali",
            "Diğer",
          ]}
        />

        <section className="rounded-[20px] border border-line/80 bg-surface px-5 py-5 shadow-[0_16px_38px_rgba(17,34,51,0.05)] sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-navy-deep">Formdan sonra kısa rehberlere de bakabilirsiniz</p>
              <p className="mt-1 text-sm leading-7 text-muted">
                Akışı bozmadan, ihtiyacınıza göre ilgili kiracı konularını yeni sekmede açabilirsiniz.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {compactTenantGuides.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface-soft px-4 text-sm font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:border-navy/40"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.06)] sm:px-8">
            <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
              <span className="h-px w-8 bg-navy/30" />
              Kiracı hakları
            </span>
            <h2 className="mt-3 font-display text-3xl text-navy-deep">
              Kiracı hangi durumlarda itiraz dilekçesi hazırlayabilir?
            </h2>
            <p className="mt-4 max-w-5xl text-[15px] leading-8 text-muted">
              Kiracı, kira ilişkisi içinde yaşadığı uyuşmazlığı yazılı hale getirmek ve ilgili
              kuruma sunmak için dilekçe hazırlayabilir. Haksız kira artışı, tahliye baskısı,
              depozito iadesi, sözleşmeye aykırı talepler veya kiralananın kullanımıyla ilgili
              sorunlarda dilekçede olayın tarihi, taraflar, kiralanan adres, talep ve varsa
              belgeler açıkça belirtilmelidir. Bu panel, girilen bilgilerle temel bir metin
              oluşturur; somut uyuşmazlıkta süre, görevli kurum ve dava yolu ayrıca
              değerlendirilmelidir.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Kira artışı
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Haksız kira artışına karşı ne yazılır?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Yenilenen kira dönemlerinde kira artışı değerlendirilirken sözleşme, önceki
                kira bedeli, artış bildirimi ve TÜFE on iki aylık ortalama oranı birlikte
                incelenir. İtiraz metninde talep edilen artışın hangi tarihte bildirildiği,
                mevcut kira bedeli ve artışın neden kabul edilmediği somut şekilde yazılmalıdır.
              </p>
            </article>

            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Tahliye baskısı
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Ev sahibi süre bitti diye çıkarabilir mi?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Konut ve çatılı işyeri kiralarında sözleşme süresinin bitmesi tek başına her
                durumda tahliye sebebi gibi değerlendirilmemelidir. Kiracı, belirli süreli
                sözleşmede sürenin bitiminden önce bildirim yapmadığında sözleşmenin uzaması
                gündeme gelebilir. Tahliye baskısı varsa dilekçede baskının tarihi, yöntemi ve
                dayanak gösterilen sebep açıkça anlatılmalıdır.
              </p>
            </article>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Depozito
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Depozito iadesi istenirken nelere dikkat edilir?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Depozito uyuşmazlıklarında kira sözleşmesi, ödeme dekontu, teslim tutanağı,
                evin teslim edildiği tarih ve ev sahibinin iade etmeme gerekçesi önemlidir.
                Dilekçede depozitonun ne zaman ve nasıl ödendiği, kiralananın hangi tarihte
                teslim edildiği ve iade talebinin neden haklı görüldüğü açıkça belirtilmelidir.
              </p>
            </article>

            <article className="rounded-[24px] border border-line/80 bg-surface px-6 py-7 shadow-[0_20px_50px_rgba(17,34,51,0.05)] sm:px-8">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-navy">
                <span className="h-px w-8 bg-navy/30" />
                Sözleşme ve delil
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy-deep">
                Dilekçeye hangi bilgiler eklenmeli?
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted">
                Kira sözleşmesi, ödeme kayıtları, yazışmalar, ihtarname, teslim tutanağı,
                fotoğraf ve benzeri belgeler iddianın anlaşılmasını kolaylaştırır. Dilekçede
                yalnızca genel itiraz cümleleri yerine, olay sırası, talep edilen işlem ve
                başvurulan kurum net şekilde yazılmalıdır.
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
                <p className="text-sm font-bold text-navy">1. Uyuşmazlık türünü belirleyin</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Kira artışı, tahliye, depozito vb. uyuşmazlık türüne göre başvuru yeri
                  değişebilir. Çoğu durumda sulh hukuk mahkemesine başvuru yapılır.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">2. Adliye veya müdürlük başvurusu</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Hazırlanan dilekçeyi imzalayıp ekleriyle birlikte ilgili adliye mahkemesine
                  veya resmî kuruma teslim edebilirsiniz.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-surface-soft p-5">
                <p className="text-sm font-bold text-navy">3. Başvuru süresini kaçırmayın</p>
                <p className="mt-3 text-[15px] leading-8 text-muted">
                  Kira uyuşmazlıklarında başvuru süreleri kısa olabilir. Talep tutanağı
                  tarihinden itibaren süreler başlar, gecikmeden işlem yapın.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[20px] border border-gold/45 bg-gold-soft/40 p-5">
              <p className="text-[15px] leading-8 text-muted">
                Pratik öneri: Dilekçeyi vermeden önce uyuşmazlığınızın hangi mahkemeye yönelik
                olduğunu teyit almak işleminizi hızlandırır. İlgili adliye veya hukuk müşaviri
                ile danışmak, süre kaybını engellemede önemlidir.
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
                Kiracı dilekçesinde en çok merak edilenler
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
            hizmeti vermez. Hak kaybı yaşamamak için somut dosyanızdaki süre, görevli kurum ve
            başvuru yolu konusunda uzman desteği almanız tavsiye edilir.
          </div>
        </section>
      </div>
    </>
  );
}
