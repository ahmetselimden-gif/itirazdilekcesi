import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://www.itirazdilekcesi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Trafik Cezası İtiraz Dilekçesi Hazırla",
  description:
    "Trafik cezasına itiraz için profesyonel dilekçe oluşturun, değerlendirme alın ve temiz PDF olarak indirin.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "itirazdilekcesi.com",
    title: "Trafik Cezası İtiraz Dilekçesi Hazırla",
    description:
      "Trafik cezasına itiraz için profesyonel dilekçe oluşturun, değerlendirme alın ve temiz PDF olarak indirin.",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trafik Cezası İtiraz Dilekçesi Hazırla",
    description:
      "Trafik cezasına itiraz için profesyonel dilekçe oluşturun, değerlendirme alın ve temiz PDF olarak indirin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="site-shell">
          <header className="topbar">
            <div className="container topbar-inner">
              <Link href="/" className="brand">
                Trafik Cezası İtiraz Dilekçesi
              </Link>
            </div>
          </header>
          <main className="container page-content">{children}</main>
          <footer className="footer">
            <div className="container footer-inner">
              <div className="footer-links">
                <Link href="/mesafeli-satis-sozlesmesi">
                  Mesafeli Satış Sözleşmesi
                </Link>
                <Link href="/iptal-ve-iade-politikasi">
                  İptal ve İade Politikası
                </Link>
                <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
              </div>

              <div className="footer-company">
                <p>Destek için: destek@itirazdilekcesi.com</p>
              </div>

              <p className="footer-disclaimer">
                Bu platform yalnızca örnek dilekçe oluşturur. Hukuki danışmanlık
                vermez.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
