"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicSlide } from "@/lib/slides/types";
import { ScientificPlaceholder } from "@/components/presentation/slides/ScientificPlaceholder";

type MediaBlockProps = {
  slide: PublicSlide;
  mode?: "image" | "video";
};

export function MediaBlock({ slide, mode = "image" }: MediaBlockProps) {
  const reduceMotion = useReducedMotion();
  const url = slide.primary_media_url;

  if (!url) {
    return <ScientificPlaceholder slide={slide} className="aspect-[1.28] h-full w-full" />;
  }

  const revealInitial = reduceMotion
    ? false
    : { opacity: 0, scale: 1.045, clipPath: "inset(7% 5% 7% 5%)", filter: "blur(8px)" };
  const revealVisible = { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)" };

  if (mode === "video" || slide.primary_media_type === "video") {
    return (
      <motion.div
        className="media-frame bg-[#1A1A1A]"
        initial={revealInitial}
        whileInView={revealVisible}
        viewport={{ amount: 0.45 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <video src={url} controls playsInline className="h-full min-h-[420px] w-full object-cover" />
      </motion.div>
    );
  }

  return (
    <motion.figure
      className="media-frame"
      initial={revealInitial}
      whileInView={revealVisible}
      viewport={{ amount: 0.45 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src={url}
        alt={slide.primary_media_alt || ""}
        className="h-full min-h-[420px] w-full object-cover"
        initial={reduceMotion ? false : { scale: 1.035 }}
        whileInView={{ scale: 1 }}
        viewport={{ amount: 0.45 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      />
      {slide.primary_media_caption ? (
        <figcaption className="bg-white px-4 py-3 text-sm text-[#1A1A1A]/70">{slide.primary_media_caption}</figcaption>
      ) : null}
    </motion.figure>
  );
}
