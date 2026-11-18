import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { services } from "@/content/services";
import { site } from "@/content/site";
import styles from "./Footer.module.css";

/** Footer: shows only the contact fields that exist in site.ts. */
export function Footer() {
  const { phone, email, address, hours } = site.contact;
  const contactItems = [
    phone && { key: "phone", node: <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a> },
    email && { key: "email", node: <a href={`mailto:${email}`}>{email}</a> },
    address && { key: "address", node: <span>{address}</span> },
    hours && { key: "hours", node: <span>{hours}</span> },
    site.serviceAreaLine && { key: "area", node: <span>{site.serviceAreaLine}</span> },
  ].filter((item): item is { key: string; node: React.JSX.Element } => Boolean(item));

  // Build-time year: the site is static, so it updates on the next deploy.
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink} aria-label={`${site.name} home`}>
              <Wordmark onDark />
            </Link>
            <p className={styles.description}>{site.description}</p>
          </div>

          <nav aria-label="Footer" className={styles.columns}>
            <div className={styles.column}>
              <h2 className={styles.heading}>Services</h2>
              <ul role="list" className={styles.list}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <h2 className={styles.heading}>Company</h2>
              <ul role="list" className={styles.list}>
                {site.companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {contactItems.length > 0 && (
              <div className={styles.column}>
                <h2 className={styles.heading}>Contact</h2>
                <ul role="list" className={styles.list}>
                  {contactItems.map((item) => (
                    <li key={item.key}>{item.node}</li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {site.legalName ?? site.name}
          </p>
          {site.hasPrivacyPolicy && (
            <p>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
