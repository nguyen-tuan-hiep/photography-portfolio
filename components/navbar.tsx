"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 64);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-paper/90 text-ink shadow-sm backdrop-blur-md dark:bg-[#121211]/90 dark:text-white" : "bg-transparent text-white"}`}>
    <div className={`container-page flex h-20 items-center justify-between border-b transition-all duration-300 sm:h-24 ${scrolled ? "border-neutral-300/70 dark:border-white/10" : "border-white/25"}`}>
      <Link href="/" className="font-serif text-2xl tracking-wide">TUAN HIEP</Link>
      <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.2em] md:flex">
        <Link href="/albums" className="hover:opacity-60">Albums</Link><Link href="/#about" className="hover:opacity-60">About</Link><Link href="/book" className="hover:opacity-60">Book a shoot</Link><ThemeToggle inverted={!scrolled} />
      </nav>
      <div className="flex items-center gap-3 md:hidden"><ThemeToggle inverted={!scrolled}/><Link href="/albums" aria-label="Open albums"><Menu size={22} /></Link></div>
    </div>
  </header>;
}
