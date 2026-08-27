"use client";

import { useActionState } from "react";
import { submitReview, type SubmitReviewState } from "@/app/reviews/actions";

const initialState: SubmitReviewState = { status: "idle" };

export default function ReviewForm() {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-leaf-100 bg-leaf-50 px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-500 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-navy">Thank you!</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot — identical pattern to the contact form */}
      <div
        className="pointer-events-none absolute left-0 top-0 -z-10 h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="hp_field_9k2">Leave this field empty</label>
        <input
          type="text"
          id="hp_field_9k2"
          name="hp_field_9k2"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </div>
      <input type="hidden" name="form_rendered_at" defaultValue={Date.now()} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required>
          <input id="name" name="name" type="text" required className="input-field" placeholder="Jane Rivera" />
        </Field>

        <Field label="Company" htmlFor="company" hint="Optional">
          <input id="company" name="company" type="text" className="input-field" placeholder="Rivera Solar Co." />
        </Field>

        <Field label="Country" htmlFor="country" required>
          <input id="country" name="country" type="text" required className="input-field" placeholder="USA, UK, Australia..." />
        </Field>

        <Field label="Rating" htmlFor="rating" required>
          <select id="rating" name="rating" required defaultValue="" className="input-field">
            <option value="" disabled>
              Select a rating
            </option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}{"☆".repeat(5 - n)} ({n}/5)
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Photo link" htmlFor="avatar_url" hint="Optional — paste a link to a photo of you, or leave blank for initials">
        <input id="avatar_url" name="avatar_url" type="url" className="input-field" placeholder="https://..." />
      </Field>

      <Field label="Your review" htmlFor="review" required>
        <textarea
          id="review"
          name="review"
          required
          rows={4}
          maxLength={1000}
          className="input-field resize-none"
          placeholder="What was it like working with SolarLeadAds?"
        />
      </Field>

      {state.status === "error" && (
        <p className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-navy" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
        {isPending ? "Submitting…" : "Submit Review"}
      </button>

      <p className="text-xs text-ink-300">
        Reviews are checked before they go live, so yours may take a little
        while to appear.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-navy">
        {label}
        {required && <span className="text-trust-500"> *</span>}
        {hint && <span className="ml-1.5 font-normal text-ink-300">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
