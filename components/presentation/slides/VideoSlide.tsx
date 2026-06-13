import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function VideoSlide({ slide, content, design }: Props) {
  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto w-full max-w-6xl text-center">
        <h1 className="text-4xl font-semibold md:text-6xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-4 text-2xl opacity-70">{slide.subtitle}</p> : null}
        <div className="mt-10">
          {content.videoEmbedUrl ? (
            <div className="media-frame aspect-video bg-[#1A1A1A]">
              <iframe
                src={normalizeEmbedUrl(content.videoEmbedUrl)}
                title={slide.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <MediaBlock slide={slide} mode="video" />
          )}
        </div>
        {content.body ? <p className="mx-auto mt-7 max-w-3xl text-xl leading-8 opacity-75">{content.body}</p> : null}
      </div>
    </SlideShell>
  );
}

function normalizeEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }
  return url;
}
