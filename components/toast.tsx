"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "warning" | "error";

const styles: Record<ToastVariant, { shell: string; icon: string; progress: string; label: string }> = {
  success: { shell: "border-emerald-200", icon: "bg-emerald-50 text-emerald-700", progress: "bg-emerald-600", label: "Success" },
  warning: { shell: "border-amber-200", icon: "bg-amber-50 text-amber-700", progress: "bg-amber-500", label: "Attention" },
  error: { shell: "border-red-200", icon: "bg-red-50 text-red-700", progress: "bg-red-600", label: "Error" },
};

export function Toast({ message, variant = "success", duration = 3000 }: { message: string; variant?: ToastVariant; duration?: number }) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const style = styles[variant];
  const Icon = variant === "success" ? CheckCircle2 : variant === "warning" ? AlertTriangle : XCircle;

  const close = () => {
    setClosing(true);
    window.setTimeout(() => setVisible(false), 250);
  };

  useEffect(() => {
    const timer = window.setTimeout(close, duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;
  return <div role={variant === "error" ? "alert" : "status"} className={`fixed right-4 top-4 z-[120] w-[calc(100%-2rem)] max-w-sm overflow-hidden border bg-white shadow-[0_18px_55px_rgba(0,0,0,0.16)] sm:right-6 sm:top-6 ${style.shell} ${closing ? "toast-out" : "toast-in"}`}>
    <div className="flex items-start gap-3 p-4 pr-11">
      <div className={`grid size-10 shrink-0 place-items-center rounded-full ${style.icon}`}><Icon size={19} strokeWidth={1.8} /></div>
      <div className="pt-0.5"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{style.label}</p><p className="mt-1 text-sm leading-6 text-ink">{message}</p></div>
    </div>
    <button type="button" onClick={close} aria-label="Close notification" className="absolute right-3 top-3 p-2 text-neutral-400 transition hover:text-ink"><X size={16} /></button>
    <div className={`h-0.5 origin-left toast-progress ${style.progress}`} style={{ animationDuration: `${duration}ms` }} />
  </div>;
}
