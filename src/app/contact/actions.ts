"use server";

import { headers } from "next/headers";
import { contact } from "@/content/pages";
import { sendLead } from "@/lib/leads";
import { readLead, validateLead, type LeadErrors, type LeadValues } from "@/lib/validate";

export interface ContactState {
  status: "idle" | "invalid" | "sent" | "unavailable" | "error";
  /** What the visitor typed, so nothing is lost on an error (also without JavaScript). */
  values?: LeadValues;
  errors?: LeadErrors;
  message?: string;
}

/** Faster than this from page load to submit is treated as a bot. */
const MIN_FILL_MS = 3000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

/** In-memory rate limit per IP (one Node process; resets on restart). */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = readLead(form);

  // Spam checks. Bots get the same neutral answer as everyone else and nothing is sent.
  const honeypot = form.get("company");
  const started = Number(form.get("startedAt"));
  const tooFast = Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS;
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if ((typeof honeypot === "string" && honeypot !== "") || tooFast || rateLimited(ip)) {
    return { status: "unavailable", values, message: contact.unavailable };
  }

  const errors = validateLead(values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", values, errors, message: contact.invalid };
  }

  const result = await sendLead(values);
  if (result.ok) return { status: "sent", message: contact.success };
  if (result.reason === "not-configured") {
    return { status: "unavailable", values, message: contact.unavailable };
  }
  return { status: "error", values, message: contact.error };
}
