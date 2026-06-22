"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ inverted = false, showLabel = false }: { inverted?: boolean; showLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === "dark";
  return <button type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"} className={`inline-flex items-center gap-3 transition ${inverted ? "text-white hover:text-white/60" : "text-ink hover:opacity-60 dark:text-white"}`}><span className="grid size-8 place-items-center rounded-full border border-current/30">{dark ? <Sun size={15} /> : <Moon size={15} />}</span>{showLabel}</button>;
}
