import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageViewTracker from "@/components/PageViewTracker";
import "./globals.css";

const siteUrl = "https://www.itirazdilekcesi.com";
const siteName = "itirazdilekcesi.com";
const defaultTitle = "Trafik Cezası İtiraz Dilekçesi Hazırla";
const defaultDescription =
  "Trafik cezasına itiraz için profesyonel dilekçe oluşturun, değerlendirme alın ve resmi PDF olarak indirin.";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "trafik cezası itiraz dilekçesi",
    "trafik cezasına itiraz",
    "kırmızı ışık cezası itirazı",
    "hız cezası itiraz dilekçesi",
    "park cezası itirazı",
    "trafik cezası dilekçe örneği",
  ],
  category: "legal services",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/branding/itirazdilekcesi-logo-mark.svg",
    shortcut: "/branding/itirazdilekcesi-logo-mark.svg",
    apple: "/branding/itirazdilekcesi-logo-mark.svg",
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "tr_TR",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trafik Cezası İtiraz Dilekçesi Hazırla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head />
      <body className="bg-shell font-body text-ink antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TS2575P9');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TS2575P9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="min-h-screen">
          <PageViewTracker />
          <header className="sticky top-0 z-30 border-b border-line/80 bg-[rgba(255,253,248,0.92)] backdrop-blur">
            <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
              >
                <Image
                  src="/branding/itirazdilekcesi-logo-mark.svg"
                  alt=""
                  width={44}
                  height={44}
                  className="h-12 w-12 rounded-xl sm:h-14 sm:w-14"
                  priority
                />
                <Image
                  src="/branding/itirazdilekcesi-logo-primary.svg"
                  alt="itirazdilekcesi.com"
                  width={268}
                  height={56}
                  className="h-10 w-auto sm:h-12"
                  priority
                />
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </main>

          <footer className="border-t border-line/80 bg-[rgba(255,253,248,0.95)]">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-navy">
                <Link
                  href="/mesafeli-satis-sozlesmesi"
                  className="transition hover:text-navy-deep hover:underline"
                >
                  Mesafeli Satış Sözleşmesi
                </Link>
                <Link
                  href="/iptal-ve-iade-politikasi"
                  className="transition hover:text-navy-deep hover:underline"
                >
                  İptal ve İade Politikası
                </Link>
                <Link href="/kvkk" className="transition hover:text-navy-deep hover:underline">
                  KVKK Aydınlatma Metni
                </Link>
              </div>

              <div className="mx-auto grid max-w-3xl gap-4 rounded-[22px] border border-line/80 bg-surface px-5 py-5 text-center sm:grid-cols-2 sm:text-left">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">
                    Web Sitesi
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">www.itirazdilekcesi.com</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy">
                    Destek
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    destek@itirazdilekcesi.com
                  </p>
                </div>
              </div>

              <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-muted">
                Bu platform yalnızca örnek dilekçe oluşturur. Hukuki danışmanlık vermez.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
