export type SlideType =
  | "title"
  | "split_media_text"
  | "full_image"
  | "video"
  | "comparison"
  | "quote"
  | "sources"
  | "infographic";

export type SlideStatus = "draft" | "published" | "hidden" | "archived";
export type TransitionType = "fade" | "zoom" | "parallax" | "slide" | "none";
export type SourceType = "website" | "book" | "video" | "paper" | "other";

export type JsonObject = Record<string, unknown>;

export type MediaAsset = {
  id: string;
  file_name: string;
  file_url: string;
  storage_path: string | null;
  file_type: "image" | "video" | "embed" | "document" | "other";
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  alt_text: string | null;
  caption: string | null;
  category: string | null;
  folder: string | null;
  source_credit: string | null;
  license: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SlideSource = {
  id: string;
  slide_id: string;
  source_type: SourceType;
  title: string;
  author: string | null;
  url: string | null;
  publisher: string | null;
  published_at: string | null;
  accessed_at: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AdminSlide = {
  id: string;
  presentation_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  slide_type: SlideType;
  content_json: JsonObject;
  design_json: JsonObject;
  animation_json: JsonObject;
  interactive_config: JsonObject;
  background_media_id: string | null;
  primary_media_id: string | null;
  status: SlideStatus;
  is_published: boolean;
  presenter_notes: string | null;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  media_assets?: MediaAsset | null;
  sources?: SlideSource[];
};

export type PublicSlide = {
  id: string;
  presentation_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  slide_type: SlideType;
  content_json: JsonObject;
  design_json: JsonObject;
  animation_json: JsonObject;
  interactive_config: JsonObject;
  background_media_id: string | null;
  background_url: string | null;
  background_alt: string | null;
  primary_media_id: string | null;
  primary_media_url: string | null;
  primary_media_type: string | null;
  primary_media_alt: string | null;
  primary_media_caption: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Presentation = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  theme: JsonObject;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PresentationSettings = {
  id: string;
  presentation_id: string;
  site_title: string;
  seo_description: string;
  og_image_media_id: string | null;
  default_transition: TransitionType;
  enable_particles: boolean;
  enable_offline_cache: boolean;
  updated_at: string;
};

export type SlideContent = {
  eyebrow?: string;
  chapterNumber?: string;
  body?: string;
  bullets?: string[];
  quote?: string;
  author?: string;
  caption?: string;
  videoEmbedUrl?: string;
  left?: { title?: string; items?: string[] };
  right?: { title?: string; items?: string[] };
  labels?: string[];
  visualization?: "atom_structure" | "fission" | "chain_reaction" | "fusion" | string;
};

export type SlideDesign = {
  variant?: "standard" | "chapter_divider";
  backgroundColor?: string;
  textAlignment?: "left" | "center" | "right";
  mediaPosition?: "left" | "right";
  accentColor?: string;
  overlay?: "light" | "dark" | "none";
  spaceHero?: boolean;
};

export const slideTypeLabels: Record<SlideType, string> = {
  title: "Titel-Slide",
  split_media_text: "Bild/Text",
  full_image: "Vollbildbild",
  video: "Video-Slide",
  comparison: "Vergleich",
  quote: "Zitat/Kernaussage",
  sources: "Quellen",
  infographic: "Infografik"
};

export const transitionLabels: Record<TransitionType, string> = {
  fade: "Weiches Einblenden",
  zoom: "Sanfter Zoom",
  parallax: "Parallax",
  slide: "Seitliches Gleiten",
  none: "Keine Animation"
};
