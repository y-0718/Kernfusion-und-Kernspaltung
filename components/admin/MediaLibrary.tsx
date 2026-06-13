"use client";

import { Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaAsset } from "@/lib/slides/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type MediaLibraryProps = {
  assets: MediaAsset[];
};

export function MediaLibrary({ assets }: MediaLibraryProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Allgemein");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) return;
    setUploading(true);
    setMessage("");
    const supabase = createClient();
    const folder = file.type.startsWith("video/") ? "videos" : file.type.startsWith("image/") ? "images" : "documents";
    const storagePath = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const uploadResult = await supabase.storage.from("presentation-media").upload(storagePath, file, { upsert: false });

    if (uploadResult.error) {
      setMessage(uploadResult.error.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("presentation-media").getPublicUrl(storagePath);
    const fileType = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "document";

    const insertResult = await supabase.from("media_assets").insert({
      file_name: file.name,
      file_url: publicUrl.publicUrl,
      storage_path: storagePath,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
      alt_text: altText || null,
      caption: caption || null,
      category,
      folder
    });

    setUploading(false);
    if (insertResult.error) {
      setMessage(insertResult.error.message);
      return;
    }

    setFile(null);
    setAltText("");
    setCaption("");
    setMessage("Medium hochgeladen.");
    router.refresh();
  }

  async function addEmbed() {
    const url = prompt("YouTube-, Vimeo- oder externe Video-URL einfügen:");
    if (!url) return;
    const name = prompt("Name für dieses Video:", "Externes Video") || "Externes Video";
    const supabase = createClient();
    await supabase.from("media_assets").insert({
      file_name: name,
      file_url: url,
      file_type: "embed",
      category: "Video",
      alt_text: name
    });
    router.refresh();
  }

  async function deleteAsset(asset: MediaAsset) {
    if (!confirm("Medium wirklich löschen? Prüfe vorher, ob es noch in Slides verwendet wird.")) return;
    const supabase = createClient();
    if (asset.storage_path) {
      await supabase.storage.from("presentation-media").remove([asset.storage_path]);
    }
    await supabase.from("media_assets").delete().eq("id", asset.id);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Medienbibliothek</h1>
        <p className="mt-1 text-sm text-slate-500">Bilder, Videos und Einbettungen können hier zentral verwaltet und wiederverwendet werden.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FieldWrapper label="Datei">
            <Input type="file" accept="image/*,video/*,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </FieldWrapper>
          <FieldWrapper label="Kategorie">
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Allgemein</option>
              <option>Sonne</option>
              <option>Kernspaltung</option>
              <option>Kernfusion</option>
              <option>Forschung</option>
              <option>Hintergrund</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Alt-Text" hint="Beschreibt das Bild für Barrierefreiheit und SEO.">
            <Input value={altText} onChange={(event) => setAltText(event.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Bildunterschrift">
            <Input value={caption} onChange={(event) => setCaption(event.target.value)} />
          </FieldWrapper>
        </div>
        {message ? <p className="mt-4 rounded-md bg-[#EEF4FF] px-3 py-2 text-sm text-[#0033A0]">{message}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={upload} disabled={!file || uploading}>
            <Upload size={18} />
            {uploading ? "Upload läuft ..." : "Datei hochladen"}
          </Button>
          <Button type="button" variant="secondary" onClick={addEmbed}>
            Externes Video hinzufügen
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.id} className="overflow-hidden rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
            <div className="grid aspect-video place-items-center bg-[#EEF4FF]">
              {asset.file_type === "image" ? (
                <img src={asset.file_url} alt={asset.alt_text || ""} className="h-full w-full object-cover" />
              ) : asset.file_type === "video" ? (
                <video src={asset.file_url} className="h-full w-full object-cover" controls />
              ) : (
                <p className="px-4 text-center text-sm font-semibold text-[#0033A0]">{asset.file_type}</p>
              )}
            </div>
            <div className="p-4">
              <h2 className="truncate font-semibold">{asset.file_name}</h2>
              <p className="mt-1 text-sm text-slate-500">{asset.category || "Ohne Kategorie"}</p>
              {asset.caption ? <p className="mt-2 text-sm text-slate-600">{asset.caption}</p> : null}
              <Button type="button" variant="danger" className="mt-4" onClick={() => deleteAsset(asset)}>
                <Trash2 size={16} />
                Löschen
              </Button>
            </div>
          </article>
        ))}
        {!assets.length ? <p className="rounded-md border border-dashed border-[#0033A0]/20 bg-white p-8 text-center text-slate-500">Noch keine Medien vorhanden.</p> : null}
      </section>
    </div>
  );
}
