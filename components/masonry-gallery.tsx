"use client";

import Masonry from "@mui/lab/Masonry";
import Image from "next/image";
import { useState } from "react";
import type { AlbumImage } from "@/lib/types";
import { Lightbox } from "./lightbox";

function MasonryImage({
  image,
  index,
  title,
  onOpen,
}: {
  image: AlbumImage;
  index: number;
  title: string;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const width = image.width || 1200;
  const height = image.height || 1500;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full overflow-hidden bg-neutral-100 text-left"
      style={{ aspectRatio: `${width} / ${height}` }}
      aria-label={`Open ${title}, photograph ${index + 1}`}
    >
      <Image
        src={image.image_url}
        alt={`${title}, photograph ${index + 1}`}
        width={width}
        height={height}
        sizes="(max-width: 519px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1535px) 25vw, 20vw"
        onLoad={() => setLoaded(true)}
        className={`h-auto w-full transition duration-700 group-hover:opacity-90 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
}

export function MasonryGallery({
  images,
  title,
}: {
  images: AlbumImage[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="py-24 text-center text-sm text-neutral-500">
        No photographs have been added yet.
      </div>
    );
  }

  return (
    <>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing={{ xs: 3, sm: 4, md: 5, lg: 5 }}
        defaultColumns={1}
        defaultSpacing={0}
      >
        {images.map((image, index) => (
          <MasonryImage
            key={image.id}
            image={image}
            index={index}
            title={title}
            onOpen={() => setActive(index)}
          />
        ))}
      </Masonry>
      {active !== null && (
        <Lightbox
          images={images}
          active={active}
          onChange={setActive}
          onClose={() => setActive(null)}
          title={title}
        />
      )}
    </>
  );
}
