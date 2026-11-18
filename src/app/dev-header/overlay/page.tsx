// TEMPORARY (T1.3 header test): transparent header over a dark hero block. 404 in
// production builds. Removed after testing.
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { home } from "@/content/pages";
import { DevHeaderContent } from "../DevHeaderContent";

export default function DevHeaderOverlayPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main id="main">
      <Section tone="ink">
        <Container>
          <div style={{ minHeight: "70vh", display: "flex", alignItems: "flex-end" }}>
            <Heading level={1}>{home.hero.headline}</Heading>
          </div>
        </Container>
      </Section>
      <DevHeaderContent />
    </main>
  );
}
