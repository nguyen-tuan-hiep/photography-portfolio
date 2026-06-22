create extension if not exists "pgcrypto";

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  category text,
  shoot_date date,
  visibility text not null default 'draft' check (visibility in ('public', 'unlisted', 'draft')),
  cover_image_url text,
  cover_image_public_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  image_url text not null,
  public_id text not null,
  width integer,
  height integer,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  shoot_type text,
  preferred_date date,
  message text,
  created_at timestamptz not null default now()
);

create index albums_visibility_idx on public.albums (visibility);
create index album_images_album_order_idx on public.album_images (album_id, display_order);
create index inquiries_created_at_idx on public.inquiries (created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger albums_updated_at before update on public.albums for each row execute function public.set_updated_at();

alter table public.albums enable row level security;
alter table public.album_images enable row level security;
alter table public.inquiries enable row level security;

-- Unlisted albums intentionally have no anon SELECT policy. The server-only slug
-- route uses the service role after receiving the exact URL.
create policy "Public albums are readable" on public.albums for select to anon using (visibility = 'public');
create policy "Images from public albums are readable" on public.album_images for select to anon using (
  exists (select 1 from public.albums where albums.id = album_images.album_id and albums.visibility = 'public')
);

create policy "Authenticated admins manage albums" on public.albums for all to authenticated using (true) with check (true);
create policy "Authenticated admins manage images" on public.album_images for all to authenticated using (true) with check (true);
create policy "Authenticated admins read inquiries" on public.inquiries for select to authenticated using (true);

-- Inquiry inserts and unlisted lookups go through server code using the service role.
revoke all on public.albums, public.album_images, public.inquiries from anon;
grant select on public.albums, public.album_images to anon;
grant all on public.albums, public.album_images to authenticated;
grant select on public.inquiries to authenticated;
