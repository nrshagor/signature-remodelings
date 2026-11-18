"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/sections/StatusPage";
import { Button } from "@/components/ui/Button";
import { errorPage } from "@/content/pages";

/**
 * Error boundary for every page (inside the root layout, so header and footer stay).
 * "Try again" re-renders the segment; the error itself is only logged to the console.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage label={errorPage.label} heading={errorPage.heading} text={errorPage.text}>
      <Button onClick={() => reset()}>{errorPage.retry}</Button>
      <Button href={errorPage.home.href} variant="secondary">
        {errorPage.home.label}
      </Button>
    </StatusPage>
  );
}
