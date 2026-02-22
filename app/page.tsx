import Auditor from "./auditor";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Auditor />
      <Toaster />
    </main>
  );
}
