import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "itirazdilekcesi.com",
    short_name: "İtiraz Dilekçesi",
    description:
      "Trafik cezasına itiraz için profesyonel dilekçe oluşturun ve resmi PDF olarak indirin.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#132544",
    lang: "tr-TR",
  };
}
