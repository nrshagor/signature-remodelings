// TEMPORARY (T1.3 header test): solid header. 404 in production builds. Removed after testing.
import { notFound } from "next/navigation";
import { DevHeaderContent } from "./DevHeaderContent";

export default function DevHeaderPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main id="main">
      <DevHeaderContent />
    </main>
  );
}
