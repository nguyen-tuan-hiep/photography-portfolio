import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { MasonryGallery } from "@/components/masonry-gallery";
import { getAlbumBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();
  const images = [...(album.album_images || [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  return (
    <main>
      <section className="relative min-h-[80vh] bg-black text-white">
        {album.cover_image_url && (
          <Image
            src={album.cover_image_url}
            alt={album.title}
            fill
            priority
            className="object-cover opacity-65"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <Navbar />
        <div className="container-page relative flex min-h-[80vh] flex-col justify-end pb-16">
          <p className="eyebrow !text-white/60">
            {album.category} · {formatDate(album.shoot_date)}
          </p>
          <h1 className="mt-3 max-w-5xl font-serif text-6xl leading-[.85] sm:text-9xl">
            {album.title}
          </h1>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <p className="mx-auto mb-20 max-w-2xl text-center font-serif text-2xl leading-relaxed text-neutral-600 sm:text-3xl lg:mb-28">
            {album.description}
          </p>
          <MasonryGallery images={images} title={album.title} />
        </div>
      </section>
      <section className="bg-[#dedbd2] py-24 text-center">
        <p className="eyebrow">Inspired?</p>
        <h2 className="mt-4 font-serif text-5xl">Book a similar shoot</h2>
        <Link
          href={`/book?type=${encodeURIComponent(album.category || "Portrait")}`}
          className="button-dark mt-8"
        >
          Start an inquiry
        </Link>
      </section>
    </main>
  );
}
