import Link from "next/link";
import { AlbumForm } from "@/components/album-form";
export default function NewAlbum() { return <main className="p-5 sm:p-8 lg:p-12"><Link href="/admin/albums" className="text-xs underline">← Back to albums</Link><p className="eyebrow mt-10">New collection</p><h1 className="mt-2 font-serif text-5xl">Create album</h1><div className="mt-10 max-w-2xl border border-neutral-200 bg-white p-6 sm:p-10"><AlbumForm/></div></main>; }
