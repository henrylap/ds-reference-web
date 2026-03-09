"use client";

import { useAppPreferences } from "@/components/app-providers";

export function FavoriteButton({ commandId }: { commandId: string }) {
  const { isFavorite, toggleFavorite } = useAppPreferences();
  const active = isFavorite(commandId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(commandId)}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          : "border-[var(--border)] bg-white hover:border-[var(--accent)]"
      }`}
    >
      {active ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
