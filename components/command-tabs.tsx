"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { useAppPreferences } from "@/components/app-providers";
import type { CommandEntry } from "@/lib/types";

type TabId = "overview" | "parameters" | "examples" | "notes";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "parameters", label: "Parameters" },
  { id: "examples", label: "Examples" },
  { id: "notes", label: "Notes" }
];

interface RelatedCommand {
  id: string;
  slug: string;
  name: string;
}

function codeLanguageForLibrary(library: CommandEntry["library"]) {
  if (library === "sql") {
    return "sql";
  }
  if (library === "rstudio") {
    return "r";
  }
  return "python";
}

function runHintForLibrary(library: CommandEntry["library"]) {
  if (library === "sql") {
    return "Run locally: execute in PostgreSQL/SQLite/DuckDB query editor after creating the toy table CTEs.";
  }
  if (library === "rstudio") {
    return "Run locally: paste into a `.R` script or RStudio Console and execute line-by-line.";
  }
  return "Run locally: paste into a `.py` file and execute with `python filename.py`.";
}

export function CommandTabs({
  command,
  relatedCommands
}: {
  command: CommandEntry;
  relatedCommands: RelatedCommand[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { pushRecent } = useAppPreferences();

  useEffect(() => {
    pushRecent(command.id);
  }, [command.id, pushRecent]);

  const parameterRows = useMemo(
    () =>
      command.parameters.map((parameter) => ({
        ...parameter,
        defaultValue: parameter.default ?? "none"
      })),
    [command.parameters]
  );

  const codeLanguage = codeLanguageForLibrary(command.library);
  const runHint = runHintForLibrary(command.library);

  return (
    <section className="panel overflow-hidden reveal-in">
      <div className="tab-strip border-b border-[var(--border)] p-2">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-[var(--accent-strong)] shadow-sm"
                  : "text-[var(--muted)] hover:bg-white/80"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 md:p-5">
        {activeTab === "overview" ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold">Basic Syntax</h3>
              <div className="mt-2">
                <CodeBlock code={command.syntax} language={codeLanguage} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                <h3 className="text-base font-semibold">Overview</h3>
                <p className="mt-2 text-sm leading-relaxed">{command.overview}</p>
              </article>

              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                <h3 className="text-base font-semibold">Applications</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {command.applications.map((application) => (
                    <li key={application}>{application}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div>
              <h3 className="text-base font-semibold">Detailed Description</h3>
              <p className="mt-2 text-sm leading-relaxed">{command.description}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold">Return Value</h3>
              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3 text-sm">
                <p>
                  <strong>Type:</strong> {command.returns.type}
                </p>
                {command.returns.shape ? (
                  <p className="mt-1">
                    <strong>Shape:</strong> {command.returns.shape}
                  </p>
                ) : null}
                <p className="mt-1">{command.returns.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">Official Docs</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {command.docs.map((doc) => (
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
            </div>
          </div>
        ) : null}

        {activeTab === "parameters" ? (
          <div className="space-y-3">
            {parameterRows.length === 0 ? (
              <p className="text-sm subtle">No parameter details were provided for this command yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[900px] overflow-hidden rounded-xl border border-[var(--border)]">
                  <div className="grid grid-cols-[1.2fr_1fr_0.9fr_2fr_1.8fr_1.8fr] gap-3 border-b border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-semibold uppercase tracking-wide subtle">
                    <span>Parameter</span>
                    <span>Type</span>
                    <span>Default</span>
                    <span>Meaning</span>
                    <span>Possible Values</span>
                    <span>Pitfalls and Notes</span>
                  </div>

                  {parameterRows.map((parameter, index) => {
                    const values = parameter.values ?? [];
                    const pitfalls = parameter.pitfalls ?? [];

                    return (
                      <article
                        key={parameter.name}
                        className={`grid grid-cols-[1.2fr_1fr_0.9fr_2fr_1.8fr_1.8fr] gap-3 px-3 py-3 text-sm ${
                          index % 2 === 0 ? "bg-white/70" : "bg-[var(--surface-alt)]/55"
                        } ${index !== parameterRows.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                      >
                        <div>
                          <p className="font-mono text-xs md:text-sm">{parameter.name}</p>
                        </div>

                        <div>
                          <span className="inline-flex rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs font-medium">
                            {parameter.type}
                          </span>
                        </div>

                        <div>
                          <span className="inline-flex rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs font-medium">
                            {parameter.defaultValue}
                          </span>
                        </div>

                        <p className="leading-relaxed">{parameter.description}</p>

                        <div className="space-y-1">
                          {values.length === 0 ? (
                            <p className="text-xs subtle">No constrained values; follow API defaults.</p>
                          ) : (
                            values.map((value) => (
                              <span
                                key={value}
                                className="mr-1 inline-flex rounded-md border border-[var(--border)] bg-white px-2 py-0.5 text-xs"
                              >
                                {value}
                              </span>
                            ))
                          )}
                        </div>

                        <div>
                          {pitfalls.length === 0 ? (
                            <p className="text-xs subtle">No common pitfalls listed.</p>
                          ) : (
                            <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm leading-relaxed">
                              {pitfalls.map((pitfall) => (
                                <li key={pitfall}>{pitfall}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-xs subtle">
              Parameter behavior can vary by library version and data shape. Verify defaults in official docs when moving to production.
            </p>
          </div>
        ) : null}

        {activeTab === "examples" ? (
          <div className="space-y-6">
            {command.examples.map((example, index) => (
              <article key={`${example.title}-${index}`} className="space-y-3 rounded-xl border border-[var(--border)] bg-white/75 p-4">
                <div>
                  <h3 className="text-base font-semibold">{example.title}</h3>
                  <p className="mt-1 text-sm subtle">{example.scenario}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] subtle">Step-by-step</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
                    {example.walkthrough.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <CodeBlock
                  code={example.code}
                  language={codeLanguage}
                  showRunLocalHint={true}
                  runHint={runHint}
                />

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide subtle">
                    Expected Output
                  </p>
                  <pre className="mt-1 overflow-x-auto text-xs md:text-sm">
                    {example.expectedOutput}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === "notes" ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold">Practical Notes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {command.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold">Related Commands</h3>
              {relatedCommands.length === 0 ? (
                <p className="mt-2 text-sm subtle">No related commands linked yet.</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {relatedCommands.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/command/${related.slug}`}
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm hover:border-[var(--accent)]"
                      >
                        {related.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
