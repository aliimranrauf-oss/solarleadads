"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Toggles the manual "Replied?" checkbox for a row (Dev Spec §5, §8).
 * Brevo can't see inbox replies, so this stays a manual action for v1.
 */
export async function toggleReplied(id: string, replied: boolean) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("outreach_emails")
    .update({
      replied,
      replied_at: replied ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("toggleReplied error:", error);
    return { success: false, message: "Couldn't update — please try again." };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

export type LogSendState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * "Log a new send" — Dev Spec §8, Option A. Since sending still happens
 * manually via Gmail, this is how a row gets created at send time. The
 * Brevo webhook then fills in delivered/opened/etc. on top of it, matching
 * by recipient_email + subject until a message_id is attached.
 */
export async function logNewSend(
  _prevState: LogSendState,
  formData: FormData
): Promise<LogSendState> {
  const companyName = String(formData.get("company_name") ?? "").trim();
  const recipientEmail = String(formData.get("recipient_email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const sequenceStepRaw = String(formData.get("sequence_step") ?? "1").trim();
  const statusNote = String(formData.get("status_note") ?? "").trim();

  if (!recipientEmail) {
    return { status: "error", message: "Recipient email is required." };
  }
  if (!isValidEmail(recipientEmail)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const sequenceStep = [1, 2, 3].includes(Number(sequenceStepRaw)) ? Number(sequenceStepRaw) : 1;

  try {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("outreach_emails").insert({
      company_name: companyName || null,
      recipient_email: recipientEmail,
      subject: subject || null,
      sequence_step: sequenceStep,
      status_note: statusNote || null,
      sent_at: new Date().toISOString(),
    });

    if (error) {
      console.error("logNewSend insert error:", error);
      return { status: "error", message: "Something went wrong saving that. Please try again." };
    }

    revalidatePath("/admin/leads");
    return { status: "success", message: "Logged." };
  } catch (err) {
    console.error("logNewSend error:", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
