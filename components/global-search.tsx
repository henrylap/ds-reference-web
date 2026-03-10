"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LIBRARY_LABELS } from "@/lib/constants";
import { normalizeSearchText } from "@/lib/search-doc";
import { loadSearchIndex } from "@/lib/search-index";
import type { LibraryId, SearchDocument } from "@/lib/types";

const SEARCH_LIMIT = 10;

export function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [query, setQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<"all" | LibraryId>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadSearchIndex()
      .then(setDocuments)
      .catch(() => {
        setDocuments([]);
      });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (libraryFilter !== "all" && doc.library !== libraryFilter) {
        return false;
      }
      if (tagFilter !== "all" && !doc.tags.includes(tagFilter)) {
        return false;
      }
      return true;
    });
  }, [documents, libraryFilter, tagFilter]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const doc of documents) {
      for (const tag of doc.tags) {
        set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [documents]);

  const fuse = useMemo(
    () =>
      new Fuse(filteredDocs, {
        keys: [
          { name: "name", weight: 0.33 },
          { name: "aliases", weight: 0.2 },
          { name: "tags", weight: 0.14 },
          { name: "subtopic", weight: 0.08 },
          { name: "summary", weight: 0.08 },
          { name: "syntax", weight: 0.07 },
          { name: "description", weight: 0.04 },
          { name: "overview", weight: 0.03 },
          { name: "parameters", weight: 0.03 }
        ],
        threshold: 0.44,
        ignoreLocation: true,
        minMatchCharLength: 1,
        includeScore: true
      }),
    [filteredDocs]
  );

  const results = useMemo(() => {
    const q = normalizeSearchText(query);
    if (!q) {
      return filteredDocs.slice(0, SEARCH_LIMIT);
    }

    const exact = filteredDocs.filter((doc) => (doc.keywords ?? "").includes(q));
    const fuzzy = fuse.search(q).map((entry) => entry.item);

    const combined = [...exact, ...fuzzy];
    const deduped: SearchDocument[] = [];
    const seen = new Set<string>();

    for (const doc of combined) {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        deduped.push(doc);
      }
      if (deduped.length >= SEARCH_LIMIT) {
        break;
      }
    }

    return deduped;
  }, [filteredDocs, fuse, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, libraryFilter, tagFilter]);

  const openResult = (index: number) => {
    const target = results[index];
    if (!target) {
      return;
    }
    setIsOpen(false);
    setQuery("");
    router.push(`/command/${target.slug}`);
  };

  return (
    <div className="relative" onBlur={() => setTimeout(() => setIsOpen(false), 120)}>
      <div className="panel flex flex-col gap-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onKeyDown={(event) => {
              if (!isOpen) {
                return;
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((current) =>
                  Math.min(current + 1, Math.max(results.length - 1, 0))
                );
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((current) => Math.max(current - 1, 0));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                openResult(activeIndex);
              }
              if (event.key === "Escape") {
                setIsOpen(false);
              }
            }}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="global-search-results"
            aria-label="Search commands"
            placeholder="Search commands, methods, and patterns... (Ctrl/Cmd + K)"
            className="min-w-[260px] flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
          />

          <select
            aria-label="Filter by library"
            value={libraryFilter}
            onChange={(event) =>
              setLibraryFilter(event.target.value as "all" | LibraryId)
            }
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="all">All libraries</option>
            {Object.entries(LIBRARY_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs subtle">
          {results.length} result{results.length === 1 ? "" : "s"} from {filteredDocs.length} filtered commands.
        </p>
      </div>

      {isOpen ? (
        <ul
          id="global-search-results"
          role="listbox"
          className="panel absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[380px] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <li className="rounded-lg px-3 py-2 text-sm subtle">No matching commands.</li>
          ) : (
            results.map((result, index) => {
              const active = index === activeIndex;

              return (
                <li key={result.id} role="option" aria-selected={active}>
                  <Link
                    href={`/command/${result.slug}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                        : "hover:bg-[var(--surface-alt)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-xs uppercase tracking-wide subtle">
                        {LIBRARY_LABELS[result.library]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs subtle">{result.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
