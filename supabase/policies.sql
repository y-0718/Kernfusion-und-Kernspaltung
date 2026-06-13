alter table public.profiles enable row level security;
alter table public.presentations enable row level security;
alter table public.media_assets enable row level security;
alter table public.slides enable row level security;
alter table public.sources enable row level security;
alter table public.presentation_settings enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'viewer'::public.user_role);
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'editor');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read active presentations"
on public.presentations for select
to anon, authenticated
using (is_active = true);

create policy "Admins and editors can manage presentations"
on public.presentations for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy "Public can read media"
on public.media_assets for select
to anon, authenticated
using (true);

create policy "Admins and editors can manage media"
on public.media_assets for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy "Public can read published slides"
on public.slides for select
to anon, authenticated
using (status = 'published');

create policy "Admins and editors can manage slides"
on public.slides for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy "Public can read published slide sources"
on public.sources for select
to anon, authenticated
using (
  exists (
    select 1 from public.slides s
    where s.id = sources.slide_id and s.status = 'published'
  )
);

create policy "Admins and editors can manage sources"
on public.sources for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy "Public can read presentation settings"
on public.presentation_settings for select
to anon, authenticated
using (true);

create policy "Admins can manage presentation settings"
on public.presentation_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read audit log"
on public.audit_log for select
to authenticated
using (public.is_admin());

create policy "Admins and editors can write audit log"
on public.audit_log for insert
to authenticated
with check (public.is_admin_or_editor());
