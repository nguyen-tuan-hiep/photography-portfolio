"use client";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function AdminShell({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;
  return <div className="min-h-screen bg-[#f7f7f5]">{sidebar}<div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-neutral-200 bg-white/90 px-5 backdrop-blur-md dark:bg-[#181816]/90 sm:px-8 lg:h-20 lg:px-12"><ThemeToggle showLabel/></header>{children}</div></div>;
}
