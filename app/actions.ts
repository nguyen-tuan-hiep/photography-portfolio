"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { Visibility } from "@/lib/types";

export type ActionState = {
  error?: string;
  success?: string;
  toastId?: string;
};

async function requireAdmin() {
  if (!isSupabaseConfigured())
    throw new Error("Configure Supabase before using admin features.");
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return createAdminClient();
}

export async function submitInquiry(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const countryCode = String(
    formData.get("whatsapp_country_code") || "",
  ).replace(/\D/g, "");
  const subscriberNumber = String(formData.get("whatsapp_number") || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  const startTime = String(formData.get("start_time") || "").trim();
  const endTime = String(formData.get("end_time") || "").trim();

  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(email))
    return { error: "Please enter a valid email." };
  if ((countryCode && !subscriberNumber) || (!countryCode && subscriberNumber))
    return {
      error: "Please enter both the WhatsApp country code and phone number.",
    };
  if (
    countryCode &&
    (countryCode.length > 4 ||
      subscriberNumber.length < 6 ||
      `${countryCode}${subscriberNumber}`.length > 15)
  )
    return {
      error: "Please enter a valid WhatsApp number including its country code.",
    };

  if ((startTime && !endTime) || (!startTime && endTime)) {
    return { error: "Please enter both start time and end time." };
  }

  if (startTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
    return { error: "Please enter a valid start time." };
  }

  if (endTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(endTime)) {
    return { error: "Please enter a valid end time." };
  }

  if (startTime && endTime && startTime >= endTime) {
    return { error: "End time must be later than start time." };
  }

  const whatsapp = countryCode ? `+${countryCode}${subscriberNumber}` : null;
  if (!isSupabaseConfigured())
    return { success: "Thanks — your inquiry has been received (demo mode)." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    whatsapp,
    shoot_type: formData.get("shoot_type") || null,
    preferred_date: formData.get("preferred_date") || null,
    start_time: startTime || null,
    end_time: endTime || null,
    message: formData.get("message") || null,
  });

  if (error) {
    console.error("Inquiry insert error:", error);
    return { error: "We couldn't send your inquiry. Please try again." };
  }

  return {
    success: "Thanks — your inquiry has been received. I'll be in touch soon.",
  };
}

export async function login(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured())
    return { error: "Configure Supabase environment variables to sign in." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveAlbum(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let redirectTo: string | null = null;
  try {
    const supabase = await requireAdmin();
    const id = String(formData.get("id") || "");
    const title = String(formData.get("title") || "").trim();
    const requestedSlug = slugify(String(formData.get("slug") || title));
    const visibility = String(
      formData.get("visibility") || "draft",
    ) as Visibility;
    if (title.length < 2 || !requestedSlug)
      return { error: "Title and slug are required." };
    if (!["public", "unlisted", "draft"].includes(visibility))
      return { error: "Invalid visibility." };
    const commonValues = {
      title,
      description: String(formData.get("description") || "") || null,
      category: String(formData.get("category") || "") || null,
      shoot_date: String(formData.get("shoot_date") || "") || null,
      visibility,
    };

    if (id) {
      const { error } = await supabase
        .from("albums")
        .update({ ...commonValues, slug: requestedSlug })
        .eq("id", id);
      if (error?.code === "23505")
        return {
          error:
            "This album URL is already in use. Please choose a different slug.",
        };
      if (error) return { error: error.message };
    } else {
      const { data: sameTitle, error: titleLookupError } = await supabase
        .from("albums")
        .select("id")
        .eq("title", title)
        .limit(1)
        .maybeSingle();
      if (titleLookupError) return { error: titleLookupError.message };
      let uniqueSlug = requestedSlug;
      let suffix = 2;
      while (true) {
        const { data: existing, error: lookupError } = await supabase
          .from("albums")
          .select("id")
          .eq("slug", uniqueSlug)
          .maybeSingle();
        if (lookupError) return { error: lookupError.message };
        if (!existing) break;
        uniqueSlug = `${requestedSlug}-${suffix++}`;
      }
      const { data, error } = await supabase
        .from("albums")
        .insert({ ...commonValues, slug: uniqueSlug })
        .select("id")
        .single();
      if (error?.code === "23505")
        return {
          error: "This album URL was just taken. Please submit the form again.",
        };
      if (error) return { error: error.message };
      const redirectParams = new URLSearchParams({ created: "1" });
      if (sameTitle) {
        redirectParams.set("duplicateName", "1");
        redirectParams.set("slug", uniqueSlug);
      }
      redirectTo = `/admin/albums/${data.id}/edit?${redirectParams.toString()}`;
    }
    revalidateTag("public-albums");
    revalidatePath("/");
    revalidatePath("/albums");
    revalidatePath("/admin");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unable to save album." };
  }
  if (redirectTo) redirect(redirectTo);
  return { success: "Album saved." };
}

export async function setVisibility(id: string, visibility: Visibility) {
  const supabase = await requireAdmin();
  await supabase.from("albums").update({ visibility }).eq("id", id);
  revalidateTag("public-albums");
  revalidatePath("/");
  revalidatePath("/albums");
  revalidatePath("/admin/albums");
}

export async function deleteAlbum(id: string) {
  const supabase = await requireAdmin();
  const { data: images } = await supabase
    .from("album_images")
    .select("public_id")
    .eq("album_id", id);
  configureCloudinary();
  if (process.env.CLOUDINARY_API_SECRET)
    await Promise.all(
      (images || []).map((image) =>
        cloudinary.uploader.destroy(image.public_id),
      ),
    );
  await supabase.from("albums").delete().eq("id", id);
  revalidateTag("public-albums");
  revalidatePath("/");
  revalidatePath("/albums");
  revalidatePath("/admin");
}

export async function setCover(albumId: string, imageId: string) {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("album_images")
    .select("image_url, public_id")
    .eq("id", imageId)
    .single();
  if (data)
    await supabase
      .from("albums")
      .update({
        cover_image_url: data.image_url,
        cover_image_public_id: data.public_id,
      })
      .eq("id", albumId);
  revalidateTag("public-albums");
  revalidatePath("/");
  revalidatePath("/albums");
}

export async function deleteImage(id: string, albumId: string) {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("album_images")
    .select("public_id")
    .eq("id", id)
    .single();
  if (data) {
    configureCloudinary();
    await cloudinary.uploader.destroy(data.public_id);
    await supabase.from("album_images").delete().eq("id", id);
  }
  revalidateTag("public-albums");
  revalidatePath(`/admin/albums/${albumId}/edit`);
}

export async function reorderAlbumImages(
  albumId: string,
  imageIds: string[],
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const uniqueIds = [...new Set(imageIds)];
    if (!albumId || uniqueIds.length !== imageIds.length)
      return { error: "Invalid image order." };
    if (!uniqueIds.length) return { success: "Image order saved." };

    const { data: albumImages, error: readError } = await supabase
      .from("album_images")
      .select("id")
      .eq("album_id", albumId);
    if (readError) return { error: readError.message };
    const existingIds = new Set((albumImages || []).map((image) => image.id));
    if (
      existingIds.size !== uniqueIds.length ||
      uniqueIds.some((id) => !existingIds.has(id))
    ) {
      return { error: "The image list changed. Refresh and try again." };
    }

    const results = await Promise.all(
      uniqueIds.map((id, display_order) =>
        supabase
          .from("album_images")
          .update({ display_order })
          .eq("id", id)
          .eq("album_id", albumId),
      ),
    );
    const updateError = results.find((result) => result.error)?.error;
    if (updateError) return { error: updateError.message };
    revalidateTag("public-albums");
    revalidatePath(`/admin/albums/${albumId}/edit`);
    revalidatePath("/albums/[slug]", "page");
    return { success: "Image order saved." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to save image order.",
    };
  }
}

export async function deleteInquiry(id: string): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: "Inquiry deleted." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to delete inquiry.",
    };
  }
}

export async function saveSiteSettings(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const required = [
      "hero_title",
      "hero_image_url",
      "featured_title",
      "about_title",
      "about_description",
      "about_image_url",
      "cta_title",
    ];
    for (const field of required) {
      if (!String(formData.get(field) || "").trim())
        return {
          error: "Please complete all required fields.",
          toastId: crypto.randomUUID(),
        };
    }

    const { data: previous } = await supabase
      .from("site_settings")
      .select("hero_image_public_id, about_image_public_id")
      .eq("id", true)
      .maybeSingle();
    const values = {
      id: true,
      hero_eyebrow: String(formData.get("hero_eyebrow") || "").trim(),
      hero_title: String(formData.get("hero_title") || "").trim(),
      hero_image_url: String(formData.get("hero_image_url") || "").trim(),
      hero_image_public_id:
        String(formData.get("hero_image_public_id") || "") || null,
      featured_eyebrow: String(formData.get("featured_eyebrow") || "").trim(),
      featured_title: String(formData.get("featured_title") || "").trim(),
      about_eyebrow: String(formData.get("about_eyebrow") || "").trim(),
      about_title: String(formData.get("about_title") || "").trim(),
      about_description: String(formData.get("about_description") || "").trim(),
      about_image_url: String(formData.get("about_image_url") || "").trim(),
      about_image_public_id:
        String(formData.get("about_image_public_id") || "") || null,
      cta_eyebrow: String(formData.get("cta_eyebrow") || "").trim(),
      cta_title: String(formData.get("cta_title") || "").trim(),
    };
    const { error } = await supabase.from("site_settings").upsert(values);
    if (error) return { error: error.message, toastId: crypto.randomUUID() };

    const replaced = [
      previous?.hero_image_public_id &&
      previous.hero_image_public_id !== values.hero_image_public_id
        ? previous.hero_image_public_id
        : null,
      previous?.about_image_public_id &&
      previous.about_image_public_id !== values.about_image_public_id
        ? previous.about_image_public_id
        : null,
    ].filter((id): id is string => Boolean(id));
    if (replaced.length) {
      configureCloudinary();
      await Promise.allSettled(
        replaced.map((id) => cloudinary.uploader.destroy(id)),
      );
    }
    revalidateTag("site-settings");
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { success: "Homepage saved.", toastId: crypto.randomUUID() };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to save homepage.",
      toastId: crypto.randomUUID(),
    };
  }
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
