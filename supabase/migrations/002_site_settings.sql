create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  hero_eyebrow text not null default 'Singapore · Available worldwide',
  hero_title text not null default 'Stories, honestly told.',
  hero_image_url text not null,
  hero_image_public_id text,
  featured_eyebrow text not null default 'Selected stories',
  featured_title text not null default 'Recent work',
  about_eyebrow text not null default 'Behind the camera',
  about_title text not null default 'The beauty is already there.',
  about_description text not null,
  about_image_url text not null,
  about_image_public_id text,
  cta_eyebrow text not null default 'Your story, next',
  cta_title text not null default 'Let''s make something timeless.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  id, hero_image_url, about_description, about_image_url
) values (
  true,
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=90',
  'I’m Tuan Hiep, a documentary photographer drawn to real connection and the small moments between the planned ones. My approach is calm, unobtrusive, and always guided by what feels true to you.',
  'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=1200&q=85'
) on conflict (id) do nothing;

create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
create policy "Site settings are publicly readable" on public.site_settings for select to anon using (true);
create policy "Authenticated admins manage site settings" on public.site_settings for all to authenticated using (true) with check (true);
grant select on public.site_settings to anon;
grant all on public.site_settings to authenticated;
