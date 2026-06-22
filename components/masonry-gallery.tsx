"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumnCount(
        width >= 1536
          ? 5
          : width >= 1024
            ? 4
            : width >= 768
              ? 3
              : width >= 520
                ? 2
                : 1,
      );
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const columns = useMemo(() => {
    const result = Array.from(
      { length: columnCount },
      () => [] as { image: AlbumImage; index: number }[],
    );
    images.forEach((image, index) =>
      result[index % columnCount].push({ image, index }),
    );
    return result;
  }, [images, columnCount]);

  if (!images.length) {
    return (
      <div className="py-24 text-center text-sm text-neutral-500">
        No photographs have been added yet.
      </div>
    );
  }

  return (
    <>
      <div
        className="grid items-start gap-6 md:gap-8 lg:gap-10 2xl:gap-12"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="space-y-6 md:space-y-8 lg:space-y-10 2xl:space-y-12"
          >
            {column.map(({ image, index }) => (
              <MasonryImage
                key={image.id}
                image={image}
                index={index}
                title={title}
                onOpen={() => setActive(index)}
              />
            ))}
          </div>
        ))}
      </div>
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
