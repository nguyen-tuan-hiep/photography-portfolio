"use client";

import { useState, useTransition } from "react";
import { deleteAlbum, setVisibility } from "@/app/actions";
import type { Album } from "@/lib/types";
import { ConfirmDialog } from "./confirm-dialog";
import { Toast } from "./toast";

export function AdminAlbumActions({ album }: { album: Album }) {
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    key: number;
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/albums/${album.slug}`,
      );
      setNotice({
        key: Date.now(),
        message: "Album link copied to clipboard.",
        variant: "success",
      });
    } catch {
      setNotice({
        key: Date.now(),
        message:
          "Could not copy the link. Please copy it from the public album page.",
        variant: "error",
      });
    }
  };

  const removeAlbum = () =>
    start(async () => {
      try {
        setError("");
        await deleteAlbum(album.id);
        setConfirmDelete(false);
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete album.",
        );
      }
    });

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <button
        disabled={pending}
        onClick={() =>
          start(() =>
            setVisibility(
              album.id,
              album.visibility === "public" ? "draft" : "public",
            ),
          )
        }
        className="border px-3 py-2 hover:bg-neutral-100"
      >
        {album.visibility === "public" ? "Unpublish" : "Publish"}
      </button>
      {album.visibility !== "draft" && (
        <button
          onClick={copy}
          className="border px-3 py-2 hover:bg-neutral-100"
        >
          Copy link
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => setConfirmDelete(true)}
        className="border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
      {error && <p className="w-full text-red-700">{error}</p>}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this album?"
        description={`“${album.title}” and all of its photographs will be permanently deleted from Supabase and Cloudinary. This action cannot be undone.`}
        confirmLabel="Delete album"
        pending={pending}
        onConfirm={removeAlbum}
        onCancel={() => setConfirmDelete(false)}
      />
      {notice && (
        <Toast
          key={notice.key}
          message={notice.message}
          variant={notice.variant}
        />
      )}
    </div>
  );
}
