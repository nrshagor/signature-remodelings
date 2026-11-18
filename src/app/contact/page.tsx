import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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

/** Only the contact details the client has confirmed; none yet, so the panel is hidden. */
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

/** Contact: the form, plus a side panel with whatever contact details exist. */
export default function ContactPage() {
  const details = contactDetails();
  return (
    <>
      <PageHero headline={contact.headline} intro={contact.text} />
      <Section flushTop>
        <Container className={details.length > 0 ? styles.split : undefined}>
          <div className={styles.formCol}>
            <ContactForm />
          </div>
          {details.length > 0 && (
            <aside className={styles.panel} aria-label={contact.panel.label}>
              <dl>
                {details.map((d) => (
                  <div key={d.label} className={styles.row}>
                    <dt>{d.label}</dt>
                    <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </Container>
      </Section>
    </>
  );
}
