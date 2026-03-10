import type { LibraryId, SearchDocument } from "@/lib/types";

const VALID_LIBRARIES: LibraryId[] = [
  "python",
  "numpy",
  "pandas",
  "sklearn",
  "matplotlib",
  "seaborn",
  "sql",
  "rstudio"
];

function isLibraryId(value: unknown): value is LibraryId {
  return typeof value === "string" && VALID_LIBRARIES.includes(value as LibraryId);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeSearchDocument(value: unknown): SearchDocument | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SearchDocument>;
  if (!candidate.id || !candidate.slug || !candidate.name || !isLibraryId(candidate.library)) {
    return null;
  }

  const tags = asStringArray(candidate.tags);
  const aliases = asStringArray(candidate.aliases);
  const parameters = asStringArray(candidate.parameters);
  const applications = asStringArray(candidate.applications);

  const fallbackKeywords = [
    candidate.id,
    candidate.slug,
    candidate.name,
    candidate.subtopic,
    candidate.summary,
    ...tags,
    ...aliases,
    ...parameters
  ]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .toLowerCase();

  return {
    id: candidate.id,
    slug: candidate.slug,
    name: candidate.name,
    library: candidate.library,
    subtopic: asString(candidate.subtopic),
    tags,
    summary: asString(candidate.summary),
    syntax: asString(candidate.syntax),
    description: asString(candidate.description),
    overview: asString(candidate.overview),
    applications,
    parameters,
    aliases,
    keywords: asString(candidate.keywords) || fallbackKeywords
  };
}

export async function loadSearchIndex(): Promise<SearchDocument[]> {
  const response = await fetch("/search-index.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load search index");
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => normalizeSearchDocument(item))
    .filter((item): item is SearchDocument => item !== null);
}

