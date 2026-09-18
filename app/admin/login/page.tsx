import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-navy">SolarLeadAds Admin</h1>
          <p className="text-ink-400 text-sm mt-1">Sign in to view outreach status</p>
        </div>
        <LoginForm next={next ?? "/admin/leads"} />
      </div>
    </main>
  );
}
