import Auditor from "./auditor";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Auditor />
      <section className="border-t px-6 py-8 max-w-2xl mx-auto text-center text-sm text-muted-foreground">
        <h2 className="text-base font-medium text-foreground mb-3">
          SEO Auditor
        </h2>
        <p className="mb-3">
          Audit on-page SEO for any website. Analyze titles, meta tags,
          headings, and more.
        </p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          <li>Comprehensive checks</li>
          <li>Real-time streaming</li>
          <li>Export reports</li>
        </ul>
      </section>
      <Toaster />
    </main>
  );
}
