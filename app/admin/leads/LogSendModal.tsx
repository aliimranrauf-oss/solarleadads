"use client";

import { useActionState, useEffect, useRef } from "react";
import { logNewSend, type LogSendState } from "./actions";

const initialState: LogSendState = { status: "idle" };

export default function LogSendModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(logNewSend, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset + close a beat after a successful save so the person sees the
  // "Logged." confirmation before the modal disappears.
  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        formRef.current?.reset();
        onClose();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.status, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-navy">Log a new send</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-400 text-xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <Field label="Company name">
            <input name="company_name" type="text" className={inputClass} placeholder="Acme Solar Co." />
          </Field>

          <Field label="Recipient email" required>
            <input name="recipient_email" type="email" required className={inputClass} placeholder="jane@acmesolar.com" />
          </Field>

          <Field label="Subject line">
            <input name="subject" type="text" className={inputClass} placeholder="Quick question about your ad spend" />
          </Field>

          <Field label="Sequence step">
            <select name="sequence_step" defaultValue="1" className={inputClass}>
              <option value="1">1 — First email</option>
              <option value="2">2 — Follow-up</option>
              <option value="3">3 — Break-up</option>
            </select>
          </Field>

          <Field label="Note (optional)">
            <input name="status_note" type="text" className={inputClass} placeholder="e.g. found via QLD Outback form" />
          </Field>

          {state.status === "error" && (
            <p className="text-sm text-red-600" role="alert">
              {state.message}
            </p>
          )}
          {state.status === "success" && <p className="text-sm text-leaf-600">Logged.</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ink-300/30 text-sm font-medium py-2.5 hover:bg-surface-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-navy text-white text-sm font-medium py-2.5 hover:bg-navy-700 transition-colors disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Log send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-ink-300/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trust-500";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
