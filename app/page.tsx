import TrafficPetitionTool from "@/components/TrafficPetitionTool";
import { trafficNews } from "@/lib/news";

export default function HomePage() {
  return (
    <div className="single-page">
      <section className="hero-section">
        <div className="official-mark">T.C.</div>
        <h1>Trafik Cezası İtiraz Dilekçesi Hazırla</h1>
        <p className="hero-subtitle">
          2 dakikada profesyonel dilekçenizi oluşturun
        </p>
      </section>

      <TrafficPetitionTool />

      <section className="seo-section">
        <div className="news-block">
          <h2>Güncel trafik haberleri</h2>
          <div className="news-list">
            {trafficNews.map((item) => (
              <article key={item.href} className="news-item">
                <div className="news-meta">
                  <span>{item.date}</span>
                  <span>{item.source}</span>
                </div>
                <h3>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="seo-block">
          <h2>Trafik cezası nasıl iptal edilir?</h2>
          <p>
            Trafik cezalarına itiraz edilirken cezanın dayandığı tespit, tutanak
            içeriği, tebliğ süreci, radar veya kamera kaydı gibi unsurlar dikkatle
            değerlendirilmelidir. Somut olayın açık biçimde ortaya konulamaması,
            delil eksikliği veya usul hatası gibi durumlar itirazı güçlendirebilir.
          </p>
        </div>

        <div className="seo-block">
          <h2>İtiraz süresi kaç gün?</h2>
          <p>
            Trafik cezası itirazlarında tebliğ tarihi kritik önem taşır. Bu nedenle
            ceza tarihi ile birlikte tebliğ tarihinin de doğru girilmesi gerekir.
            Başvuru süresi yönünden hak kaybı yaşanmaması için tarihlerin net ve
            eksiksiz olması önemlidir.
          </p>
        </div>

        <div className="seo-block">
          <h2>Hangi durumlarda iptal olur?</h2>
          <p>
            Yanlış plaka, eksik tutanak bilgisi, delil yetersizliği, kamera veya
            radar kaydının bulunmaması, olay yerinin belirsizliği ya da tebliğ
            usulüne aykırılık gibi durumlar itiraz bakımından önemli olabilir.
            Her dosya kendi koşullarına göre değerlendirilmelidir.
          </p>
        </div>
      </section>
    </div>
  );
}
