"use client";

import type { MediaAsset } from "@/lib/slides/types";
import { Select } from "@/components/ui/Select";

type MediaPickerProps = {
  label: string;
  value: string | null;
  assets: MediaAsset[];
  onChange: (value: string | null) => void;
  filter?: "image" | "video" | "any";
};

export function MediaPicker({ label, value, assets, onChange, filter = "any" }: MediaPickerProps) {
  const filtered = filter === "any" ? assets : assets.filter((asset) => asset.file_type === filter || asset.file_type === "embed");

  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-2 block">
        <Select value={value || ""} onChange={(event) => onChange(event.target.value || null)}>
          <option value="">Kein Medium ausgewählt</option>
          {filtered.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.file_name} {asset.category ? `(${asset.category})` : ""}
            </option>
          ))}
        </Select>
      </span>
    </label>
  );
}
