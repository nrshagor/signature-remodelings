// Server only (imported by the contact server action, never by a client component): lead
// delivery adapter. The delivery method (SMTP or an email API) is decided in T2.9; until
// then every lead returns "not-configured" and nothing is sent.
import type { LeadValues } from "./validate";

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/** Sends one lead to the company. Never logs the visitor's details. */
export async function sendLead(lead: LeadValues): Promise<SendResult> {
  void lead;
  console.warn("[contact] Lead delivery is not configured yet (T2.9); the request was not sent.");
  return { ok: false, reason: "not-configured" };
}
