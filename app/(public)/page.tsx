import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AlbumCard } from "@/components/album-card";
import { getPublicAlbums, getSiteSettings } from "@/lib/data";

export default async function Home() {
  const [albums, settings] = await Promise.all([
    getPublicAlbums(),
    getSiteSettings(),
  ]);
  return (
    <main>
      <section className="relative min-h-[70svh] bg-black text-white">
        <Image
          src={settings.hero_image_url}
          alt="Homepage hero"
          fill
          priority
          className="object-cover opacity-75"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <Navbar />

        <div className="container-page relative flex min-h-[70svh] flex-col justify-end pb-10 pt-28 sm:pb-16 sm:pt-32">
          <p className="eyebrow !text-white/70">{settings.hero_eyebrow}</p>

          <h1 className="mt-4 max-w-5xl font-serif text-[clamp(4rem,12vw,7rem)] leading-[0.85] tracking-[-0.04em]">
            {settings.hero_title}
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/albums"
              className="button-dark !bg-white !text-ink hover:!bg-white/80"
            >
              View albums
            </Link>

            <Link
              href="/book"
              className="button-light !border-white hover:!bg-white hover:!text-ink"
            >
              Book a shoot
            </Link>
          </div>

          <ArrowDown
            className="absolute bottom-16 right-8 hidden sm:block"
            size={20}
          />
        </div>
      </section>
      <section className="container-page py-24 sm:py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow">{settings.featured_eyebrow}</p>
            <h2 className="mt-3 font-serif text-5xl sm:text-7xl">
              {settings.featured_title}
            </h2>
          </div>
          <Link
            href="/albums"
            className="hidden items-center gap-2 text-xs uppercase tracking-widest sm:flex"
          >
            All albums <ArrowRight size={14} />
          </Link>
        </div>
        {albums.length ? (
          <div className="grid gap-x-5 gap-y-14 md:grid-cols-3">
            {albums.slice(0, 3).map((album, i) => (
              <AlbumCard key={album.id} album={album} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-neutral-500">No albums yet.</p>
        )}
      </section>
      <section id="about" className="bg-[#dedbd2] py-24 sm:py-36">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] max-w-xl">
            <Image
              src={settings.about_image_url}
              alt="Photographer portrait"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-xl lg:pl-12">
            <p className="eyebrow">{settings.about_eyebrow}</p>
            <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-7xl">
              {settings.about_title}
            </h2>
            <p className="mt-8 font-serif whitespace-pre-line text-lg leading-7 text-neutral-600">
              {settings.about_description}
            </p>
            <Link href="/book" className="button-light mt-9">
              Let’s work together
            </Link>
          </div>
        </div>
      </section>
      <section className="container-page py-28 text-center sm:py-40">
        <p className="eyebrow">{settings.cta_eyebrow}</p>
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-none sm:text-8xl">
          {settings.cta_title}
        </h2>
        <Link href="/book" className="button-dark mt-10">
          Book a shoot
        </Link>
      </section>
    </main>
  );
}
