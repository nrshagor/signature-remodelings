"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";
import { contact } from "@/content/pages";
import { emptyLead, readLead, validateLead, type LeadErrors, type LeadField } from "@/lib/validate";
import styles from "./ContactForm.module.css";

const initial: ContactState = { status: "idle" };
const L = contact.labels;

/**
 * Contact form. Works without JavaScript (plain POST to the server action; the typed
 * values come back in the state). With JavaScript the fields are checked first, the
 * submit runs without a page reload, and the form is never cleared on an error.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<LeadErrors | null>(null);
  const [startedAt, setStartedAt] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  // Time-to-submit check: the clock starts once the form is usable in the browser.
  useEffect(() => {
    const id = window.setTimeout(() => setStartedAt(String(Date.now())), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Move focus to the result so keyboard and screen-reader users get it.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const errors = clientErrors ?? state.errors ?? {};
  const values = state.values ?? emptyLead;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const found = validateLead(readLead(data));
    const first = Object.keys(found)[0];
    if (first) {
      setClientErrors(found);
      formEl.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors(null);
    // Calling the action ourselves (not through the form prop) keeps what was typed.
    startTransition(() => formAction(data));
  }

  if (state.status === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={`${styles.notice} ${styles.success}`}
      >
        {state.message}
      </div>
    );
  }

  const field = (name: LeadField) => ({
    id: `contact-${name}`,
    name,
    defaultValue: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const error = (name: LeadField) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  /**
   * Choice as pill chips: real radio inputs (arrow keys move within the group, Space
   * selects), visually hidden but focusable; the pill shows checked and focus states.
   */
  const pills = (name: LeadField, legend: string, options: string[], required: boolean) => (
    <fieldset
      className={`${styles.field} ${styles.full} ${styles.fieldset}`}
      aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
    >
      <legend className={styles.legend}>
        {legend}
        {!required && <span className={styles.optional}> ({L.optional})</span>}
      </legend>
      <div className={styles.pills}>
        {options.map((option, i) => (
          <label key={option} className={styles.pill}>
            <input
              type="radio"
              name={name}
              value={option}
              required={required && i === 0 ? true : undefined}
              defaultChecked={values[name] === option}
              data-invalid={errors[name] ? "" : undefined}
              className={styles.pillInput}
            />
            <span className={styles.pillText}>{option}</span>
          </label>
        ))}
      </div>
      {error(name)}
    </fieldset>
  );

  let banner: { tone: string; text?: string } | null = null;
  if (clientErrors) banner = { tone: styles.warn, text: contact.invalid };
  else if (state.status === "invalid") banner = { tone: styles.warn, text: state.message };
  else if (state.status === "unavailable" || state.status === "error") {
    banner = { tone: styles.info, text: state.message };
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className={styles.form}>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={styles.live}>
        {banner && <p className={`${styles.notice} ${banner.tone}`}>{banner.text}</p>}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="contact-name">{L.name}</label>
          <input
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            {...field("name")}
          />
          {error("name")}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-phone">{L.phone}</label>
          <input type="tel" autoComplete="tel" required maxLength={25} {...field("phone")} />
          {error("phone")}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-email">{L.email}</label>
          <input type="email" autoComplete="email" required maxLength={254} {...field("email")} />
          {error("email")}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-location">{L.location}</label>
          <input type="text" required minLength={2} maxLength={100} {...field("location")} />
          {error("location")}
        </div>

        {pills("projectType", L.projectType, contact.projectTypes, true)}

        {contact.budgetRanges && (
          <div className={styles.field}>
            <label htmlFor="contact-budget">
              {L.budget} <span className={styles.optional}>({L.optional})</span>
            </label>
            <select {...field("budget")}>
              <option value="">{L.choose}</option>
              {contact.budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {error("budget")}
          </div>
        )}

        {pills("timeline", L.timeline, contact.timelines, false)}

        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="contact-message">{L.message}</label>
          <textarea
            rows={6}
            required
            minLength={contact.messageMin}
            maxLength={contact.messageMax}
            {...field("message")}
          />
          {error("message")}
        </div>
      </div>

      {/* Spam checks: a field people never see, and when the form became usable. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className={styles.actions}>
        <Button type="submit" large disabled={pending}>
          {pending ? contact.sendingLabel : contact.submitLabel}
        </Button>
        <p className={styles.consent}>{contact.consent}</p>
      </div>
    </form>
  );
}
