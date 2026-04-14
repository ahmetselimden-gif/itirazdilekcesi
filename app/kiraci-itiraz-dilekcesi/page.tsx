import LegalSeoPage from "@/components/LegalSeoPage";
import { coreSeoPages } from "@/lib/seoContent";
import { buildSeoMetadata } from "@/lib/seoMetadata";

const page = coreSeoPages.find((item) => item.slug === "kiraci-itiraz-dilekcesi")!;

export const metadata = buildSeoMetadata(page);

export default function KiraciItirazDilekcesiPage() {
  return <LegalSeoPage page={page} />;
}
