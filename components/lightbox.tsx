"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import type { AlbumImage } from "@/lib/types";

export function Lightbox({
  images,
  active,
  onChange,
  onClose,
  title,
}: {
  images: AlbumImage[];
  active: number;
  onChange: (i: number) => void;
  onClose: () => void;
  title: string;
}) {
  const previous = () => onChange((active - 1 + images.length) % images.length);
  const next = () => onChange((active + 1) % images.length);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") previous();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 text-white"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 p-3"
        aria-label="Close"
      >
        <X />
      </button>
      <button
        onClick={previous}
        className="absolute left-2 z-10 p-4 sm:left-6"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      <div className="relative h-[88vh] w-[88vw]">
        <Image
          src={images[active].image_url}
          alt={`${title}, photograph ${active + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </div>
      <button
        onClick={next}
        className="absolute right-2 z-10 p-4 sm:right-6"
        aria-label="Next"
      >
        <ChevronRight />
      </button>
      <p className="absolute bottom-4 text-[10px] tracking-widest text-white/60">
        {active + 1} / {images.length}
      </p>
    </div>
  );
}
