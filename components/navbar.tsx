"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 64);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const solid = scrolled || mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid
          ? "bg-paper/90 text-ink shadow-sm backdrop-blur-md dark:bg-[#121211]/90 dark:text-white"
          : "bg-transparent text-white"
      }`}
    >
      <div
        className={`container-page flex h-20 items-center justify-between border-b transition-all duration-300 sm:h-24 ${
          solid
            ? "border-neutral-300/70 dark:border-white/10"
            : "border-white/25"
        }`}
      >
        <Link href="/" className="font-serif text-2xl tracking-wide">
          TUAN HIEP
        </Link>

        <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.2em] md:flex">
          <Link href="/albums" className="hover:opacity-60">
            Albums
          </Link>
          <Link href="/#about" className="hover:opacity-60">
            About
          </Link>
          <Link href="/book" className="hover:opacity-60">
            Book a shoot
          </Link>
          <ThemeToggle inverted={!solid} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle inverted={!solid} />

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="container-page flex flex-col gap-5 py-6 text-[12px] font-medium uppercase tracking-[0.2em] md:hidden">
          <Link
            href="/#about"
            className="hover:opacity-60"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>

          <Link
            href="/albums"
            className="hover:opacity-60"
            onClick={() => setMobileOpen(false)}
          >
            Albums
          </Link>

          <Link
            href="/book"
            className="hover:opacity-60"
            onClick={() => setMobileOpen(false)}
          >
            Book a shoot
          </Link>
        </nav>
      )}
    </header>
  );
}
