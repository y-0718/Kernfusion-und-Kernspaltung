"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PresentationSettings } from "@/lib/slides/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function SettingsForm({ settings }: { settings: PresentationSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  async function save() {
    const supabase = createClient();
    const { error } = await supabase
      .from("presentation_settings")
      .update({
        site_title: form.site_title,
        seo_description: form.seo_description,
        default_transition: form.default_transition,
        enable_particles: form.enable_particles,
        enable_offline_cache: form.enable_offline_cache
      })
      .eq("id", form.id);

    setMessage(error ? error.message : "Einstellungen gespeichert.");
    router.refresh();
  }

  return (
    <section className="max-w-3xl rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-semibold">Einstellungen</h1>
      <p className="mt-1 text-sm text-slate-500">Grundlegende SEO-, Animations- und Präsentationsoptionen.</p>
      <div className="mt-6 grid gap-4">
        <FieldWrapper label="Seitentitel">
          <Input value={form.site_title} onChange={(event) => setForm((current) => ({ ...current, site_title: event.target.value }))} />
        </FieldWrapper>
        <FieldWrapper label="SEO-Beschreibung">
          <Textarea
            value={form.seo_description}
            onChange={(event) => setForm((current) => ({ ...current, seo_description: event.target.value }))}
          />
        </FieldWrapper>
        <FieldWrapper label="Standard-Übergang">
          <Select
            value={form.default_transition}
            onChange={(event) => setForm((current) => ({ ...current, default_transition: event.target.value as PresentationSettings["default_transition"] }))}
          >
            <option value="fade">Fade</option>
            <option value="zoom">Zoom</option>
            <option value="parallax">Parallax</option>
            <option value="slide">Slide</option>
            <option value="none">Keine</option>
          </Select>
        </FieldWrapper>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.enable_particles}
            onChange={(event) => setForm((current) => ({ ...current, enable_particles: event.target.checked }))}
          />
          X-Partikel in der Präsentation aktivieren
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.enable_offline_cache}
            onChange={(event) => setForm((current) => ({ ...current, enable_offline_cache: event.target.checked }))}
          />
          Offline-Cache aktivieren
        </label>
      </div>
      {message ? <p className="mt-4 rounded-md bg-[#EEF4FF] px-3 py-2 text-sm text-[#0033A0]">{message}</p> : null}
      <Button type="button" className="mt-5" onClick={save}>
        <Save size={18} />
        Speichern
      </Button>
    </section>
  );
}
