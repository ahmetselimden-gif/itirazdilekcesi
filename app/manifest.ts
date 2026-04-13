import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "itirazdilekcesi.com",
    short_name: "İtiraz Paneli",
    description:
      "Trafik cezası, kiracı ve ev sahibi itiraz dilekçesi panelleri arasından seçim yapın.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#132544",
    lang: "tr-TR",
  };
}
