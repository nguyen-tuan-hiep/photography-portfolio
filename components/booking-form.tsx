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
		<form
			action={action}
			className="grid w-full min-w-0 max-w-full gap-x-8 gap-y-6 sm:grid-cols-2"
		>
			<label className="block min-w-0 text-xs uppercase tracking-wider">
				Name *
				<input
					className="field w-full max-w-full min-w-0"
					name="name"
					required
					minLength={2}
					placeholder="Your name"
				/>
			</label>

			<label className="block min-w-0 text-xs uppercase tracking-wider">
				Email *
				<input
					className="field w-full max-w-full min-w-0"
					name="email"
					type="email"
					required
					placeholder="you@example.com"
				/>
			</label>

			<fieldset className="min-w-0">
				<legend className="text-xs uppercase tracking-wider">
					WhatsApp number
				</legend>

				<div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-4">
					<label className="min-w-0">
						<span className="sr-only">Country code</span>
						<input
							className="field w-full max-w-full min-w-0"
							name="whatsapp_country_code"
							type="tel"
							inputMode="tel"
							autoComplete="tel-country-code"
							maxLength={2}
							placeholder="+65"
							aria-label="WhatsApp country code"
						/>
					</label>

					<label className="min-w-0">
						<span className="sr-only">Phone number</span>
						<input
							className="field w-full max-w-full min-w-0"
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

			<label className="block min-w-0 text-xs uppercase tracking-wider">
				<span>Shoot type</span>

				<div className="relative mt-1 min-w-0">
					<select
						className="field w-full max-w-full min-w-0 appearance-none pr-12"
						name="shoot_type"
						defaultValue={defaultType}
					>
						<option value="">Select one</option>
						{[
							"Wedding",
							"Birthday",
							"Portrait",
							"Graduation",
							"Event",
							"Other",
						].map((x) => (
							<option
								key={x}
								value={x}
							>
								{x}
							</option>
						))}
					</select>

					<span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg">
						⌄
					</span>
				</div>
			</label>

			<TimePickerField
				name="start_time"
				label="Start time"
			/>

			<TimePickerField
				name="end_time"
				label="End time"
			/>

			<DatePickerField
				name="preferred_date"
				label="Preferred date"
			/>

			<label className="block min-w-0 text-xs uppercase tracking-wider sm:col-span-2">
				Tell me about it
				<textarea
					className="field min-h-28 w-full max-w-full min-w-0 resize-y"
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
