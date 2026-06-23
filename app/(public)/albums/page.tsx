import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { AlbumCard } from "@/components/album-card";
import { getPublicAlbums, getSiteSettings } from "@/lib/data";

export const metadata = { title: "Albums" };
export default async function AlbumsPage() {
  const [albums, settings] = await Promise.all([
    getPublicAlbums(),
    getSiteSettings(),
  ]);
  return (
    <main>
      <section className="relative h-[60svh] bg-black text-white">
        <Image
          src={settings.hero_image_url}
          alt="Albums hero"
          fill
          priority
          className="object-cover object-[80%_center] opacity-75 sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <Navbar />
        <div className="container-page relative flex h-[60svh] flex-col justify-end pb-10 pt-28 sm:pb-16 sm:pt-32">
          <p className="eyebrow !text-white/70">The archive</p>
          <h1 className="mt-4 max-w-5xl font-serif text-[clamp(4rem,12vw,7rem)] leading-[0.85] tracking-[-0.04em]">
            Stories
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
            Weddings, milestones, and honest portraits of lives in motion.
          </p>
        </div>
      </section>
      <section className="container-page py-20 sm:py-28">
        {albums.length ? (
          <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {albums.map((a, i) => (
              <AlbumCard key={a.id} album={a} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-neutral-500">No albums yet.</p>
        )}
      </section>
    </main>
  );
}
