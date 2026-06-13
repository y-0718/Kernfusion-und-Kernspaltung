"use client";

import type { PublicSlide } from "@/lib/slides/types";

type ProgressNavigationProps = {
  slides: PublicSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ProgressNavigation({ slides, activeIndex, onSelect }: ProgressNavigationProps) {
  const progress = slides.length > 1 ? (activeIndex / (slides.length - 1)) * 100 : 100;

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-1 w-full bg-[#0033A0]/10">
        <div className="h-full bg-[#0033A0] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-label="Slide-Navigation">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-[#0033A0]" : "w-2.5 bg-[#0033A0]/25 hover:bg-[#0033A0]/55"
            }`}
            aria-label={`Zu Slide ${index + 1}: ${slide.title}`}
            title={slide.title}
          />
        ))}
      </nav>
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#0033A0]/10 bg-white/75 px-3 py-1 text-xs font-medium text-[#0033A0] shadow-sm backdrop-blur">
        {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </>
  );
}
