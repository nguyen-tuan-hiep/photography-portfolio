"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#11110f]">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-5 backdrop-blur-md dark:border-neutral-800 dark:bg-[#181816]/90 sm:px-8 lg:h-20 lg:justify-end lg:px-12">
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/admin"
              className="font-serif text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              TUAN HIEP
            </Link>

            <span className="eyebrow">Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle showLabel />

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label="Toggle admin menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}