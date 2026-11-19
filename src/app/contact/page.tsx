import type { Metadata } from "next";
import { FaqList } from "@/components/faq/FaqList";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { visibleFaqs } from "@/content/faq";
import { contact } from "@/content/pages";
import { seo } from "@/content/seo";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(seo.contact, "/contact");

interface Detail {
  label: string;
  value: string;
  href?: string;
}

/** Only the contact details the client has confirmed; none yet, so none are shown. */
function contactDetails(): Detail[] {
  const { phone, email, hours } = site.contact;
  const out: Detail[] = [];
  if (phone) out.push({ label: contact.panel.phone, value: phone, href: `tel:${phone}` });
  if (email) out.push({ label: contact.panel.email, value: email, href: `mailto:${email}` });
  if (hours) out.push({ label: contact.panel.hours, value: hours });
  if (site.serviceArea?.length) {
    out.push({ label: contact.panel.serviceArea, value: site.serviceArea.join(", ") });
  }
  return out;
}

/**
 * Contact. Desktop: dark panel (h1, text, what happens next, confirmed contact details)
 * beside the form in an elevated card. Mobile: stacked. A compact FAQ follows.
 */
export default function ContactPage() {
  const details = contactDetails();
  const faqs = visibleFaqs();
  return (
    <>
      <section className={styles.top}>
        <Container className={styles.layout}>
          <div className={styles.panel}>
            <h1 className={styles.headline}>{contact.headline}</h1>
            <p className={styles.text}>{contact.text}</p>

            <h2 className={styles.nextHeading}>{contact.next.heading}</h2>
            <ol role="list" className={styles.steps}>
              {contact.next.steps.map((step, i) => (
                <li key={step} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {details.length > 0 && (
              <dl className={styles.details} aria-label={contact.panel.label}>
                {details.map((d) => (
                  <div key={d.label} className={styles.row}>
                    <dt>{d.label}</dt>
                    <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className={styles.card}>
            <ContactForm />
          </div>
        </Container>
      </section>

      {faqs.length > 0 && (
        <Section tone="mist" labelledBy="contact-faq-heading">
          <Container>
            <Reveal className={styles.faqHead}>
              <Heading level={2} id="contact-faq-heading">
                {contact.faqHeading}
              </Heading>
            </Reveal>
            <FaqList items={faqs} />
          </Container>
        </Section>
      )}
    </>
  );
}
