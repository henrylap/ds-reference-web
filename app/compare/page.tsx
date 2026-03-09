import { Suspense } from "react";
import { CompareView } from "@/components/compare-view";
import { allCommands } from "@/lib/content";

export default function ComparePage() {
  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Compare Commands</h1>
        <p className="mt-2 text-sm subtle">
          Side-by-side view for similar APIs (for example merge vs join, concat vs append, groupby vs pivot table).
        </p>
      </section>
      <Suspense fallback={<section className="panel p-4 text-sm subtle">Loading compare view...</section>}>
        <CompareView commands={allCommands} />
      </Suspense>
    </div>
  );
}
