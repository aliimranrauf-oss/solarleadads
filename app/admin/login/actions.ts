"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, SESSION_COOKIE_OPTIONS, createSessionToken } from "@/lib/admin-session";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

// Tiny in-memory rate limit for the login attempt itself — same spirit as
// the honeypot/timestamp checks on the public contact form, just enough to
// stop naive brute-forcing of a single shared password. Resets on cold
// start; fine for one or two admin users.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_ATTEMPTS) return true;
  entry.count += 1;
  return false;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/leads");
  const safeNext = next.startsWith("/admin") ? next : "/admin/leads";

  if (isRateLimited("global")) {
    return { status: "error", message: "Too many attempts. Please wait a few minutes and try again." };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("login: ADMIN_PASSWORD env var is not set");
    return { status: "error", message: "Admin login isn't configured yet. Set ADMIN_PASSWORD in your env vars." };
  }

  if (password !== adminPassword) {
    return { status: "error", message: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

  redirect(safeNext);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}
