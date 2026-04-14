import LegalSeoPage from "@/components/LegalSeoPage";
import { coreSeoPages } from "@/lib/seoContent";
import { buildSeoMetadata } from "@/lib/seoMetadata";

const page = coreSeoPages.find((item) => item.slug === "ev-sahibi-itiraz-dilekcesi")!;

export const metadata = buildSeoMetadata(page);

export default function EvSahibiItirazDilekcesiPage() {
  return <LegalSeoPage page={page} />;
}
