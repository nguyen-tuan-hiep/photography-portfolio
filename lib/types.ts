export type Visibility = "public" | "unlisted" | "draft";

export interface AlbumImage {
  id: string;
  album_id: string;
  image_url: string;
  public_id: string;
  width: number | null;
  height: number | null;
  display_order: number;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  shoot_date: string | null;
  visibility: Visibility;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  created_at: string;
  album_images?: AlbumImage[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  shoot_type: string | null;
  preferred_date: string | null;
  start_time: string | null;
  end_time: string | null;
  message: string | null;
}

export interface SiteSettings {
  hero_eyebrow: string;
  hero_title: string;
  hero_image_url: string;
  hero_image_public_id: string | null;
  featured_eyebrow: string;
  featured_title: string;
  about_eyebrow: string;
  about_title: string;
  about_description: string;
  about_image_url: string;
  about_image_public_id: string | null;
  cta_eyebrow: string;
  cta_title: string;
}
