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

/**
 * Client IP for the rate limit. Nginx overwrites X-Real-IP with the address it sees, so
 * that comes first. Otherwise the LAST X-Forwarded-For entry (the one our proxy, or
 * Next.js in local dev, appended); earlier entries come from the visitor and can be faked.
 */
function clientIp(h: Headers): string {
  const real = (h.get("x-real-ip") ?? "").trim();
  if (real) return real;
  const forwarded = (h.get("x-forwarded-for") ?? "").split(",");
  return forwarded[forwarded.length - 1].trim() || "unknown";
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = readLead(form);

  // Spam checks. Bots get the same neutral answer as everyone else and nothing is sent.
  const honeypot = form.get("company");
  const started = Number(form.get("startedAt"));
  const tooFast = Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS;
  const ip = clientIp(await headers());
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
