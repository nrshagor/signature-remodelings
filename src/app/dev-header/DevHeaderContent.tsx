// TEMPORARY (T1.3 header test): tall page built from real copy. Removed after testing.
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { home, processSteps } from "@/content/pages";
import { services } from "@/content/services";

export function DevHeaderContent() {
  const blocks = [
    ...services.map((s) => ({ title: s.headline, text: s.intro })),
    ...home.whyUs.items,
    ...processSteps.map((p) => ({ title: p.title, text: p.detail })),
  ];
  return (
    <>
      {blocks.map((b, i) => (
        <Section key={b.title} tone={i % 2 ? "stone" : "paper"}>
          <Container>
            <Heading level={2}>{b.title}</Heading>
            <p style={{ marginTop: 16 }}>{b.text}</p>
          </Container>
        </Section>
      ))}
    </>
  );
}
