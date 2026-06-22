"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { GripVertical, ImagePlus, Star, Trash2 } from "lucide-react";
import { deleteImage, reorderAlbumImages, setCover } from "@/app/actions";
import type { Album, AlbumImage } from "@/lib/types";
import { optimizeForCloudinary } from "@/lib/client-image";
import { ConfirmDialog } from "./confirm-dialog";

const MAX_FILES = 30;

export function ImageUploader({ album }: { album: Album }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState(() =>
    [...(album.album_images || [])].sort(
      (a, b) => a.display_order - b.display_order,
    ),
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlbumImage | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    setImages(
      [...(album.album_images || [])].sort(
        (a, b) => a.display_order - b.display_order,
      ),
    );
  }, [album.album_images]);

  const dropImage = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }
    const previous = images;
    const next = [...images];
    const sourceIndex = next.findIndex((image) => image.id === draggedId);
    const targetIndex = next.findIndex((image) => image.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setImages(next);
    setDraggedId(null);
    setDropTargetId(null);
    setError("");
    start(async () => {
      const result = await reorderAlbumImages(
        album.id,
        next.map((image) => image.id),
      );
      if (result.error) {
        setImages(previous);
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const upload = async (selected: FileList | null) => {
    if (!selected?.length) return;
    const files = Array.from(selected);
    if (files.length > MAX_FILES) {
      setError(`Please upload no more than ${MAX_FILES} images at a time.`);
      return;
    }

    setUploading(true);
    setError("");
    try {
      const signatureResponse = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", albumId: album.id }),
      });
      const signature = await signatureResponse.json();
      if (!signatureResponse.ok)
        throw new Error(signature.error || "Could not authorize upload.");

      for (let index = 0; index < files.length; index++) {
        setProgress(`Preparing photo ${index + 1} of ${files.length}...`);
        const file = await optimizeForCloudinary(files[index]);
        const body = new FormData();
        body.append("file", file);
        body.append("api_key", signature.apiKey);
        body.append("timestamp", String(signature.timestamp));
        body.append("folder", signature.folder);
        body.append("signature", signature.signature);

        setProgress(`Uploading photo ${index + 1} of ${files.length}...`);
        const cloudResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          { method: "POST", body },
        );
        const cloudImage = await cloudResponse.json();
        if (!cloudResponse.ok)
          throw new Error(
            cloudImage.error?.message || "Cloudinary upload failed.",
          );

        const saveResponse = await fetch("/api/cloudinary/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "store",
            albumId: album.id,
            image: cloudImage,
          }),
        });
        const saved = await saveResponse.json();
        if (!saveResponse.ok)
          throw new Error(saved.error || "Could not save image information.");
      }

      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      setProgress("");
      if (input.current) input.current.value = "";
    }
  };

  const removeImage = () => {
    if (!deleteTarget) return;
    const image = deleteTarget;
    start(async () => {
      try {
        setError("");
        await deleteImage(image.id, album.id);
        setImages((current) => current.filter((item) => item.id !== image.id));
        setDeleteTarget(null);
        router.refresh();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete photograph.",
        );
      }
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl">Photographs</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Drag photos by the handle to reorder them. Changes save
            automatically.
          </p>
        </div>
        <>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => upload(event.target.files)}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={uploading}
            className="button-light"
          >
            <ImagePlus size={16} className="mr-2" />
            {uploading ? progress || "Uploading..." : "Upload photos"}
          </button>
        </>
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {images.map((image: AlbumImage) => (
          <div
            key={image.id}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={() => setDropTargetId(image.id)}
            onDrop={(event) => {
              event.preventDefault();
              dropImage(image.id);
            }}
            className={`group relative aspect-square overflow-hidden bg-neutral-100 transition ${draggedId === image.id ? "opacity-40" : "opacity-100"} ${dropTargetId === image.id && draggedId !== image.id ? "ring-2 ring-ink ring-offset-2" : ""}`}
          >
            <Image
              src={image.image_url}
              alt=""
              fill
              sizes="250px"
              className="object-cover"
            />
            <button
              type="button"
              draggable={!pending && !uploading}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", image.id);
                setDraggedId(image.id);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDropTargetId(null);
              }}
              title="Drag to reorder"
              aria-label="Drag to reorder image"
              className="absolute left-2 top-2 z-10 cursor-grab bg-white/95 p-2 text-ink shadow-sm active:cursor-grabbing"
            >
              <GripVertical size={17} />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/70 p-2 pt-8 opacity-0 transition group-hover:opacity-100">
              <button
                title="Set as cover"
                disabled={pending}
                onClick={() => start(() => setCover(album.id, image.id))}
                className="bg-white p-2 text-ink"
              >
                <Star
                  size={15}
                  fill={
                    album.cover_image_public_id === image.public_id
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
              <button
                title="Delete"
                disabled={pending}
                onClick={() => setDeleteTarget(image)}
                className="bg-white p-2 text-red-700"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {pending && (
        <p className="mt-3 text-xs text-neutral-500">Saving image order...</p>
      )}
      {!images.length && (
        <button
          onClick={() => input.current?.click()}
          className="mt-6 grid min-h-52 w-full place-items-center border border-dashed border-neutral-300 text-sm text-neutral-500 hover:bg-neutral-50"
        >
          Upload your first photographs
        </button>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this photograph?"
        description="This photograph will be permanently removed from the album and Cloudinary. This action cannot be undone."
        confirmLabel="Delete photo"
        pending={pending}
        onConfirm={removeImage}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
