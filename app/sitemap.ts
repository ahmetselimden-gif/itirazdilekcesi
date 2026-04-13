import type { MetadataRoute } from "next";

const baseUrl = "https://www.itirazdilekcesi.com";
const seoPaths = [
  "/trafik-cezasi-itiraz-dilekcesi-nasil-yazilir",
  "/trafik-cezasi-itiraz-sureci-2026",
  "/radar-cezasi-itiraz-edilir-mi",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/trafik-cezasi-itiraz",
    "/kiraci",
    "/ev-sahibi",
    ...seoPaths,
    "/mesafeli-satis-sozlesmesi",
    "/iptal-ve-iade-politikasi",
    "/kvkk",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || seoPaths.includes(path) ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/trafik-cezasi-itiraz" ? 0.9 : seoPaths.includes(path) ? 0.8 : 0.6,
  }));
}
