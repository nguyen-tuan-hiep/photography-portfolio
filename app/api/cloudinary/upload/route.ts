import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

type CloudinaryImage = {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
};

export async function POST(request: Request) {
  try {
    const auth = await createClient();
    const {
      data: { user },
    } = await auth.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_CLOUD_NAME
    ) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const albumId = String(body.albumId || "");
    if (!albumId)
      return NextResponse.json({ error: "Album is required" }, { status: 400 });

    const db = createAdminClient();
    const { data: album } = await db
      .from("albums")
      .select("id")
      .eq("id", albumId)
      .maybeSingle();
    if (!album)
      return NextResponse.json({ error: "Album not found" }, { status: 404 });

    if (body.action === "sign") {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = `portfolio/${albumId}`;
      const signature = cloudinary.utils.api_sign_request(
        { folder, timestamp },
        process.env.CLOUDINARY_API_SECRET,
      );
      return NextResponse.json({
        timestamp,
        folder,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      });
    }

    if (body.action === "store") {
      const image = (body.image || {}) as CloudinaryImage;
      if (
        !image.secure_url ||
        !image.public_id ||
        !image.public_id.startsWith(`portfolio/${albumId}/`)
      ) {
        return NextResponse.json(
          { error: "Invalid Cloudinary response" },
          { status: 400 },
        );
      }
      const { count } = await db
        .from("album_images")
        .select("*", { count: "exact", head: true })
        .eq("album_id", albumId);
      const row = {
        album_id: albumId,
        image_url: image.secure_url,
        public_id: image.public_id,
        width: image.width || null,
        height: image.height || null,
        display_order: count || 0,
      };
      const { data, error } = await db
        .from("album_images")
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      if ((count || 0) === 0) {
        await db
          .from("albums")
          .update({
            cover_image_url: image.secure_url,
            cover_image_public_id: image.public_id,
          })
          .eq("id", albumId);
      }
      revalidateTag("public-albums");
      return NextResponse.json({ image: data });
    }

    return NextResponse.json(
      { error: "Invalid upload action" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
