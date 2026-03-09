"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import type { CommandEntry } from "@/lib/types";
import { LIBRARY_LABELS } from "@/lib/constants";

function CommandSummaryCard({ command }: { command?: CommandEntry }) {
  if (!command) {
    return (
      <article className="panel p-4">
        <p className="text-sm subtle">Select a command.</p>
      </article>
    );
  }

  return (
    <article className="panel p-4">
      <p className="text-xs uppercase tracking-[0.14em] subtle">
        {LIBRARY_LABELS[command.library]} - {command.subtopic}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{command.name}</h3>
      <p className="mt-2 text-sm subtle">{command.summary}</p>

      <div className="mt-3">
        <CodeBlock code={command.syntax} language="python" />
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3 text-sm">
        <p>
          <strong>Return:</strong> {command.returns.type}
          {command.returns.shape ? ` (${command.returns.shape})` : ""}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide subtle">
          Key Parameters
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {command.parameters.slice(0, 5).map((parameter) => (
            <li key={parameter.name}>
              <span className="font-mono">{parameter.name}</span>: {parameter.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide subtle">
          Official Docs
        </p>
        <ul className="mt-1 space-y-1 text-sm">
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
    </article>
  );
}

export function CompareView({ commands }: { commands: CommandEntry[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLeft = searchParams.get("left") ?? commands[0]?.slug ?? "";
  const initialRight =
    searchParams.get("right") ?? commands[1]?.slug ?? commands[0]?.slug ?? "";

  const [leftSlug, setLeftSlug] = useState(initialLeft);
  const [rightSlug, setRightSlug] = useState(initialRight);

  const commandMap = useMemo(
    () => new Map(commands.map((command) => [command.slug, command])),
    [commands]
  );

  const left = commandMap.get(leftSlug);
  const right = commandMap.get(rightSlug);

  const syncUrl = (nextLeft: string, nextRight: string) => {
    const params = new URLSearchParams();
    if (nextLeft) {
      params.set("left", nextLeft);
    }
    if (nextRight) {
      params.set("right", nextRight);
    }
    router.replace(`/compare?${params.toString()}`);
  };

  return (
    <section className="space-y-4">
      <div className="panel grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide subtle">
            Left command
          </span>
          <select
            value={leftSlug}
            onChange={(event) => {
              const next = event.target.value;
              setLeftSlug(next);
              syncUrl(next, rightSlug);
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          >
            {commands.map((command) => (
              <option key={`left-${command.id}`} value={command.slug}>
                {command.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide subtle">
            Right command
          </span>
          <select
            value={rightSlug}
            onChange={(event) => {
              const next = event.target.value;
              setRightSlug(next);
              syncUrl(leftSlug, next);
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          >
            {commands.map((command) => (
              <option key={`right-${command.id}`} value={command.slug}>
                {command.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CommandSummaryCard command={left} />
        <CommandSummaryCard command={right} />
      </div>
    </section>
  );
}

