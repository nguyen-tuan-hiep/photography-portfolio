import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink py-14 text-white">
      <div className="container-page flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
        <div>
          <p className="font-serif text-3xl">Frames by Hiep</p>
          <p className="mt-3 sm:max-w-sm md:max-w-md lg:max-w-lg 2xl:max-w-xl text-xs leading-6 text-white/55">
            Thoughtful photography for people who want to remember how it felt.
          </p>
        </div>
        <div className="flex gap-7 text-[10px] uppercase tracking-[0.2em]">
          <a href="https://instagram.com/nguyen.tuan.hiep" target="_blank">
            Instagram
          </a>
          <a href="mailto:hiep454546@gmail.com">Email</a>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-white/15 pt-5 text-[10px] uppercase tracking-widest text-white/35">
        © {new Date().getFullYear()} Frames by Hiep
      </div>
    </footer>
  );
}
