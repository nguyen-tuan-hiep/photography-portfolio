insert into public.albums (id, title, slug, description, category, shoot_date, visibility, cover_image_url)
values
  ('10000000-0000-0000-0000-000000000001', 'Nick & Jane', 'nick-jane-wedding', 'A warm celebration with the people who matter most.', 'Wedding', '2025-09-18', 'public', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85'),
  ('10000000-0000-0000-0000-000000000002', 'Jones''s Birthday', 'jones-birthday', 'An afternoon of color, friends, and easy joy.', 'Birthday', '2025-07-12', 'public', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1800&q=85'),
  ('10000000-0000-0000-0000-000000000003', 'The Class of 2025', 'graduation-shoot', 'A new chapter, photographed just as it began.', 'Graduation', '2025-05-24', 'public', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85');

insert into public.album_images (album_id, image_url, public_id, width, height, display_order)
select a.id, image.url, 'demo/' || a.slug || '-' || image.ord, 1200, case when image.ord % 2 = 0 then 1600 else 800 end, image.ord
from public.albums a
cross join (values
  (0, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85'),
  (1, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85'),
  (2, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1400&q=85'),
  (3, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85')
) as image(ord, url);
