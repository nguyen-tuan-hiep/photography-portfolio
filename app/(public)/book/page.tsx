import Image from "next/image";
import { BookingForm } from "@/components/booking-form";
import { Navbar } from "@/components/navbar";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Book a Shoot" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="relative h-[60svh] bg-black text-white">
        <Image
          src={settings.hero_image_url}
          alt="Booking hero"
          fill
          priority
          className="object-cover object-[80%_center] opacity-75 sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <Navbar />

        <div className="container-page relative flex h-[60svh] flex-col justify-end pb-10 pt-28 sm:pb-16 sm:pt-32">
          <p className="eyebrow !text-white/70">Work together</p>
          <h1 className="mt-4 max-w-5xl font-serif text-[clamp(4rem,12vw,7rem)] leading-[0.85] tracking-[-0.04em]">
            Tell me everything.
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-16 py-20 lg:grid-cols-[.7fr_1.3fr] lg:py-28">
        <div>
          <p className="eyebrow">The beginning</p>
          <h2 className="mt-4 font-serif text-4xl">
            Let’s talk about what you’re imagining.
          </h2>
          <p className="mt-6 text-sm leading-7 text-neutral-600">
            Share a few details below. I typically reply within two business
            days with availability and a tailored collection.
          </p>
          <a
            className="mt-7 block text-sm underline underline-offset-4"
            href="mailto:hiep454546@gmail.com"
          >
            hiep454546@gmail.com
          </a>
        </div>
        <BookingForm defaultType={type} />
      </section>
    </main>
  );
}
