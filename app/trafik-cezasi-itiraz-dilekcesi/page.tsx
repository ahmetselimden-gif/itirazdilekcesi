import LegalSeoPage from "@/components/LegalSeoPage";
import { coreSeoPages } from "@/lib/seoContent";
import { buildSeoMetadata } from "@/lib/seoMetadata";

const page = coreSeoPages.find((item) => item.slug === "trafik-cezasi-itiraz-dilekcesi")!;

export const metadata = buildSeoMetadata(page);

export default function TrafikCezasiItirazDilekcesiPage() {
  return <LegalSeoPage page={page} />;
}
