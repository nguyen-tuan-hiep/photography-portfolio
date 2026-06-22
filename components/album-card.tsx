import Image from "next/image";
import Link from "next/link";
import type { Album } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function AlbumCard({ album, priority = false }: { album: Album; priority?: boolean }) {
  return <Link href={`/albums/${album.slug}`} className="group block">
    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
      {album.cover_image_url ? <Image src={album.cover_image_url} alt={album.title} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-xs uppercase tracking-widest text-neutral-400">No cover</div>}
      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
    </div>
    <div className="flex items-start justify-between gap-4 pt-4"><div><p className="eyebrow">{album.category || "Collection"}</p><h3 className="mt-1 font-serif text-3xl leading-none">{album.title}</h3></div><p className="pt-1 text-[10px] uppercase tracking-wider text-neutral-500">{formatDate(album.shoot_date)}</p></div>
  </Link>;
}
