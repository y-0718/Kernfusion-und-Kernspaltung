create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'editor', 'viewer');
create type public.slide_status as enum ('draft', 'published', 'hidden', 'archived');
create type public.slide_type as enum (
  'title',
  'split_media_text',
  'full_image',
  'video',
  'comparison',
  'quote',
  'sources',
  'infographic'
);
create type public.transition_type as enum ('fade', 'zoom', 'parallax', 'slide', 'none');
create type public.source_type as enum ('website', 'book', 'video', 'paper', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table public.presentations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  slug text not null unique,
  theme jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  storage_path text,
  file_type text not null check (file_type in ('image', 'video', 'embed', 'document', 'other')),
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  duration numeric,
  alt_text text,
  caption text,
  category text,
  folder text,
  source_credit text,
  license text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.slides (
  id uuid primary key default gen_random_uuid(),
  presentation_id uuid not null references public.presentations(id) on delete cascade,
  title text not null default '',
  subtitle text,
  slug text not null,
  slide_type public.slide_type not null default 'title',
  content_json jsonb not null default '{}'::jsonb,
  design_json jsonb not null default '{}'::jsonb,
  animation_json jsonb not null default '{}'::jsonb,
  interactive_config jsonb not null default '{}'::jsonb,
  background_media_id uuid references public.media_assets(id) on delete set null,
  primary_media_id uuid references public.media_assets(id) on delete set null,
  status public.slide_status not null default 'draft',
  is_published boolean generated always as (status = 'published') stored,
  presenter_notes text,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (presentation_id, slug)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  slide_id uuid not null references public.slides(id) on delete cascade,
  source_type public.source_type not null default 'website',
  title text not null,
  author text,
  url text,
  publisher text,
  published_at date,
  accessed_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.presentation_settings (
  id uuid primary key default gen_random_uuid(),
  presentation_id uuid not null unique references public.presentations(id) on delete cascade,
  site_title text not null default 'Kernfusion und Kernspaltung',
  seo_description text not null default 'Interaktive Physik-Präsentation über Kernfusion und Kernspaltung.',
  og_image_media_id uuid references public.media_assets(id) on delete set null,
  default_transition public.transition_type not null default 'fade',
  enable_particles boolean not null default true,
  enable_offline_cache boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index slides_presentation_sort_idx on public.slides (presentation_id, sort_order);
create index slides_public_idx on public.slides (presentation_id, status, sort_order);
create index media_assets_type_idx on public.media_assets (file_type, category);
create index sources_slide_idx on public.sources (slide_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger presentations_updated_at
before update on public.presentations
for each row execute function public.set_updated_at();

create trigger media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create trigger slides_updated_at
before update on public.slides
for each row execute function public.set_updated_at();

create trigger sources_updated_at
before update on public.sources
for each row execute function public.set_updated_at();

create trigger presentation_settings_updated_at
before update on public.presentation_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace view public.public_slides as
select
  s.id,
  s.presentation_id,
  s.title,
  s.subtitle,
  s.slug,
  s.slide_type,
  s.content_json,
  s.design_json,
  s.animation_json,
  s.interactive_config,
  s.background_media_id,
  bg.file_url as background_url,
  bg.alt_text as background_alt,
  s.primary_media_id,
  pm.file_url as primary_media_url,
  pm.file_type as primary_media_type,
  pm.alt_text as primary_media_alt,
  pm.caption as primary_media_caption,
  s.sort_order,
  s.created_at,
  s.updated_at
from public.slides s
left join public.media_assets bg on bg.id = s.background_media_id
left join public.media_assets pm on pm.id = s.primary_media_id
where s.status = 'published';

create or replace view public.public_sources as
select
  src.id,
  src.slide_id,
  s.presentation_id,
  src.source_type,
  src.title,
  src.author,
  src.url,
  src.publisher,
  src.published_at,
  src.accessed_at,
  src.notes,
  s.sort_order as slide_sort_order
from public.sources src
join public.slides s on s.id = src.slide_id
where s.status = 'published';
