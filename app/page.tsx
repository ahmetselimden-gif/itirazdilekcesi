import TrafficPetitionTool from "@/components/TrafficPetitionTool";
import { trafficNews } from "@/lib/news";

export default function HomePage() {
  return (
    <div className="single-page">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">T.C.</div>
            <h1>Trafik Cezası İtiraz Dilekçesi Hazırla</h1>
            <p className="hero-subtitle">
              Trafik cezanıza karşı resmi, düzenli ve güven veren bir itiraz
              dilekçesini dakikalar içinde oluşturun.
            </p>

            <div className="hero-points">
              <div>
                <strong>Hızlı başvuru</strong>
                <span>Formu doldurun, metni anında oluşturun.</span>
              </div>
              <div>
                <strong>Resmi görünüm</strong>
                <span>Dilekçe ve PDF alanı evrak düzenine göre hazırlanır.</span>
              </div>
              <div>
                <strong>Tek odak</strong>
                <span>Sistem yalnızca trafik cezası itirazına odaklanır.</span>
              </div>
            </div>
          </div>

          <div className="hero-note">
            <div className="hero-note-card">
              <p className="hero-note-label">Hazırlık Notu</p>
              <h2>Başvuru öncesi temel kontrol</h2>
              <ul className="hero-checks">
                <li>Ceza tarihi ve tebliğ tarihini doğru girin.</li>
                <li>Olay yerini mümkün olduğunca açık yazın.</li>
                <li>Usul, delil veya tebligat eksikliğini belirtin.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <TrafficPetitionTool />

      <section className="seo-section">
        <div className="seo-block seo-block-wide">
          <div className="section-heading">
            <span>Bilgilendirme</span>
            <h2>Trafik cezası nasıl iptal edilir?</h2>
          </div>
          <p>
            Trafik cezalarına itiraz edilirken cezanın dayandığı tespit,
            tutanak içeriği, tebliğ süreci, radar veya kamera kaydı gibi
            unsurlar dikkatle değerlendirilmelidir. Somut olayın açık biçimde
            ortaya konulamaması, delil eksikliği veya usul hatası gibi durumlar
            itirazı güçlendirebilir.
          </p>
        </div>

        <div className="seo-columns">
          <div className="seo-block">
            <div className="section-heading">
              <span>Süre</span>
              <h2>İtiraz süresi kaç gün?</h2>
            </div>
            <p>
              Trafik cezası itirazlarında tebliğ tarihi kritik önem taşır. Bu
              nedenle ceza tarihi ile birlikte tebliğ tarihinin de doğru
              girilmesi gerekir. Başvuru süresi yönünden hak kaybı yaşamamak
              için tarihlerin net ve eksiksiz olması önemlidir.
            </p>
          </div>

          <div className="seo-block">
            <div className="section-heading">
              <span>Dayanak</span>
              <h2>Hangi durumlarda iptal olur?</h2>
            </div>
            <p>
              Yanlış plaka, eksik tutanak bilgisi, delil yetersizliği, kamera
              veya radar kaydının bulunmaması, olay yerinin belirsizliği ya da
              tebliğ usulüne aykırılık gibi durumlar itiraz bakımından önemli
              olabilir. Her dosya kendi koşullarına göre değerlendirilmelidir.
            </p>
          </div>
        </div>

        <div className="news-block">
          <div className="section-heading">
            <span>Gündem</span>
            <h2>Güncel trafik haberleri</h2>
          </div>
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
      </section>
    </div>
  );
}
