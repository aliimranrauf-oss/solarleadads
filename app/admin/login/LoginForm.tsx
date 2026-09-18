"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="bg-white rounded-xl border border-ink-300/20 shadow-sm p-6 space-y-4"
    >
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-ink-300/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trust-500"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-navy text-white text-sm font-medium py-2.5 hover:bg-navy-700 transition-colors disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
