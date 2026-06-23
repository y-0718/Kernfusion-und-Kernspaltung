"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

type Props = { slide: PublicSlide; content: SlideContent; design: SlideDesign; index: number; total: number };

export function VideoSlide({ slide, content, design }: Props) {
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const mediaY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [24, 0, -24]);
  const titleY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [7, 0, -7]);

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto w-full max-w-[86rem]">
        <motion.div className="relative z-10 max-w-4xl" style={{ y: titleY }}>
          <h1 className="text-4xl font-semibold leading-[0.96] md:text-6xl lg:text-7xl">{slide.title}</h1>
          {slide.subtitle ? <p className="mt-4 max-w-2xl text-xl opacity-[0.7] md:text-2xl">{slide.subtitle}</p> : null}
        </motion.div>
        <div className="mt-7 md:mt-9">
          {content.videoEmbedUrl ? (
            <motion.div className="media-frame aspect-video bg-[#1A1A1A]" style={{ y: mediaY }}>
              <iframe
                src={normalizeEmbedUrl(content.videoEmbedUrl)}
                title={slide.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          ) : <MediaBlock slide={slide} mode="video" />}
        </div>
        {content.body ? <p className="ml-auto mt-5 max-w-2xl text-lg leading-8 opacity-[0.72] md:text-xl">{content.body}</p> : null}
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
