"use client";

import { useActionState, useRef } from "react";
import { submitLead, type SubmitLeadState } from "@/app/contact/actions";

const AD_SPEND_OPTIONS = [
  "Not running ads yet",
  "Under $1,000/mo",
  "$1,000 – $3,000/mo",
  "$3,000+/mo",
];

const initialState: SubmitLeadState = { status: "idle" };

export default function ContactForm({
  source = "contact_page",
  presetPackage = null,
}: {
  source?: string;
  /** Set when the visitor arrived via a "Choose [tier]" button on /services. */
  presetPackage?: { id: string; name: string } | null;
}) {
  const [state, formAction, isPending] = useActionState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-leaf-100 bg-leaf-50 px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-500 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-navy">You&apos;re in.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="source" value={source} />

      {presetPackage && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-trust-50 px-4 py-3 text-sm font-medium text-trust-600">
          Inquiring about the {presetPackage.name} package
        </div>
      )}

      {/* Honeypot — hidden from real users, visible to bots. Do not remove.
          Field name is deliberately generic/nonsensical so browser autofill
          (address book / company profile data) doesn't get stuffed into it —
          "company_site" was too close to real autofill fields and was being
          silently filled in by Chrome, causing real submissions to be
          treated as spam and skipped. */}
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
      {/* Timestamp trap: real users take at least a couple seconds to fill
          the form; bots that submit instantly get treated as spam too. */}
      <input type="hidden" name="form_rendered_at" value={Date.now()} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="input-field"
            placeholder="Jane Rivera"
          />
        </Field>

        <Field label="Email" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            placeholder="jane@yoursolarco.com"
          />
        </Field>

        <Field label="Company name" htmlFor="company" required>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className="input-field"
            placeholder="Rivera Solar Co."
          />
        </Field>

        <Field label="Phone" htmlFor="phone" hint="Optional">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="input-field"
            placeholder="(555) 123-4567"
          />
        </Field>

        <Field label="Website or Facebook Ad Library link" htmlFor="website_url" hint="Optional — helps us look at what you&apos;ve got before we write anything up">
          <input
            id="website_url"
            name="website_url"
            type="text"
            className="input-field"
            placeholder="yoursolarco.com"
          />
        </Field>

        <Field label="Current monthly ad spend" htmlFor="ad_spend_range" hint="Optional">
          <select id="ad_spend_range" name="ad_spend_range" className="input-field" defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            {AD_SPEND_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="What&apos;s not working with your leads right now?" htmlFor="message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="input-field resize-none"
          placeholder="e.g. currently running $2k/mo on Facebook, getting leads but they're low quality..."
        />
      </Field>

      {state.status === "error" && (
        <p className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-navy" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
        {isPending ? "Sending…" : "Request My Free Audit"}
      </button>

      <p className="text-xs text-ink-300">
        We&apos;ll review your info and email your free audit — no spam, and we never sell your data.
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
