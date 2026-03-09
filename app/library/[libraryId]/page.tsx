import { notFound } from "next/navigation";
import Link from "next/link";
import { CommandCard } from "@/components/command-card";
import { CodeBlock } from "@/components/code-block";
import {
  getLibrary,
  groupCommandsBySubtopic,
  libraries,
  commandLookupById
} from "@/lib/content";
import type { LibraryId } from "@/lib/types";

const vizStyleSnippets: Record<string, string> = {
  matplotlib: `import matplotlib.pyplot as plt\n\nplt.style.use('seaborn-v0_8-whitegrid')\nfig, ax = plt.subplots(figsize=(9, 5), dpi=130)\n\nax.plot(months, revenue, color='#0f7a84', linewidth=2.8, marker='o')\nax.set_title('Monthly Revenue Trend', fontsize=15, weight='bold')\nax.set_xlabel('Month')\nax.set_ylabel('Revenue (k USD)')\nax.grid(alpha=0.28)\nax.set_facecolor('#f7fbff')\nfig.patch.set_facecolor('#eaf3f6')\n\nplt.tight_layout()`,
  seaborn: `import seaborn as sns\nimport matplotlib.pyplot as plt\n\nsns.set_theme(style='whitegrid', context='talk', palette='Set2')\n\nax = sns.lineplot(data=df, x='month', y='revenue_k', hue='channel', marker='o')\nax.set_title('Revenue by Channel')\nax.set_xlabel('Month')\nax.set_ylabel('Revenue (k USD)')\n\nsns.move_legend(ax, 'upper left', frameon=True)\nax.figure.set_facecolor('#edf5f8')\nplt.tight_layout()`
};

export function generateStaticParams() {
  return libraries.map((library) => ({ libraryId: library.library }));
}

export default async function LibraryPage({
  params
}: {
  params: Promise<{ libraryId: string }>;
}) {
  const { libraryId } = await params;
  const library = getLibrary(libraryId as LibraryId);

  if (!library) {
    notFound();
  }

  const grouped = groupCommandsBySubtopic(library.commands);

  return (
    <div className="space-y-5">
      <section className="panel hero p-5 reveal-in">
        <p className="text-xs uppercase tracking-[0.18em] subtle">Library</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{library.title}</h1>
        <p className="mt-2 text-sm leading-relaxed subtle">{library.overview}</p>
        <p className="mt-2 text-sm subtle">
          Source of truth:{" "}
          <a
            href={library.officialDocs}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent-strong)] hover:underline"
          >
            {library.officialDocs}
          </a>
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-4">
            <h2 className="text-base font-semibold">Key Applications</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {library.applications.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-4">
            <h2 className="text-base font-semibold">Coverage Snapshot</h2>
            <p className="mt-2 text-sm subtle">{library.commands.length} command references with parameter index, examples, and official docs links.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {library.subtopics.slice(0, 6).map((topic) => (
                <span key={topic} className="badge">{topic}</span>
              ))}
            </div>
          </article>
        </div>

        {library.library === "matplotlib" || library.library === "seaborn" ? (
          <article className="mt-4 rounded-xl border border-[var(--border)] bg-white/75 p-4">
            <h2 className="text-base font-semibold">Beautiful Chart Defaults Starter</h2>
            <p className="mt-1 text-sm subtle">Use this styling baseline for stakeholder-ready charts, then adapt palette/labels to your brand.</p>
            <div className="mt-3">
              <CodeBlock
                code={vizStyleSnippets[library.library]}
                language="python"
                showRunLocalHint={true}
              />
            </div>
          </article>
        ) : null}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {library.commandGroups.map((group) => (
            <article
              key={group.name}
              className="rounded-xl border border-[var(--border)] bg-white/80 p-3"
            >
              <h2 className="text-base font-semibold">{group.name}</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {group.docs.map((doc) => (
                  <li key={doc.url}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--accent-strong)] underline-offset-2 hover:underline"
                    >
                      {doc.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs subtle">
                {group.commandIds.length} commands in this group
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-4 reveal-in">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Cheat Sheet</h2>
          <Link
            href="/cheatsheets"
            className="text-sm text-[var(--accent-strong)] hover:underline"
          >
            Open all cheat sheets
          </Link>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {library.cheatSheet.map((commandId) => {
            const command = commandLookupById.get(commandId);
            if (!command) {
              return null;
            }
            return (
              <li key={command.id}>
                <Link
                  href={`/command/${command.slug}`}
                  className="block rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm hover:border-[var(--accent)]"
                >
                  <span className="font-medium">{command.name}</span>
                  <span className="ml-2 subtle">{command.syntax}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {library.subtopics.map((subtopic) => {
        const commands = grouped[subtopic] ?? [];
        if (commands.length === 0) {
          return null;
        }

        return (
          <section key={subtopic} className="space-y-3 reveal-in">
            <h2 className="text-xl font-semibold">{subtopic}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {commands.map((command) => (
                <CommandCard key={command.id} command={command} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="panel p-4 reveal-in">
        <h2 className="text-xl font-semibold">Coverage Expansion Outline</h2>
        <p className="mt-1 text-sm subtle">
          Planned topics help scale from the seeded set to most frequently used APIs.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {library.coverageOutline.map((topic) => (
            <article
              key={topic.topic}
              className="rounded-xl border border-[var(--border)] bg-white p-3"
            >
              <p className="text-sm font-semibold">{topic.topic}</p>
              <p className="mt-1 text-xs">
                <a
                  href={topic.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent-strong)] hover:underline"
                >
                  Official docs
                </a>
              </p>
              <p className="mt-1 text-xs subtle">Status: {topic.status}</p>
              <p className="mt-2 text-xs subtle">
                High usage APIs: {topic.highUsageApis.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
