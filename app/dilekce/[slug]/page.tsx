import { notFound } from "next/navigation";
import LegalSeoPage from "@/components/LegalSeoPage";
import { getProgrammaticSeoPage, programmaticSeoPages } from "@/lib/seoContent";
import { buildSeoMetadata } from "@/lib/seoMetadata";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return programmaticSeoPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getProgrammaticSeoPage(slug);

  if (!page) {
    return {};
  }

  return buildSeoMetadata(page);
}

export default async function DilekceProgrammaticSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getProgrammaticSeoPage(slug);

  if (!page) {
    notFound();
  }

  return <LegalSeoPage page={page} />;
}
