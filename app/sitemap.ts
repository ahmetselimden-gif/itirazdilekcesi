import type { MetadataRoute } from "next";

const baseUrl = "https://www.itirazdilekcesi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-ve-iade-politikasi",
    "/kvkk",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
