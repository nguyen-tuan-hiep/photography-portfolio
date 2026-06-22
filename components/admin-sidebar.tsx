"use client";

import Link from "next/link";
import {
  Images,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Home,
} from "lucide-react";
import { logout } from "@/app/actions";

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const linkClass =
    "flex w-full items-center gap-3 whitespace-nowrap px-3 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800";

  const nav = (
    <>
      <Link className={linkClass} href="/admin" onClick={onMobileClose}>
        <LayoutDashboard size={17} />
        Dashboard
      </Link>

      <Link
        className={linkClass}
        href="/admin/homepage"
        onClick={onMobileClose}
      >
        <Home size={17} />
        Homepage
      </Link>

      <Link className={linkClass} href="/admin/albums" onClick={onMobileClose}>
        <Images size={17} />
        Albums
      </Link>

      <Link
        className={linkClass}
        href="/"
        target="_blank"
        onClick={onMobileClose}
      >
        <ExternalLink size={17} />
        View site
      </Link>

      <form action={logout}>
        <button type="submit" className={linkClass}>
          <LogOut size={17} />
          Sign out
        </button>
      </form>
    </>
  );

  return (
    <>
      <aside className="hidden border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#181816] lg:fixed lg:inset-y-0 lg:block lg:w-64">
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/admin" className="font-serif text-2xl">
            TUAN HIEP
          </Link>

          <span className="eyebrow">Admin</span>
        </div>

        <nav className="space-y-1 px-3">{nav}</nav>
      </aside>

      <div
        className={`fixed inset-x-0 top-16 z-40 border-b border-neutral-200 bg-white px-3 py-3 shadow-sm dark:border-neutral-800 dark:bg-[#181816] lg:hidden ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1">{nav}</nav>
      </div>
    </>
  );
}