import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { demoAlbums } from "./demo-data";
import { createClient, isSupabaseConfigured } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import type { Album, Inquiry, SiteSettings } from "./types";

export const defaultSiteSettings: SiteSettings = {
  hero_eyebrow: "Singapore · Available worldwide",
  hero_title: "Stories, honestly told.",
  hero_image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=90",
  hero_image_public_id: null,
  featured_eyebrow: "Selected stories",
  featured_title: "Recent work",
  about_eyebrow: "Behind the camera",
  about_title: "The beauty is already there.",
  about_description: "I’m Tuan Hiep, a documentary photographer drawn to real connection and the small moments between the planned ones. My approach is calm, unobtrusive, and always guided by what feels true to you.",
  about_image_url: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=1200&q=85",
  about_image_public_id: null,
  cta_eyebrow: "Your story, next",
  cta_title: "Let’s make something timeless.",
};

const loadSiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  if (error || !data) return defaultSiteSettings;
  return { ...defaultSiteSettings, ...data } as SiteSettings;
}, ["site-settings"], { revalidate: 60, tags: ["site-settings"] });

const loadPublicAlbums = unstable_cache(async (): Promise<Album[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("albums").select("*, album_images(*)").eq("visibility", "public").order("shoot_date", { ascending: false });
  if (error) throw error;
  return data as Album[];
}, ["public-albums"], { revalidate: 60, tags: ["public-albums"] });

const loadAlbumBySlug = unstable_cache(async (slug: string): Promise<Album | null> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("albums").select("*, album_images(*)").eq("slug", slug).in("visibility", ["public", "unlisted"]).order("display_order", { referencedTable: "album_images" }).maybeSingle();
  if (error) throw error;
  return data as Album | null;
}, ["album-by-slug"], { revalidate: 60, tags: ["public-albums"] });

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return defaultSiteSettings;
  await cookies();
  return loadSiteSettings();
}

export async function getPublicAlbums(): Promise<Album[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return demoAlbums;
  await cookies();
  return loadPublicAlbums();
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return demoAlbums.find((album) => album.slug === slug) ?? null;
  await cookies();
  return loadAlbumBySlug(slug);
}

export async function getAdminData() {
  if (!isSupabaseConfigured()) return { albums: demoAlbums, inquiries: [] as Inquiry[] };
  const supabase = await createClient();
  const [{ data: albums, error: albumError }, { data: inquiries, error: inquiryError }] = await Promise.all([
    supabase.from("albums").select("*, album_images(*)").order("created_at", { ascending: false }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(8),
  ]);
  if (albumError || inquiryError) throw albumError ?? inquiryError;
  return { albums: albums as Album[], inquiries: inquiries as Inquiry[] };
}
