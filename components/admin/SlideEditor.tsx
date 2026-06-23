"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminSlide, MediaAsset, SlideContent, SlideDesign, SlideStatus, SlideType } from "@/lib/slides/types";
import { slideTypeLabels, transitionLabels, type TransitionType } from "@/lib/slides/types";
import { createClient } from "@/lib/supabase/client";
import { defaultAnimation, defaultContentForType, defaultDesign, slugify } from "@/lib/slides/defaults";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { LivePreview } from "@/components/admin/LivePreview";
import { SourceEditor } from "@/components/admin/SourceEditor";

type SlideEditorProps = {
  presentationId: string;
  slide?: AdminSlide;
  mediaAssets: MediaAsset[];
};

export function SlideEditor({ presentationId, slide, mediaAssets }: SlideEditorProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdminSlide>(
    slide || {
      id: "",
      presentation_id: presentationId,
      title: "",
      subtitle: "",
      slug: "",
      slide_type: "title",
      content_json: defaultContentForType("title"),
      design_json: defaultDesign(),
      animation_json: defaultAnimation(),
      interactive_config: {},
      background_media_id: null,
      primary_media_id: null,
      status: "draft",
      is_published: false,
      presenter_notes: "",
      sort_order: 999,
      created_by: null,
      updated_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sources: []
    }
  );

  const content = form.content_json as SlideContent;
  const design = form.design_json as SlideDesign;
  const sources = useMemo(() => form.sources || [], [form.sources]);

  function updateContent(partial: Partial<SlideContent>) {
    setForm((current) => ({ ...current, content_json: { ...current.content_json, ...partial } }));
  }

  function updateDesign(partial: Partial<SlideDesign>) {
    setForm((current) => ({ ...current, design_json: { ...current.design_json, ...partial } }));
  }

  function updateAnimation(transition: TransitionType) {
    setForm((current) => ({ ...current, animation_json: { ...current.animation_json, transition } }));
  }

  function updateInteractiveConfig(partial: Record<string, unknown>) {
    setForm((current) => ({ ...current, interactive_config: { ...current.interactive_config, ...partial } }));
  }

  function changeType(nextType: SlideType) {
    setForm((current) => ({
      ...current,
      slide_type: nextType,
      content_json: { ...defaultContentForType(nextType), ...current.content_json },
      design_json:
        nextType === "infographic"
          ? { ...current.design_json, variant: "standard" }
          : current.design_json
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const payload = {
      presentation_id: presentationId,
      title: form.title,
      subtitle: form.subtitle || null,
      slug: form.slug || slugify(form.title),
      slide_type: form.slide_type,
      content_json: form.content_json,
      design_json: form.design_json,
      animation_json: form.animation_json,
      interactive_config: form.interactive_config,
      background_media_id: form.background_media_id || null,
      primary_media_id: form.primary_media_id || null,
      status: form.status,
      presenter_notes: form.presenter_notes || null,
      sort_order: form.sort_order
    };

    const result = form.id
      ? await supabase.from("slides").update(payload).eq("id", form.id).select("id").single()
      : await supabase.from("slides").insert(payload).select("id").single();

    setSaving(false);

    if (result.error) {
      setMessage(`Speichern fehlgeschlagen: ${result.error.message}`);
      return;
    }

    setMessage("Gespeichert.");
    if (!form.id && result.data?.id) router.push(`/admin/slides/${result.data.id}`);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="grid gap-6">
        <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{form.id ? "Slide bearbeiten" : "Neue Slide"}</h1>
              <p className="mt-1 text-sm text-slate-500">Alle sichtbaren Inhalte werden in Supabase gespeichert.</p>
            </div>
            <Button type="button" onClick={save} disabled={saving}>
              <Save size={18} />
              {saving ? "Speichert ..." : "Speichern"}
            </Button>
          </div>
          {message ? <p className="mt-4 rounded-md bg-[#EEF4FF] px-3 py-2 text-sm text-[#0033A0]">{message}</p> : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FieldWrapper label="Titel">
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                    slug: current.slug || slugify(event.target.value)
                  }))
                }
              />
            </FieldWrapper>
            <FieldWrapper label="Untertitel">
              <Input value={form.subtitle || ""} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} />
            </FieldWrapper>
            <FieldWrapper label="URL-Slug">
              <Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} />
            </FieldWrapper>
            <FieldWrapper label="Status">
              <Select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as SlideStatus }))}>
                <option value="draft">Entwurf</option>
                <option value="published">Veröffentlicht</option>
                <option value="hidden">Ausgeblendet</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Layout-Typ">
              <Select value={form.slide_type} onChange={(event) => changeType(event.target.value as SlideType)}>
                {Object.entries(slideTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Übergangsanimation">
              <Select
                value={String(form.animation_json.transition || "fade")}
                onChange={(event) => updateAnimation(event.target.value as TransitionType)}
              >
                {Object.entries(transitionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>
        </section>

        <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Inhalt</h2>
          <div className="mt-4 grid gap-4">
            <FieldWrapper label="Eyebrow / kleine Zeile über dem Titel">
              <Input value={content.eyebrow || ""} onChange={(event) => updateContent({ eyebrow: event.target.value })} />
            </FieldWrapper>
            <FieldWrapper label="Haupttext">
              <Textarea value={content.body || ""} onChange={(event) => updateContent({ body: event.target.value })} />
            </FieldWrapper>
            {design.variant === "chapter_divider" ? (
              <FieldWrapper label="Kapitelnummer" hint="Zum Beispiel 01, 02 oder A.">
                <Input value={content.chapterNumber || ""} onChange={(event) => updateContent({ chapterNumber: event.target.value })} />
              </FieldWrapper>
            ) : null}
            <FieldWrapper label="Stichpunkte" hint="Ein Stichpunkt pro Zeile.">
              <Textarea
                value={(content.bullets || []).join("\n")}
                onChange={(event) => updateContent({ bullets: event.target.value.split("\n").filter(Boolean) })}
              />
            </FieldWrapper>
            {form.slide_type === "quote" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <FieldWrapper label="Zitat / Kernaussage">
                  <Textarea value={content.quote || ""} onChange={(event) => updateContent({ quote: event.target.value })} />
                </FieldWrapper>
                <FieldWrapper label="Autor / Einordnung">
                  <Input value={content.author || ""} onChange={(event) => updateContent({ author: event.target.value })} />
                </FieldWrapper>
              </div>
            ) : null}
            {form.slide_type === "comparison" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ComparisonFields side="left" content={content} updateContent={updateContent} />
                <ComparisonFields side="right" content={content} updateContent={updateContent} />
              </div>
            ) : null}
            {form.slide_type === "video" ? (
              <FieldWrapper label="YouTube-/Vimeo-Link oder Embed-URL">
                <Input value={content.videoEmbedUrl || ""} onChange={(event) => updateContent({ videoEmbedUrl: event.target.value })} />
              </FieldWrapper>
            ) : null}
            {form.slide_type === "infographic" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <FieldWrapper label="Interaktiver Folientyp">
                  <Select
                    value={String(form.interactive_config.type || content.visualization || "atom_structure")}
                    onChange={(event) => {
                      updateContent({ visualization: event.target.value });
                      updateInteractiveConfig({ type: event.target.value });
                    }}
                  >
                    <option value="atom_structure">Atomaufbau</option>
                    <option value="fission">Kernspaltungssimulation</option>
                    <option value="chain_reaction">Kettenreaktion</option>
                    <option value="fusion">Kernfusionssimulation</option>
                    <option value="timeline">Zeitstrahl</option>
                    <option value="quiz">Quiz</option>
                    <option value="comparison">Vergleichsvisualisierung</option>
                  </Select>
                </FieldWrapper>
                <FieldWrapper label="Interaktive Elemente" hint="Ein Zeitpunkt, eine Antwort oder eine Beschriftung pro Zeile.">
                  <Textarea
                    value={(content.labels || []).join("\n")}
                    onChange={(event) => updateContent({ labels: event.target.value.split("\n").filter(Boolean) })}
                  />
                </FieldWrapper>
                {String(form.interactive_config.type || content.visualization) === "quiz" ? (
                  <FieldWrapper label="Richtige Antwort" hint="1 steht für die erste Antwort, 2 für die zweite usw.">
                    <Input
                      type="number"
                      min="1"
                      value={Number(form.interactive_config.correctIndex ?? 0) + 1}
                      onChange={(event) => updateInteractiveConfig({ correctIndex: Math.max(0, Number(event.target.value) - 1) })}
                    />
                  </FieldWrapper>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Medien und Design</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FieldWrapper label="Foliendesign">
              <Select value={design.variant || "standard"} onChange={(event) => updateDesign({ variant: event.target.value as SlideDesign["variant"] })}>
                <option value="full_bleed_image">Vollbildgrafik (PowerPoint/Keynote)</option>
                <option value="standard">Standardlayout</option>
                <option value="chapter_divider">Kapiteltrenner</option>
              </Select>
            </FieldWrapper>
            {design.variant === "full_bleed_image" ? (
              <p className="self-end rounded-md bg-[#EEF4FF] px-3 py-2 text-sm leading-6 text-[#0033A0]">
                Die Grafik wird vollständig, unverzerrt und nahezu bildschirmfüllend dargestellt. Empfohlen: PNG oder WebP im Format 16:9.
              </p>
            ) : null}
            <MediaPicker label={design.variant === "full_bleed_image" ? "Foliengrafik" : "Hauptmedium"} value={form.primary_media_id} assets={mediaAssets} onChange={(value) => setForm((current) => ({ ...current, primary_media_id: value }))} />
            <MediaPicker label="Hintergrundmedium" value={form.background_media_id} assets={mediaAssets} onChange={(value) => setForm((current) => ({ ...current, background_media_id: value }))} filter="image" />
            <FieldWrapper label="Hintergrundfarbe">
              <Input type="color" value={design.backgroundColor || "#FFFFFF"} onChange={(event) => updateDesign({ backgroundColor: event.target.value })} />
            </FieldWrapper>
            <FieldWrapper label="Akzentfarbe">
              <Input type="color" value={design.accentColor || "#0033A0"} onChange={(event) => updateDesign({ accentColor: event.target.value })} />
            </FieldWrapper>
            <FieldWrapper label="Textausrichtung">
              <Select value={design.textAlignment || "left"} onChange={(event) => updateDesign({ textAlignment: event.target.value as SlideDesign["textAlignment"] })}>
                <option value="left">Links</option>
                <option value="center">Zentriert</option>
                <option value="right">Rechts</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Medienposition">
              <Select value={design.mediaPosition || "right"} onChange={(event) => updateDesign({ mediaPosition: event.target.value as SlideDesign["mediaPosition"] })}>
                <option value="left">Links</option>
                <option value="right">Rechts</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Bild-Overlay">
              <Select value={design.overlay || "none"} onChange={(event) => updateDesign({ overlay: event.target.value as SlideDesign["overlay"] })}>
                <option value="none">Kein Overlay</option>
                <option value="light">Hell</option>
                <option value="dark">Dunkel</option>
              </Select>
            </FieldWrapper>
          </div>
        </section>

        <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Präsentator-Notizen</h2>
          <p className="mt-1 text-sm text-slate-500">Diese Notizen sind nur im Admin-Bereich sichtbar.</p>
          <Textarea
            className="admin-field mt-4 min-h-36"
            value={form.presenter_notes || ""}
            onChange={(event) => setForm((current) => ({ ...current, presenter_notes: event.target.value }))}
          />
        </section>

        {form.id ? <SourceEditor slideId={form.id} sources={sources} /> : null}
      </div>

      <div className="grid content-start gap-6">
        <LivePreview slide={form} assets={mediaAssets} sources={sources} />
      </div>
    </div>
  );
}

function ComparisonFields({
  side,
  content,
  updateContent
}: {
  side: "left" | "right";
  content: SlideContent;
  updateContent: (partial: Partial<SlideContent>) => void;
}) {
  const current = content[side] || { title: "", items: [] };
  return (
    <div className="rounded-md border border-[#0033A0]/10 p-3">
      <FieldWrapper label={side === "left" ? "Linke Überschrift" : "Rechte Überschrift"}>
        <Input value={current.title || ""} onChange={(event) => updateContent({ [side]: { ...current, title: event.target.value } })} />
      </FieldWrapper>
      <div className="mt-3">
        <FieldWrapper label="Punkte" hint="Ein Punkt pro Zeile.">
          <Textarea
            value={(current.items || []).join("\n")}
            onChange={(event) => updateContent({ [side]: { ...current, items: event.target.value.split("\n").filter(Boolean) } })}
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
