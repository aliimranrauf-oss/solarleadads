# Cold Email Tracker + Admin Dashboard — Setup Guide

This covers everything to do **after** the code is dropped into the repo:
creating the database table, generating secrets, wiring up Vercel, and
configuring Brevo's webhook. Follow it in order.

---

## 1. Create the Supabase table

1. Go to your Supabase project → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/outreach-schema.sql` and click **Run**.
3. Confirm it worked: **Table Editor** → you should see a new
   `outreach_emails` table with 0 rows.

No changes are needed to the existing `leads` table or any other part of
the database — this is fully separate.

---

## 2. Generate the two secrets

Run this twice locally (once for each secret) — each run gives you a fresh
random 64-character hex string:

```bash
openssl rand -hex 32
```

- First result → `BREVO_WEBHOOK_SECRET`
- Second result → `ADMIN_SESSION_SECRET`

Pick your own admin password for `ADMIN_PASSWORD` (a real passphrase, not a
generated hex string — you'll be typing this one in by hand).

---

## 3. Add environment variables

Add all three new variables in **two** places — they need to match:

**Locally** — `.env.local` (copy the block from `.env.example`):
```
BREVO_WEBHOOK_SECRET=<paste first openssl result>
ADMIN_PASSWORD=<pick a real password>
ADMIN_SESSION_SECRET=<paste second openssl result>
```

**On Vercel** — your project → **Settings → Environment Variables** → add
the same three keys/values. Set them for **Production** (and Preview if you
want to test on preview deployments too). Redeploy after adding them —
Vercel doesn't pick up new env vars on an already-running deployment.

You do **not** need any new AI/model API key for this feature — the
"suggested action" logic is plain rule-based TypeScript, not AI-generated.
(That's separate from the existing `GROQ_API_KEY`/`XAI_API_KEY` used by the
site's chat widget — leave those as they are.)

---

## 4. Configure the Brevo webhook

1. Log into Brevo → **Transactional** → **Settings** → **Webhooks**.
2. Click **Add a new webhook**.
3. URL: `https://solarleadads.com/api/brevo-webhook?key=YOUR_BREVO_WEBHOOK_SECRET`
   (use the exact value you put in `BREVO_WEBHOOK_SECRET` on Vercel).
4. Select events: **Sent, Delivered, Opened, Click, Hard bounce, Soft
   bounce, Spam complaint**.
5. Save, then use Brevo's **"Send a test event"** button.
6. Check it arrived: Vercel dashboard → your project → **Logs**, filter for
   `/api/brevo-webhook`. You should see the request with a `200` response
   and no errors printed.

If Brevo shows the webhook as failing/disabled after a while, it usually
means either the secret doesn't match or the endpoint errored — check the
Vercel logs for the exact `console.error` line, which includes the event
type and payload details.

---

## 5. Log into the admin dashboard

1. Visit `https://solarleadads.com/admin/leads`.
2. You'll be redirected to `/admin/login` — enter the `ADMIN_PASSWORD` you set.
3. You're in. The table will be empty until you either:
   - Click **"+ Log a new send"** and log one manually, or
   - Receive a Brevo webhook event for an email Brevo already knows about
     (which auto-creates a row if none exists yet).

Session lasts 7 days per browser, then you'll need to log in again. There's
a **Log out** button top-right.

---

## 6. Day-to-day usage

- Every time you send a cold email manually via Gmail, click **"+ Log a new
  send"** on `/admin/leads` and fill in company/email/subject. This is the
  one manual step that can't be automated yet (see Dev Spec §8 — automating
  this requires moving off Gmail to sending through Brevo's own API, which
  is a bigger, separate task).
- Brevo's webhook fills in delivered/opened/clicked/bounced automatically
  from there, matched by email + subject.
- When someone replies in your inbox, manually check the **"Replied?"** box
  for that row — Brevo has no way to see your inbox, so this stays manual.
- The **"Suggested action"** column updates itself as days pass and opens
  accumulate — no action needed from you except reading it.

---

## 7. Where things live in the repo (for future changes)

| What | File |
|---|---|
| Database schema | `supabase/outreach-schema.sql` |
| Row type | `lib/outreach-types.ts` |
| Suggested-action rules | `lib/suggested-action.ts` |
| Session/cookie signing | `lib/admin-session.ts` |
| Route protection | `middleware.ts` (repo root) |
| Login page + action | `app/admin/login/page.tsx`, `LoginForm.tsx`, `actions.ts` |
| Dashboard page (data fetch) | `app/admin/leads/page.tsx` |
| Dashboard UI (table, filters, search) | `app/admin/leads/OutreachDashboard.tsx` |
| "Log a new send" form | `app/admin/leads/LogSendModal.tsx` |
| Reply toggle / log-send server actions | `app/admin/leads/actions.ts` |
| Brevo webhook | `app/api/brevo-webhook/route.ts` |

To change the suggested-action thresholds (e.g. "3 days" → "2 days"), the
only file to touch is `lib/suggested-action.ts` — it's a pure function, kept
deliberately separate from the UI so this stays a one-file edit.

To add features later (the spec's "out of scope for v1" list — automatic
reply detection via Gmail API, multi-user roles, auto-sending follow-ups,
WhatsApp tracking), each is additive: none of them require restructuring
what's here.
