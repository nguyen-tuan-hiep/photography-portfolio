import type { Album } from "./types";

const urls = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=85",
];

function album(id: string, title: string, slug: string, category: string, date: string, cover: string): Album {
  return {
    id, title, slug, category, shoot_date: date, visibility: "public",
    description: "An honest collection of quiet gestures, joyful moments, and everything worth remembering.",
    cover_image_url: cover, cover_image_public_id: null, created_at: date,
    album_images: urls.map((image_url, index) => ({ id: `${id}-${index}`, album_id: id, image_url, public_id: `demo-${index}`, width: index % 2 ? 1200 : 1600, height: index % 2 ? 1600 : 1067, display_order: index })),
  };
}

export const demoAlbums = [
  album("demo-wedding", "Nick & Jane", "nick-jane-wedding", "Wedding", "2025-09-18", urls[0]),
  album("demo-birthday", "Jones's Birthday", "jones-birthday", "Birthday", "2025-07-12", urls[3]),
  album("demo-graduation", "The Class of 2025", "graduation-shoot", "Graduation", "2025-05-24", urls[4]),
];
