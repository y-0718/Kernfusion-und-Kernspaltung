import { z } from "zod";

export const slideFormSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich."),
  subtitle: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug ist erforderlich."),
  slide_type: z.enum(["title", "split_media_text", "full_image", "video", "comparison", "quote", "sources", "infographic"]),
  content_json: z.record(z.string(), z.unknown()),
  design_json: z.record(z.string(), z.unknown()),
  animation_json: z.record(z.string(), z.unknown()),
  interactive_config: z.record(z.string(), z.unknown()),
  background_media_id: z.string().uuid().optional().nullable(),
  primary_media_id: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "published", "hidden", "archived"]),
  presenter_notes: z.string().optional().nullable(),
  sort_order: z.number().int()
});
