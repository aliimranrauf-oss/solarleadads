/** Shape of a row in the `outreach_emails` Supabase table. */
export type OutreachEmailRow = {
  id: string;
  company_name: string | null;
  recipient_email: string;
  subject: string | null;
  message_id: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  first_opened_at: string | null;
  last_opened_at: string | null;
  open_count: number;
  clicked_at: string | null;
  bounced: boolean;
  bounce_reason: string | null;
  spam_complaint: boolean;
  replied: boolean;
  replied_at: string | null;
  sequence_step: number;
  status_note: string | null;
  created_at: string;
  updated_at: string;
};
