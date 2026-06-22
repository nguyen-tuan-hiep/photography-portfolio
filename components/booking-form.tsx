"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions";
import { DatePickerField } from "./date-picker-field";
import { TimePickerField } from "./time-picker-field";

export function BookingForm({ defaultType = "" }: { defaultType?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, {});

  if (state.success) {
    return (
      <div className="border border-neutral-300 p-10">
        <p className="eyebrow">Inquiry sent</p>
        <h2 className="mt-3 font-serif text-4xl">Thank you.</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">
          {state.success}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <label className="text-xs uppercase tracking-wider">
        Name *
        <input
          className="field"
          name="name"
          required
          minLength={2}
          placeholder="Your name"
        />
      </label>

      <label className="text-xs uppercase tracking-wider">
        Email *
        <input
          className="field"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </label>

      <fieldset>
        <legend className="text-xs uppercase tracking-wider">
          WhatsApp number
        </legend>

        <div className="grid grid-cols-[88px_1fr] gap-4">
          <label>
            <span className="sr-only">Country code</span>
            <input
              className="field"
              name="whatsapp_country_code"
              type="tel"
              inputMode="tel"
              autoComplete="tel-country-code"
              maxLength={2}
              placeholder="+65"
              aria-label="WhatsApp country code"
            />
          </label>

          <label>
            <span className="sr-only">Phone number</span>
            <input
              className="field"
              name="whatsapp_number"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="1234 5678"
              aria-label="WhatsApp phone number"
            />
          </label>
        </div>
      </fieldset>

      <label className="text-xs uppercase tracking-wider">
        Shoot type
        <select className="field" name="shoot_type" defaultValue={defaultType}>
          <option value="">Select one</option>
          {[
            "Wedding",
            "Birthday",
            "Portrait",
            "Graduation",
            "Event",
            "Other",
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <TimePickerField name="start_time" label="Start time" />

      <TimePickerField name="end_time" label="End time" />

      <DatePickerField name="preferred_date" label="Preferred date" />

      <label className="text-xs uppercase tracking-wider sm:col-span-2">
        Tell me about it
        <textarea
          className="field min-h-28 resize-y"
          name="message"
          placeholder="A little about your plans..."
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-700 sm:col-span-2">{state.error}</p>
      )}

      <button
        className="button-dark sm:col-span-2 sm:justify-self-start"
        disabled={pending}
      >
        {pending ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
