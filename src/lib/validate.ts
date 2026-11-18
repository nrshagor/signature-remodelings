// Shared by the contact form (client) and the server action. No dependencies.
import { contact } from "@/content/pages";

export const LEAD_FIELDS = [
  "name",
  "phone",
  "email",
  "location",
  "projectType",
  "budget",
  "timeline",
  "message",
] as const;

export type LeadField = (typeof LEAD_FIELDS)[number];
export type LeadValues = Record<LeadField, string>;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const emptyLead: LeadValues = {
  name: "",
  phone: "",
  email: "",
  location: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
};

/** Simple, permissive check: something@something.tld, no spaces. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reads the form fields as trimmed strings (missing fields become ""). */
export function readLead(form: FormData): LeadValues {
  const values = { ...emptyLead };
  for (const field of LEAD_FIELDS) {
    const raw = form.get(field);
    values[field] = typeof raw === "string" ? raw.trim() : "";
  }
  return values;
}

/** Field rules (docs/03-CONTENT.md → Contact). Returns an empty object when valid. */
export function validateLead(v: LeadValues): LeadErrors {
  const e: LeadErrors = {};
  const m = contact.errors;
  if (v.name.length < 2 || v.name.length > 100) e.name = m.name;
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || v.phone.length > 25) e.phone = m.phone;
  if (!EMAIL.test(v.email) || v.email.length > 254) e.email = m.email;
  if (v.location.length < 2 || v.location.length > 100) e.location = m.location;
  if (!contact.projectTypes.includes(v.projectType)) e.projectType = m.projectType;
  if (v.budget && !(contact.budgetRanges ?? []).includes(v.budget)) e.budget = m.budget;
  if (v.timeline && !contact.timelines.includes(v.timeline)) e.timeline = m.timeline;
  if (v.message.length < contact.messageMin || v.message.length > contact.messageMax) {
    e.message = m.message;
  }
  return e;
}
