"use client";

import type { AdminSlide, MediaAsset, SlideSource } from "@/lib/slides/types";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";

type LivePreviewProps = {
  slide: AdminSlide;
  assets: MediaAsset[];
  sources?: SlideSource[];
};

export function LivePreview({ slide, assets, sources = [] }: LivePreviewProps) {
  const primary = assets.find((asset) => asset.id === slide.primary_media_id);
  const background = assets.find((asset) => asset.id === slide.background_media_id);
  const publicSlide = {
    id: slide.id || "preview",
    presentation_id: slide.presentation_id,
    title: slide.title,
    subtitle: slide.subtitle,
    slug: slide.slug,
    slide_type: slide.slide_type,
    content_json: slide.content_json,
    design_json: slide.design_json,
    animation_json: slide.animation_json,
    interactive_config: slide.interactive_config,
    background_media_id: slide.background_media_id,
    background_url: background?.file_url || null,
    background_alt: background?.alt_text || null,
    primary_media_id: slide.primary_media_id,
    primary_media_url: primary?.file_url || null,
    primary_media_type: primary?.file_type || null,
    primary_media_alt: primary?.alt_text || null,
    primary_media_caption: primary?.caption || null,
    sort_order: slide.sort_order,
    created_at: slide.created_at || new Date().toISOString(),
    updated_at: slide.updated_at || new Date().toISOString()
  };

  return (
    <section className="sticky top-24 overflow-hidden rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
      <div className="border-b border-[#0033A0]/10 px-4 py-3">
        <h2 className="font-semibold">Live-Vorschau</h2>
        <p className="mt-1 text-xs text-slate-500">Die Vorschau nutzt dieselben Layout-Komponenten wie die echte Präsentation.</p>
      </div>
      <div className="relative aspect-video overflow-hidden bg-white">
        <div className="absolute left-0 top-0 h-[100vh] w-[177.777vh] origin-top-left scale-[0.16] md:scale-[0.18] lg:scale-[0.20]">
          <SlideRenderer slide={publicSlide} sources={sources} index={0} total={1} />
        </div>
      </div>
    </section>
  );
}
