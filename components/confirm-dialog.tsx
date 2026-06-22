"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onCancel();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, pending, onCancel]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-5"
      role="presentation"
      onMouseDown={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative w-full max-w-md bg-white p-7 shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 p-2 text-neutral-500 hover:text-ink disabled:opacity-40"
        >
          <X size={18} />
        </button>
        <div className="grid size-11 place-items-center rounded-full bg-red-50 text-red-700">
          <AlertTriangle size={21} />
        </div>
        <h2 id="confirm-title" className="mt-6 font-serif text-3xl">
          {title}
        </h2>
        <p
          id="confirm-description"
          className="mt-3 text-sm leading-6 text-neutral-600"
        >
          {description}
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="button-light min-h-11"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center bg-red-700 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-800 disabled:opacity-50"
          >
            {pending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
