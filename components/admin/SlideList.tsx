"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AdminSlide } from "@/lib/slides/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { slideTypeLabels } from "@/lib/slides/types";

type SlideListProps = {
  slides: AdminSlide[];
  presentationId: string;
};

export function SlideList({ slides, presentationId }: SlideListProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function duplicate(slide: AdminSlide) {
    setBusyId(slide.id);
    const supabase = createClient();
    const maxOrder = slides.reduce((max, item) => Math.max(max, item.sort_order), 0);
    const { data, error } = await supabase
      .from("slides")
      .insert({
        presentation_id: presentationId,
        title: `${slide.title} Kopie`,
        subtitle: slide.subtitle,
        slug: `${slide.slug}-kopie-${Date.now()}`,
        slide_type: slide.slide_type,
        content_json: slide.content_json,
        design_json: slide.design_json,
        animation_json: slide.animation_json,
        interactive_config: slide.interactive_config,
        background_media_id: slide.background_media_id,
        primary_media_id: slide.primary_media_id,
        status: "draft",
        presenter_notes: slide.presenter_notes,
        sort_order: maxOrder + 1
      })
      .select("id")
      .single();

    setBusyId(null);
    if (!error && data) router.push(`/admin/slides/${data.id}`);
  }

  async function archive(id: string) {
    if (!confirm("Diese Slide wirklich archivieren? Sie kann später in Supabase wiederhergestellt werden.")) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("slides").update({ status: "archived" }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function togglePublished(slide: AdminSlide) {
    setBusyId(slide.id);
    const supabase = createClient();
    await supabase.from("slides").update({ status: slide.status === "published" ? "hidden" : "published" }).eq("id", slide.id);
    setBusyId(null);
    router.refresh();
  }

  async function move(slide: AdminSlide, direction: -1 | 1) {
    const currentIndex = slides.findIndex((item) => item.id === slide.id);
    const target = slides[currentIndex + direction];
    if (!target) return;
    setBusyId(slide.id);
    const supabase = createClient();
    await Promise.all([
      supabase.from("slides").update({ sort_order: target.sort_order }).eq("id", slide.id),
      supabase.from("slides").update({ sort_order: slide.sort_order }).eq("id", target.id)
    ]);
    setBusyId(null);
    router.refresh();
  }

  return (
    <section className="rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0033A0]/10 p-4">
        <div>
          <h1 className="text-2xl font-semibold">Slides</h1>
          <p className="mt-1 text-sm text-slate-500">Erstellen, sortieren, duplizieren, veröffentlichen oder ausblenden.</p>
        </div>
        <Link href="/admin/slides/new">
          <Button>
            <Plus size={18} />
            Neue Slide
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-[#0033A0]/10">
        {slides.map((slide, index) => (
          <article key={slide.id} className="grid gap-4 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <GripVertical size={18} />
              <span className="w-8 text-sm font-semibold">{index + 1}</span>
            </div>
            <Link href={`/admin/slides/${slide.id}`} className="block rounded-md p-2 transition hover:bg-[#EEF4FF]">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{slide.title || "Unbenannte Slide"}</h2>
                <span className="rounded-full bg-[#EEF4FF] px-2 py-1 text-xs font-semibold text-[#0033A0]">
                  {slideTypeLabels[slide.slide_type]}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    slide.status === "published" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {slide.status}
                </span>
              </div>
              {slide.subtitle ? <p className="mt-1 text-sm text-slate-500">{slide.subtitle}</p> : null}
            </Link>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" disabled={busyId === slide.id} onClick={() => move(slide, -1)}>
                ↑
              </Button>
              <Button type="button" variant="secondary" disabled={busyId === slide.id} onClick={() => move(slide, 1)}>
                ↓
              </Button>
              <Button type="button" variant="secondary" disabled={busyId === slide.id} onClick={() => togglePublished(slide)}>
                {slide.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button type="button" variant="secondary" disabled={busyId === slide.id} onClick={() => duplicate(slide)}>
                <Copy size={16} />
              </Button>
              <Button type="button" variant="danger" disabled={busyId === slide.id} onClick={() => archive(slide.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </article>
        ))}
        {!slides.length ? <p className="p-8 text-center text-slate-500">Noch keine Slides vorhanden.</p> : null}
      </div>
    </section>
  );
}
