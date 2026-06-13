import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PRESENTATION_SLUG } from "@/lib/slides/defaults";
import type { AdminSlide, MediaAsset, Presentation, PresentationSettings, PublicSlide, SlideSource } from "@/lib/slides/types";

export async function getActivePresentation() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("presentations")
    .select("*")
    .eq("slug", DEFAULT_PRESENTATION_SLUG)
    .eq("is_active", true)
    .single<Presentation>();

  if (error) {
    return null;
  }

  return data;
}

export async function getPresentationSettings(presentationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("presentation_settings")
    .select("*")
    .eq("presentation_id", presentationId)
    .single<PresentationSettings>();

  return data;
}

export async function getPublicSlides(presentationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_slides")
    .select("*")
    .eq("presentation_id", presentationId)
    .order("sort_order", { ascending: true })
    .returns<PublicSlide[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPublicSources(presentationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_sources")
    .select("*")
    .eq("presentation_id", presentationId)
    .order("slide_sort_order", { ascending: true })
    .returns<(SlideSource & { presentation_id: string; slide_sort_order: number })[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAdminSlides(presentationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slides")
    .select("*")
    .eq("presentation_id", presentationId)
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .returns<AdminSlide[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAdminSlide(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slides")
    .select("*, sources(*)")
    .eq("id", id)
    .single<AdminSlide>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMediaAssets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MediaAsset[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllSources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<SlideSource[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
