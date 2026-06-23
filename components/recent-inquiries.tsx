"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  MessageCircle,
  MessageSquareText,
  Trash2,
} from "lucide-react";
import { deleteInquiry } from "@/app/actions";
import type { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "./confirm-dialog";
import { Toast } from "./toast";

export function RecentInquiries({
  initialInquiries,
}: {
  initialInquiries: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [target, setTarget] = useState<Inquiry | null>(null);
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<{
    key: number;
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const formatTime = (time?: string | null) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  const remove = () => {
    if (!target) return;

    const inquiry = target;

    start(async () => {
      const result = await deleteInquiry(inquiry.id);

      if (result.error) {
        setToast({
          key: Date.now(),
          message: result.error,
          variant: "error",
        });
        return;
      }

      setInquiries((current) =>
        current.filter((item) => item.id !== inquiry.id),
      );

      setTarget(null);

      setToast({
        key: Date.now(),
        message: `Inquiry from ${inquiry.name} was deleted.`,
        variant: "success",
      });
    });
  };

  if (!inquiries.length) {
    return (
      <div className="border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Client requests</p>
            <h2 className="mt-2 font-serif text-3xl">Recent inquiries</h2>
          </div>

          <span className="grid size-10 place-items-center rounded-full bg-neutral-100 text-neutral-500">
            <MessageSquareText size={18} />
          </span>
        </div>

        <div className="mt-8 border border-dashed border-neutral-300 px-6 py-12 text-center">
          <p className="font-serif text-2xl">No inquiries yet.</p>
          <p className="mt-2 text-sm text-neutral-500">
            New booking requests will appear here.
          </p>
        </div>

        {toast && (
          <Toast
            key={toast.key}
            message={toast.message}
            variant={toast.variant}
          />
        )}
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Client requests</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
            Recent inquiries
          </h2>
        </div>

        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          {inquiries.length} recent
        </span>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {inquiries.map((inquiry) => {
          const initials = inquiry.name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

          const whatsappDisplay = inquiry.whatsapp?.replace(/\s+/g, "").trim();
          const whatsappNumber = whatsappDisplay?.replace(/[^0-9]/g, "");

          const startTime = formatTime(inquiry.start_time);
          const endTime = formatTime(inquiry.end_time);

          const timeRange =
            startTime && endTime
              ? `${startTime} - ${endTime}`
              : startTime || endTime;

          return (
            <article
              key={inquiry.id}
              className="group relative min-w-0 overflow-hidden border border-neutral-200 bg-neutral-50 p-5 transition hover:border-neutral-400 sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-4 pr-9">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-serif text-lg text-white dark:bg-white dark:text-ink">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-serif text-2xl leading-none">
                    {inquiry.name}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
                    {inquiry.shoot_type || "General inquiry"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTarget(inquiry)}
                disabled={pending}
                aria-label={`Delete inquiry from ${inquiry.name}`}
                title="Delete inquiry"
                className="absolute right-4 top-4 p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>

              <div className="mt-5 grid gap-3 text-xs text-neutral-600 sm:grid-cols-2">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex min-w-0 items-start gap-2 break-words hover:text-ink"
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="min-w-0 break-words">{inquiry.email}</span>
                </a>

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 items-start gap-2 break-words hover:text-ink"
                  >
                    <MessageCircle size={14} className="shrink-0" />
                    <span className="min-w-0 break-words">
                      {whatsappDisplay}
                    </span>
                  </a>
                )}

                {inquiry.preferred_date && (
                  <span className="flex min-w-0 items-center gap-2 break-words">
                    <CalendarDays size={14} className="shrink-0" />
                    {formatDate(inquiry.preferred_date)}
                  </span>
                )}

                {timeRange && (
                  <span className="flex min-w-0 items-center gap-2 break-words">
                    <Clock3 size={14} className="shrink-0" />
                    {timeRange}
                  </span>
                )}
              </div>

              {inquiry.message && (
                <div className="mt-5 min-w-0 border-l-2 border-neutral-300 pl-4">
                  <p className="break-words text-sm leading-6 text-neutral-600">
                    {inquiry.message}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this inquiry?"
        description={`The inquiry from ${
          target?.name || "this client"
        } will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete inquiry"
        pending={pending}
        onConfirm={remove}
        onCancel={() => setTarget(null)}
      />

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          variant={toast.variant}
        />
      )}
    </div>
  );
}
