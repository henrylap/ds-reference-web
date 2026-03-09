"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  showRunLocalHint?: boolean;
  runHint?: string;
}

const languageHints: Record<string, string> = {
  python: "Run locally: paste into a `.py` file and execute with `python filename.py`.",
  sql: "Run locally: execute in PostgreSQL/SQLite/DuckDB query editor after creating the toy table CTEs.",
  r: "Run locally: paste into a `.R` script or RStudio Console and execute line-by-line."
};

export function CodeBlock({
  code,
  language = "python",
  showRunLocalHint = false,
  runHint
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const hint = runHint ?? languageHints[language] ?? languageHints.python;

  return (
    <div className="panel code-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-alt)]/85 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] subtle">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs font-medium transition hover:border-[var(--accent)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="code-wrap">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          showLineNumbers
          wrapLongLines
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: "#f8fbfd",
            fontSize: "0.85rem",
            lineHeight: "1.55"
          }}
          lineNumberStyle={{
            minWidth: "2.25rem",
            color: "#8ba0af"
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {showRunLocalHint ? (
        <div className="border-t border-[var(--border)] bg-[var(--surface-alt)]/70 px-3 py-2 text-xs subtle">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
