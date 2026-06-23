"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
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
  const [orderedSlides, setOrderedSlides] = useState(slides);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
  const orderRef = useRef(slides);
  const dropCompletedRef = useRef(false);

  useEffect(() => {
    setOrderedSlides(slides);
    orderRef.current = slides;
  }, [slides]);

  async function duplicate(slide: AdminSlide) {
    setBusyId(slide.id);
    const supabase = createClient();
    const maxOrder = orderedSlides.reduce((max, item) => Math.max(max, item.sort_order), 0);
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

  async function persistOrder(nextOrder: AdminSlide[]) {
    const normalized = nextOrder.map((slide, index) => ({ ...slide, sort_order: index }));
    setOrderedSlides(normalized);
    orderRef.current = normalized;
    setBusyId("slide-order");
    setOrderMessage("Reihenfolge wird gespeichert ...");

    const supabase = createClient();
    const results = await Promise.all(
      normalized.map((slide) => supabase.from("slides").update({ sort_order: slide.sort_order }).eq("id", slide.id))
    );
    const failed = results.find((result) => result.error)?.error;

    setBusyId(null);
    if (failed) {
      setOrderedSlides(slides);
      orderRef.current = slides;
      setOrderMessage(`Speichern fehlgeschlagen: ${failed.message}`);
      return;
    }

    setOrderMessage("Reihenfolge gespeichert.");
    router.refresh();
  }

  function move(slide: AdminSlide, direction: -1 | 1) {
    const currentIndex = orderedSlides.findIndex((item) => item.id === slide.id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedSlides.length) return;

    const nextOrder = [...orderedSlides];
    const [movedSlide] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(targetIndex, 0, movedSlide);
    void persistOrder(nextOrder);
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, slideId: string) {
    if (busyId) {
      event.preventDefault();
      return;
    }

    dropCompletedRef.current = false;
    setDraggedId(slideId);
    setOrderMessage("");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", slideId);
  }

  function handleDragOver(event: DragEvent<HTMLElement>, targetId: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (!draggedId || draggedId === targetId) return;

    setOrderedSlides((current) => {
      const sourceIndex = current.findIndex((slide) => slide.id === draggedId);
      const targetIndex = current.findIndex((slide) => slide.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const nextOrder = [...current];
      const [movedSlide] = nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, movedSlide);
      orderRef.current = nextOrder;
      return nextOrder;
    });
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    if (!draggedId) return;

    dropCompletedRef.current = true;
    setDraggedId(null);
    void persistOrder(orderRef.current);
  }

  function handleDragEnd() {
    if (!dropCompletedRef.current) {
      setOrderedSlides(slides);
      orderRef.current = slides;
    }
    setDraggedId(null);
  }

  return (
    <section className="rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0033A0]/10 p-4">
        <div>
          <h1 className="text-2xl font-semibold">Slides</h1>
          <p className="mt-1 text-sm text-slate-500">Am Griff ziehen, um die Reihenfolge direkt zu ändern.</p>
          {orderMessage ? (
            <p className="mt-2 text-sm font-medium text-[#0033A0]" aria-live="polite">
              {orderMessage}
            </p>
          ) : null}
        </div>
        <Link href="/admin/slides/new">
          <Button>
            <Plus size={18} />
            Neue Slide
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-[#0033A0]/10">
        {orderedSlides.map((slide, index) => (
          <article
            key={slide.id}
            onDragOver={(event) => handleDragOver(event, slide.id)}
            onDrop={handleDrop}
            className={`grid gap-4 p-4 transition md:grid-cols-[auto_1fr_auto] md:items-center ${
              draggedId === slide.id ? "bg-[#EEF4FF] opacity-60" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400">
              <button
                type="button"
                draggable={busyId === null}
                onDragStart={(event) => handleDragStart(event, slide.id)}
                onDragEnd={handleDragEnd}
                className="grid h-10 w-10 cursor-grab place-items-center rounded-md text-slate-400 transition hover:bg-[#EEF4FF] hover:text-[#0033A0] active:cursor-grabbing"
                aria-label={`${slide.title || "Unbenannte Slide"} verschieben`}
                title="Zum Verschieben ziehen"
              >
                <GripVertical size={20} />
              </button>
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
              <Button type="button" variant="secondary" disabled={busyId !== null || index === 0} onClick={() => move(slide, -1)}>
                ↑
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busyId !== null || index === orderedSlides.length - 1}
                onClick={() => move(slide, 1)}
              >
                ↓
              </Button>
              <Button type="button" variant="secondary" disabled={busyId !== null} onClick={() => togglePublished(slide)}>
                {slide.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button type="button" variant="secondary" disabled={busyId !== null} onClick={() => duplicate(slide)}>
                <Copy size={16} />
              </Button>
              <Button type="button" variant="danger" disabled={busyId !== null} onClick={() => archive(slide.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </article>
        ))}
        {!orderedSlides.length ? <p className="p-8 text-center text-slate-500">Noch keine Slides vorhanden.</p> : null}
      </div>
    </section>
  );
}
