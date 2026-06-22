"use client";

import { useActionState } from "react";
import { saveSiteSettings } from "@/app/actions";
import type { SiteSettings } from "@/lib/types";
import { SiteImageField } from "./site-image-field";
import { Toast } from "./toast";

export function HomepageForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSiteSettings, {});
  return (
    <form action={action} className="space-y-8">
      <section className="border border-neutral-200 bg-white p-6 sm:p-10">
        <p className="eyebrow">Hero section</p>
        <div className="mt-7 space-y-7">
          <SiteImageField
            label="Hero image"
            name="hero_image"
            initialUrl={settings.hero_image_url}
            initialPublicId={settings.hero_image_public_id}
            aspect="hero"
          />
          <label className="block text-xs uppercase tracking-wider">
            Small heading
            <input
              className="field"
              name="hero_eyebrow"
              defaultValue={settings.hero_eyebrow}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider">
            Main title *
            <textarea
              className="field min-h-24"
              name="hero_title"
              required
              defaultValue={settings.hero_title}
            />
          </label>
        </div>
      </section>
      <section className="border border-neutral-200 bg-white p-6 sm:p-10">
        <p className="eyebrow">Featured albums</p>
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="text-xs uppercase tracking-wider">
            Small heading
            <input
              className="field"
              name="featured_eyebrow"
              defaultValue={settings.featured_eyebrow}
            />
          </label>
          <label className="text-xs uppercase tracking-wider">
            Section title *
            <input
              className="field"
              name="featured_title"
              required
              defaultValue={settings.featured_title}
            />
          </label>
        </div>
      </section>
      <section className="border border-neutral-200 bg-white p-6 sm:p-10">
        <p className="eyebrow">About section</p>
        <div className="mt-7 space-y-7">
          <SiteImageField
            label="Portrait image"
            name="about_image"
            initialUrl={settings.about_image_url}
            initialPublicId={settings.about_image_public_id}
            aspect="portrait"
          />
          <label className="block text-xs uppercase tracking-wider">
            Small heading
            <input
              className="field"
              name="about_eyebrow"
              defaultValue={settings.about_eyebrow}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider">
            Title *
            <input
              className="field"
              name="about_title"
              required
              defaultValue={settings.about_title}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider">
            Description *
            <textarea
              className="field min-h-36"
              name="about_description"
              required
              defaultValue={settings.about_description}
            />
          </label>
        </div>
      </section>
      <section className="border border-neutral-200 bg-white p-6 sm:p-10">
        <p className="eyebrow">Booking CTA</p>
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="text-xs uppercase tracking-wider">
            Small heading
            <input
              className="field"
              name="cta_eyebrow"
              defaultValue={settings.cta_eyebrow}
            />
          </label>
          <label className="text-xs uppercase tracking-wider">
            Title *
            <input
              className="field"
              name="cta_title"
              required
              defaultValue={settings.cta_title}
            />
          </label>
        </div>
      </section>

      {state.error && (
        <Toast key={state.toastId} variant="warning" message={state.error} />
      )}
      {state.success && (
        <Toast key={state.toastId} variant="success" message={state.success} />
      )}

      {/* {state.error && <p className="text-sm text-red-700">{state.error}</p>}{state.success && <p className="text-sm text-emerald-700">{state.success}</p>} */}

      <button className="button-dark" disabled={pending}>
        {pending ? "Saving..." : "Save homepage"}
      </button>
    </form>
  );
}
