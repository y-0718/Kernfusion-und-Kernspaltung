import type { Presentation, PublicSlide } from "@/lib/slides/types";

export function presentationJsonLd(presentation: Presentation, slides: PublicSlide[]) {
  return {
    "@context": "https://schema.org",
    "@type": "PresentationDigitalDocument",
    name: presentation.title,
    description: presentation.description,
    inLanguage: "de",
    hasPart: slides.map((slide, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: slide.title
    }))
  };
}
