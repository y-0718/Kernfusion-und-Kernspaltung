import type { PublicSlide } from "@/lib/slides/types";

type MediaBlockProps = {
  slide: PublicSlide;
  mode?: "image" | "video";
};

export function MediaBlock({ slide, mode = "image" }: MediaBlockProps) {
  const url = slide.primary_media_url;

  if (!url) {
    return (
      <div className="media-frame grid min-h-[360px] place-items-center border border-dashed border-[#0033A0]/25 bg-[#EEF4FF] p-8 text-center text-[#0033A0]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Medienplatzhalter</p>
          <p className="mt-3 text-lg text-[#1A1A1A]/70">Wähle im Admin-Bereich ein Bild oder Video aus.</p>
        </div>
      </div>
    );
  }

  if (mode === "video" || slide.primary_media_type === "video") {
    return (
      <div className="media-frame bg-[#1A1A1A]">
        <video src={url} controls playsInline className="h-full min-h-[420px] w-full object-cover" />
      </div>
    );
  }

  return (
    <figure className="media-frame">
      <img src={url} alt={slide.primary_media_alt || ""} className="h-full min-h-[420px] w-full object-cover" />
      {slide.primary_media_caption ? (
        <figcaption className="bg-white px-4 py-3 text-sm text-[#1A1A1A]/70">{slide.primary_media_caption}</figcaption>
      ) : null}
    </figure>
  );
}
