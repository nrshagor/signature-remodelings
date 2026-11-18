import type { ContentStatus } from "./types";

export interface FaqItem {
  question: string;
  /** Undefined until the client answers; the question stays hidden until then. */
  answer?: string;
  /** Status of the answer. Only "confirmed" answers go into FAQ JSON-LD. */
  status?: ContentStatus;
}

export const faqs: FaqItem[] = [
  { question: "What areas do you serve?" },
  { question: "Do you offer free consultations or estimates?" },
  {
    question: "How long does a kitchen or bathroom remodel take?",
    answer:
      "It depends on the size and scope of the project. You'll get a timeline with your plan before work starts.",
    status: "draft",
  },
  {
    question: "Can I stay in my home during the remodel?",
    answer: "Usually, depending on the project. We'll talk through what to expect for yours.",
    status: "draft", // client to confirm
  },
  { question: "Do you handle permits?" },
  { question: "Are you licensed and insured?" },
  {
    question: "Do you work with real estate investors?",
    answer:
      "Yes. Our home flipping service is built for investors who want a property remodeled and ready for market.",
    status: "draft",
  },
  {
    question: "Can you add a second floor to my house?",
    answer:
      "Often, yes — it depends on the structure. We assess the home first and tell you what's possible.",
    status: "draft", // client to confirm
  },
];

export type AnsweredFaq = FaqItem & { answer: string; status: ContentStatus };

/** Questions with an answer (draft or confirmed); the rest stay hidden. */
export function visibleFaqs(): AnsweredFaq[] {
  return faqs.filter((f): f is AnsweredFaq => Boolean(f.answer && f.status));
}

/** schema.org FAQPage for confirmed answers only; undefined when none are confirmed. */
export function faqJsonLd() {
  const confirmed = faqs.filter((f) => f.answer && f.status === "confirmed");
  if (confirmed.length === 0) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: confirmed.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
