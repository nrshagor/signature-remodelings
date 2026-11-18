import type { Metadata } from "next";
import { StatusPage } from "@/components/sections/StatusPage";
import { Button } from "@/components/ui/Button";
import { notFound } from "@/content/pages";

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false, follow: false },
};

/** 404 for unknown URLs and unknown service/project slugs. */
export default function NotFound() {
  return (
    <StatusPage label={notFound.label} heading={notFound.heading}>
      <Button href={notFound.primary.href}>{notFound.primary.label}</Button>
      <Button href={notFound.secondary.href} variant="secondary">
        {notFound.secondary.label}
      </Button>
    </StatusPage>
  );
}
