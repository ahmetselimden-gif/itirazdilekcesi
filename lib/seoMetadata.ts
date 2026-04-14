import type { Metadata } from "next";
import type { SeoPageContent } from "@/lib/seoContent";

const siteUrl = "https://www.itirazdilekcesi.com";
const siteName = "itirazdilekcesi.com";

export function buildSeoMetadata(page: SeoPageContent): Metadata {
  const url = `${siteUrl}${page.path}`;

  return {
    title: page.metaTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      type: "article",
      url,
      siteName,
      locale: "tr_TR",
      title: page.metaTitle,
      description: page.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
