import type { SlideType } from "@/lib/slides/types";

export const DEFAULT_PRESENTATION_SLUG = "kernfusion-und-kernspaltung";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function defaultContentForType(slideType: SlideType) {
  switch (slideType) {
    case "comparison":
      return {
        body: "",
        left: { title: "Linke Seite", items: ["Erster Punkt"] },
        right: { title: "Rechte Seite", items: ["Erster Punkt"] }
      };
    case "quote":
      return { quote: "Eine klare Kernaussage.", author: "", body: "" };
    case "video":
      return { body: "", videoEmbedUrl: "", caption: "" };
    case "infographic":
      return { body: "", labels: ["Beschriftung"], visualization: "atom_structure" };
    case "sources":
      return { body: "Die Quellenübersicht wird automatisch erzeugt." };
    default:
      return { body: "", bullets: [] };
  }
}

export function defaultDesign() {
  return {
    variant: "full_bleed_image",
    backgroundColor: "#FFFFFF",
    textAlignment: "left",
    mediaPosition: "right",
    accentColor: "#0033A0",
    overlay: "none"
  };
}

export function defaultAnimation() {
  return {
    transition: "fade"
  };
}
