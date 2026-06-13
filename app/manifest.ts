import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kernfusion und Kernspaltung",
    short_name: "Kernenergie",
    description: "Interaktive Physik-Präsentation mit CMS.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0033A0",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
