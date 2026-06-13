"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SlideSource, SourceType } from "@/lib/slides/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type SourceEditorProps = {
  slideId: string;
  sources: SlideSource[];
};

export function SourceEditor({ slideId, sources }: SourceEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [busy, setBusy] = useState(false);

  async function addSource() {
    if (!title.trim()) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("sources").insert({
      slide_id: slideId,
      source_type: sourceType,
      title,
      url: url || null,
      author: author || null,
      publisher: publisher || null,
      accessed_at: new Date().toISOString().slice(0, 10)
    });
    setTitle("");
    setUrl("");
    setAuthor("");
    setPublisher("");
    setBusy(false);
    router.refresh();
  }

  async function deleteSource(id: string) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("sources").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Quellen dieser Slide</h2>
      <div className="mt-4 grid gap-3">
        {sources.map((source) => (
          <article key={source.id} className="flex items-start justify-between gap-3 rounded-md border border-[#0033A0]/10 p-3">
            <div>
              <p className="font-semibold">{source.title}</p>
              <p className="text-sm text-slate-500">{[source.author, source.publisher, source.url].filter(Boolean).join(" · ")}</p>
            </div>
            <Button type="button" variant="danger" onClick={() => deleteSource(source.id)} disabled={busy}>
              <Trash2 size={16} />
            </Button>
          </article>
        ))}
        {!sources.length ? <p className="text-sm text-slate-500">Noch keine Quellen für diese Slide.</p> : null}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <FieldWrapper label="Quellentyp">
          <Select value={sourceType} onChange={(event) => setSourceType(event.target.value as SourceType)}>
            <option value="website">Webseite</option>
            <option value="book">Buch</option>
            <option value="video">Video</option>
            <option value="paper">Wissenschaftliche Veröffentlichung</option>
            <option value="other">Sonstiges</option>
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Titel">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Autor">
          <Input value={author} onChange={(event) => setAuthor(event.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Verlag/Website">
          <Input value={publisher} onChange={(event) => setPublisher(event.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="URL">
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
        </FieldWrapper>
      </div>
      <Button type="button" className="mt-4" onClick={addSource} disabled={busy}>
        <Plus size={16} />
        Quelle hinzufügen
      </Button>
    </section>
  );
}
