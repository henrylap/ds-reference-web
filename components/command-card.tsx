import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import type { CommandEntry } from "@/lib/types";
import { libraryLabels } from "@/lib/content";

export function CommandCard({ command }: { command: CommandEntry }) {
  return (
    <article className="command-card panel p-4 transition reveal-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] subtle">
            {libraryLabels[command.library]} - {command.subtopic}
          </p>
          <h3 className="text-lg font-semibold leading-tight">
            <Link href={`/command/${command.slug}`} className="hover:text-[var(--accent)]">
              {command.name}
            </Link>
          </h3>
        </div>
        <FavoriteButton commandId={command.id} />
      </div>

      <p className="mt-2 text-sm subtle">{command.summary}</p>
      <p className="mt-3 rounded-lg bg-[var(--surface-alt)] px-2 py-1 font-mono text-xs">
        {command.syntax}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="badge">{command.level}</span>
        {command.tags.slice(0, 5).map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
