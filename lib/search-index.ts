import type { SearchDocument } from "@/lib/types";

export async function loadSearchIndex(): Promise<SearchDocument[]> {
  const response = await fetch("/search-index.json", { cache: "force-cache" });

  if (!response.ok) {
    throw new Error("Failed to load search index");
  }

  const data = (await response.json()) as SearchDocument[];
  return data;
}
