"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppPreferences } from "@/components/app-providers";
import type { CommandEntry } from "@/lib/types";

export function HomePersonalized({ commands }: { commands: CommandEntry[] }) {
  const { favoriteIds, recentIds } = useAppPreferences();

  const commandById = useMemo(
    () => new Map(commands.map((command) => [command.id, command])),
    [commands]
  );

  const favoriteCommands = favoriteIds
    .map((id) => commandById.get(id))
    .filter((command): command is CommandEntry => Boolean(command));

  const recentCommands = recentIds
    .map((id) => commandById.get(id))
    .filter((command): command is CommandEntry => Boolean(command));

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-4">
        <h2 className="text-lg font-semibold">Bookmarks</h2>
        <p className="mt-1 text-sm subtle">Pinned commands you use often.</p>
        <ul className="mt-3 space-y-2">
          {favoriteCommands.length === 0 ? (
            <li className="text-sm subtle">No bookmarks yet. Use the bookmark button on any command.</li>
          ) : (
            favoriteCommands.map((command) => (
              <li key={command.id}>
                <Link
                  href={`/command/${command.slug}`}
                  className="block rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm hover:border-[var(--accent)]"
                >
                  <span className="font-medium">{command.name}</span>
                  <span className="ml-2 subtle">{command.subtopic}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="panel p-4">
        <h2 className="text-lg font-semibold">Recently Viewed</h2>
        <p className="mt-1 text-sm subtle">Quickly return to commands from your latest coding session.</p>
        <ul className="mt-3 space-y-2">
          {recentCommands.length === 0 ? (
            <li className="text-sm subtle">No history yet. Open a command to start tracking.</li>
          ) : (
            recentCommands.map((command) => (
              <li key={command.id}>
                <Link
                  href={`/command/${command.slug}`}
                  className="block rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm hover:border-[var(--accent)]"
                >
                  <span className="font-medium">{command.name}</span>
                  <span className="ml-2 subtle">{command.subtopic}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
