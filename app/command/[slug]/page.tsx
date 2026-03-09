import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandTabs } from "@/components/command-tabs";
import { FavoriteButton } from "@/components/favorite-button";
import {
  getCommand,
  allCommands,
  commandLookupById,
  libraryLabels
} from "@/lib/content";

export function generateStaticParams() {
  return allCommands.map((command) => ({ slug: command.slug }));
}

export default async function CommandPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const command = getCommand(slug);

  if (!command) {
    notFound();
  }

  const relatedCommands = command.related
    .map((id) => commandLookupById.get(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map((entry) => ({ id: entry.id, slug: entry.slug, name: entry.name }));

  return (
    <div className="space-y-5">
      <section className="panel hero p-5 reveal-in">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] subtle">
              {libraryLabels[command.library]} - {command.subtopic}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{command.name}</h1>
            <p className="mt-2 text-sm leading-relaxed subtle">{command.summary}</p>
          </div>
          <FavoriteButton commandId={command.id} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-4">
            <h2 className="text-base font-semibold">Command Overview</h2>
            <p className="mt-2 text-sm subtle">{command.overview}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-4">
            <h2 className="text-base font-semibold">Where to Use It</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {command.applications.map((application) => (
                <li key={application}>{application}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {command.tags.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>

        {relatedCommands.length > 0 ? (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide subtle">
              Compare with related commands
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedCommands.map((related) => (
                <Link
                  key={related.id}
                  href={`/compare?left=${command.slug}&right=${related.slug}`}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm hover:border-[var(--accent)]"
                >
                  {command.name} vs {related.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <CommandTabs command={command} relatedCommands={relatedCommands} />
    </div>
  );
}
