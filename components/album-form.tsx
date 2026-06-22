"use client";
import { useActionState, useEffect, useState } from "react";
import { saveAlbum } from "@/app/actions";
import type { Album } from "@/lib/types";
import { slugify } from "@/lib/utils";
export function AlbumForm({ album }: { album?: Album }) {
  const [state, action, pending] = useActionState(saveAlbum, {});
  const [title, setTitle] = useState(album?.title || "");
  const [slug, setSlug] = useState(album?.slug || "");
  const [edited, setEdited] = useState(Boolean(album));
  useEffect(() => {
    if (!edited) setSlug(slugify(title));
  }, [title, edited]);
  return (
    <form action={action} className="space-y-7">
      <input type="hidden" name="id" value={album?.id || ""} />
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-wider sm:col-span-2">
          Title *
          <input
            className="field"
            name="title"
            required
            minLength={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Jones's Birthday"
          />
        </label>
        <label className="text-xs uppercase tracking-wider sm:col-span-2">
          Slug *
          <input
            className="field"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setEdited(true);
              setSlug(slugify(e.target.value));
            }}
          />
          <span className="mt-1 block text-[10px] normal-case tracking-normal text-neutral-400">
            Public URL: /albums/{slug || "your-album"}
          </span>
        </label>
        <label className="text-xs uppercase tracking-wider">
          Category
          <select
            className="field"
            name="category"
            defaultValue={album?.category || "Portrait"}
          >
            {[
              "Wedding",
              "Birthday",
              "Portrait",
              "Graduation",
              "Event",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-wider">
          Shoot date
          <input
            className="field"
            name="shoot_date"
            type="date"
            defaultValue={album?.shoot_date || ""}
          />
        </label>
        <label className="text-xs uppercase tracking-wider">
          Visibility
          <select
            className="field"
            name="visibility"
            defaultValue={album?.visibility || "draft"}
          >
            <option value="draft">Draft</option>
            <option value="unlisted">Unlisted</option>
            <option value="public">Public</option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-wider sm:col-span-2">
          Description
          <textarea
            className="field min-h-28"
            name="description"
            defaultValue={album?.description || ""}
            placeholder="A short introduction to this story..."
          />
        </label>
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-700">{state.success}</p>
      )}
      <button className="button-dark" disabled={pending}>
        {pending
          ? "Saving..."
          : album
            ? "Save changes"
            : "Create and add photos"}
      </button>
    </form>
  );
}
