"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { PublicSlide } from "@/lib/slides/types";
import { ScientificPlaceholder } from "@/components/presentation/slides/ScientificPlaceholder";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

type MediaBlockProps = {
  slide: PublicSlide;
  mode?: "image" | "video";
};

export function MediaBlock({ slide, mode = "image" }: MediaBlockProps) {
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const mediaY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [24, 0, -24]);
  const mediaScale = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1.025, 1, 1.025]);
  const url = slide.primary_media_url;

  if (!url) {
    return (
      <motion.div className="relative" style={{ y: mediaY, scale: mediaScale }}>
        <ScientificPlaceholder slide={slide} className="aspect-[1.28] h-full w-full" />
      </motion.div>
    );
  }

  const revealInitial = reduceMotion
    ? false
    : { opacity: 0, scale: 1.045, clipPath: "inset(7% 5% 7% 5%)", filter: "blur(8px)" };
  const revealVisible = { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)" };

  if (mode === "video" || slide.primary_media_type === "video") {
    return (
      <motion.div
        className="relative"
        style={{ y: mediaY, scale: mediaScale }}
      >
        <motion.div
          className="media-frame bg-[#1A1A1A]"
          initial={revealInitial}
          whileInView={revealVisible}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 1.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <video src={url} controls playsInline className="h-full min-h-[210px] w-full object-cover md:min-h-[420px]" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div className="relative" style={{ y: mediaY, scale: mediaScale }}>
      <motion.figure
        className="media-frame"
        initial={revealInitial}
        whileInView={revealVisible}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 1.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={url}
          alt={slide.primary_media_alt || ""}
          className="h-full min-h-[210px] w-full object-cover md:min-h-[420px]"
          initial={reduceMotion ? false : { scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
        />
        {slide.primary_media_caption ? (
          <figcaption className="border-t border-[#0033A0]/10 bg-white/92 px-4 py-3 text-sm text-[#1A1A1A]/70 backdrop-blur">{slide.primary_media_caption}</figcaption>
        ) : null}
      </motion.figure>
    </motion.div>
  );
}
