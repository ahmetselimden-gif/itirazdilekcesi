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
      <body className="bg-shell font-body text-ink antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-line/80 bg-[rgba(255,253,248,0.92)] backdrop-blur">
            <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="font-display text-lg font-semibold tracking-tight text-navy transition-colors duration-200 hover:text-navy-deep"
              >
                Trafik Cezası İtiraz Dilekçesi
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </main>

          <footer className="border-t border-line/80 bg-[rgba(255,253,248,0.95)]">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
              <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-navy">
                <Link href="/mesafeli-satis-sozlesmesi" className="transition hover:text-navy-deep hover:underline">
                  Mesafeli Satış Sözleşmesi
                </Link>
                <Link href="/iptal-ve-iade-politikasi" className="transition hover:text-navy-deep hover:underline">
                  İptal ve İade Politikası
                </Link>
                <Link href="/kvkk" className="transition hover:text-navy-deep hover:underline">
                  KVKK Aydınlatma Metni
                </Link>
              </div>

              <p className="mb-3 text-sm text-muted">Destek için: destek@itirazdilekcesi.com</p>
              <p className="mx-auto max-w-3xl text-sm leading-7 text-muted">
                Bu platform yalnızca örnek dilekçe oluşturur. Hukuki danışmanlık vermez.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
