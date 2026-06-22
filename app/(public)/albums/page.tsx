import { Navbar } from "@/components/navbar";
import { AlbumCard } from "@/components/album-card";
import { getPublicAlbums } from "@/lib/data";

export const metadata = { title: "Albums" };
export default async function AlbumsPage() { const albums = await getPublicAlbums(); return <main><div className="relative bg-ink pb-20 pt-24 text-white"><Navbar /><div className="container-page pt-20"><p className="eyebrow !text-white/50">The archive</p><h1 className="mt-3 font-serif text-7xl sm:text-9xl">Stories</h1><p className="mt-7 max-w-md text-sm leading-7 text-white/60">Weddings, milestones, and honest portraits of lives in motion.</p></div></div><section className="container-page py-20 sm:py-28">{albums.length ? <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">{albums.map((a, i) => <AlbumCard key={a.id} album={a} priority={i < 3} />)}</div> : <p className="py-24 text-center text-neutral-500">No albums yet.</p>}</section></main>; }
