insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'presentation-media',
  'presentation-media',
  true,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read presentation media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'presentation-media');

create policy "Admins and editors can upload presentation media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'presentation-media'
  and public.is_admin_or_editor()
);

create policy "Admins and editors can update presentation media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'presentation-media'
  and public.is_admin_or_editor()
)
with check (
  bucket_id = 'presentation-media'
  and public.is_admin_or_editor()
);

create policy "Admins and editors can delete presentation media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'presentation-media'
  and public.is_admin_or_editor()
);
