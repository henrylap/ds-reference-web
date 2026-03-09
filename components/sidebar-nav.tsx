"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LibraryContent } from "@/lib/types";
import { LIBRARY_COLORS } from "@/lib/constants";

function groupedBySubtopic(library: LibraryContent) {
  return library.commands.reduce<Record<string, typeof library.commands>>(
    (acc, command) => {
      if (!acc[command.subtopic]) {
        acc[command.subtopic] = [];
      }
      acc[command.subtopic].push(command);
      return acc;
    },
    {}
  );
}

export function SidebarNav({ libraries }: { libraries: LibraryContent[] }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar overflow-y-auto p-4 md:p-5">
      <div className="rounded-2xl border border-[var(--border)] bg-white/75 p-4 backdrop-blur-md">
        <Link href="/" className="block">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Interactive Index
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
            DS Reference
          </h1>
        </Link>

        <p className="mt-3 text-sm subtle">
          Search-first reference with practical examples, parameter indexes, and step-by-step logic.
        </p>
      </div>

      <nav aria-label="Reference navigation" className="mt-4 space-y-3">
        {libraries.map((library) => {
          const inLibrary =
            pathname?.startsWith(`/library/${library.library}`) || false;
          const grouped = groupedBySubtopic(library);

          return (
            <details
              key={library.library}
              className="panel overflow-hidden"
              open={inLibrary}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-medium">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: LIBRARY_COLORS[library.library] }}
                />
                <span className="flex-1 text-left">{library.title}</span>
                <span className="subtle text-xs">{library.commands.length}</span>
              </summary>

              <div className="border-t border-[var(--border)] px-2 py-2">
                {library.subtopics.map((subtopic) => {
                  const commands = grouped[subtopic] ?? [];
                  if (commands.length === 0) {
                    return null;
                  }

                  return (
                    <details key={subtopic} className="mb-1 last:mb-0" open={inLibrary}>
                      <summary className="cursor-pointer rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] hover:bg-[var(--surface-alt)]">
                        {subtopic}
                      </summary>
                      <ul className="mt-1 space-y-1 pl-1">
                        {commands.map((command) => {
                          const href = `/command/${command.slug}`;
                          const active = pathname === href;

                          return (
                            <li key={command.id}>
                              <Link
                                href={href}
                                className={`block rounded px-2 py-1 text-sm transition ${
                                  active
                                    ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                                    : "hover:bg-[var(--surface-alt)]"
                                }`}
                              >
                                {command.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}
