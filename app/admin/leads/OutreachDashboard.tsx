"use client";

import { useMemo, useState, useTransition } from "react";
import { toggleReplied } from "./actions";
import LogSendModal from "./LogSendModal";

export type OutreachDisplayRow = {
  id: string;
  companyName: string | null;
  recipientEmail: string;
  subject: string | null;
  sentAt: string | null;
  daysSinceSent: number | null;
  status: string;
  openCount: number;
  bounced: boolean;
  spamComplaint: boolean;
  replied: boolean;
  sequenceStep: number;
  suggestedAction: string;
  suggestedPriority: "none" | "low" | "medium" | "high";
  statusNote: string | null;
};

const STATUS_FILTERS = ["All", "Sent", "Delivered", "Opened", "Bounced", "Spam", "Not sent"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const PRIORITY_RANK: Record<OutreachDisplayRow["suggestedPriority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

const PRIORITY_STYLES: Record<OutreachDisplayRow["suggestedPriority"], string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-trust-50 text-trust-600 border-trust-100",
  none: "bg-surface-alt text-ink-400 border-ink-300/20",
};

const STATUS_STYLES: Record<string, string> = {
  Bounced: "bg-red-50 text-red-700",
  Spam: "bg-red-50 text-red-700",
  Delivered: "bg-trust-50 text-trust-600",
  Sent: "bg-surface-alt text-ink-400",
  "Not sent": "bg-surface-alt text-ink-300",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function OutreachDashboard({ rows }: { rows: OutreachDisplayRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [needsActionFirst, setNeedsActionFirst] = useState(true);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const summary = useMemo(() => {
    const total = rows.length;
    const opened = rows.filter((r) => r.openCount > 0).length;
    const bounced = rows.filter((r) => r.bounced).length;
    const needsAction = rows.filter(
      (r) => r.suggestedPriority === "high" || r.suggestedPriority === "medium"
    ).length;
    return { total, opened, bounced, needsAction };
  }, [rows]);

  const filtered = useMemo(() => {
    let result = rows;

    if (statusFilter !== "All") {
      result = result.filter((r) =>
        statusFilter === "Opened" ? r.status.startsWith("Opened") : r.status === statusFilter
      );
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) =>
          (r.companyName ?? "").toLowerCase().includes(q) ||
          r.recipientEmail.toLowerCase().includes(q) ||
          (r.subject ?? "").toLowerCase().includes(q)
      );
    }

    if (needsActionFirst) {
      result = [...result].sort((a, b) => PRIORITY_RANK[b.suggestedPriority] - PRIORITY_RANK[a.suggestedPriority]);
    }

    return result;
  }, [rows, statusFilter, search, needsActionFirst]);

  function handleToggleReplied(id: string, nextValue: boolean) {
    setPendingIds((prev) => new Set(prev).add(id));
    startTransition(async () => {
      await toggleReplied(id, nextValue);
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total tracked" value={summary.total} />
        <StatCard label="Opened" value={summary.opened} />
        <StatCard label="Needs action" value={summary.needsAction} accent="amber" />
        <StatCard label="Bounced" value={summary.bounced} accent="red" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search company or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-ink-300/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trust-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-ink-300/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trust-500"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-ink-400 select-none">
          <input
            type="checkbox"
            checked={needsActionFirst}
            onChange={(e) => setNeedsActionFirst(e.target.checked)}
            className="rounded border-ink-300/40"
          />
          Needs action first
        </label>

        <div className="flex-1" />

        <button
          onClick={() => setLogModalOpen(true)}
          className="rounded-lg bg-navy text-white text-sm font-medium px-4 py-2 hover:bg-navy-700 transition-colors whitespace-nowrap"
        >
          + Log a new send
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-ink-300/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-300/15 bg-surface-alt/60 text-left text-ink-400">
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>Subject</Th>
                <Th>Sent</Th>
                <Th>Status</Th>
                <Th>Days</Th>
                <Th>Replied?</Th>
                <Th>Suggested action</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink-300">
                    {rows.length === 0
                      ? "No outreach emails logged yet. Click \u201c+ Log a new send\u201d to add the first one."
                      : "No rows match your search/filter."}
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-ink-300/10 last:border-0 hover:bg-surface-alt/40">
                  <Td className="font-medium text-ink">{row.companyName || "—"}</Td>
                  <Td className="text-ink-400">{row.recipientEmail}</Td>
                  <Td className="text-ink-400 max-w-[220px] truncate" title={row.subject ?? undefined}>
                    {row.subject || "—"}
                  </Td>
                  <Td className="text-ink-400 whitespace-nowrap">{formatDate(row.sentAt)}</Td>
                  <Td>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[row.status] ?? "bg-leaf-50 text-leaf-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </Td>
                  <Td className="text-ink-400">{row.daysSinceSent ?? "—"}</Td>
                  <Td>
                    <input
                      type="checkbox"
                      checked={row.replied}
                      disabled={pendingIds.has(row.id)}
                      onChange={(e) => handleToggleReplied(row.id, e.target.checked)}
                      className="rounded border-ink-300/40 disabled:opacity-50"
                    />
                  </Td>
                  <Td>
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[row.suggestedPriority]}`}
                    >
                      {row.suggestedAction}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LogSendModal open={logModalOpen} onClose={() => setLogModalOpen(false)} />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium whitespace-nowrap">{children}</th>;
}

function Td({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <td className={`px-4 py-3 ${className}`} title={title}>
      {children}
    </td>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "red";
}) {
  const accentClass =
    accent === "amber" ? "text-amber-500" : accent === "red" ? "text-red-600" : "text-navy";
  return (
    <div className="bg-white rounded-xl border border-ink-300/15 px-4 py-3">
      <p className="text-xs text-ink-400 mb-1">{label}</p>
      <p className={`font-display text-2xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}
