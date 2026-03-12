import Link from "next/link";
import { CommandCard } from "@/components/command-card";
import { HomePersonalized } from "@/components/home-personalized";
import { allCommands, libraries, recipeList } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="hero panel p-5 md:p-6 reveal-in">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">
          Production-ready reference
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Practical data science commands, step-by-step.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed subtle">
          Use global fuzzy search, browse by library/subtopic, inspect parameters with pitfalls,
          and copy color-highlighted code patterns you can adapt to your own datasets.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <span className="stat-chip">{libraries.length} libraries</span>
          <span className="stat-chip">{allCommands.length} commands</span>
          <span className="stat-chip">{recipeList.length} workflows</span>
          <span className="stat-chip">Official docs linked per group/API</span>
        </div>
      </section>

      <HomePersonalized commands={allCommands} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 reveal-in">
        {libraries.map((library) => (
          <article key={library.library} className="panel p-4">
            <h2 className="text-lg font-semibold">{library.title}</h2>
            <p className="mt-1 text-sm subtle">{library.commands.length} command entries</p>
            <p className="mt-3 text-sm leading-relaxed subtle">{library.overview}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {library.subtopics.slice(0, 5).map((topic) => (
                <span key={topic} className="badge">
                  {topic}
                </span>
              ))}
            </div>
            <Link
              href={`/library/${library.library}`}
              className="mt-4 inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)]"
            >
              Open {library.title}
            </Link>
          </article>
        ))}
      </section>

      <section className="space-y-3 reveal-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Command Picks</h2>
          <Link href="/cheatsheets" className="text-sm text-[var(--accent-strong)] hover:underline">
            Open cheat sheets
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {allCommands.slice(0, 10).map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </div>
      </section>

      <section className="panel p-4 reveal-in">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Workflow Library</h2>
          <Link href="/workflows" className="text-sm text-[var(--accent-strong)] hover:underline">
            View all workflows
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {recipeList.slice(0, 6).map((recipe) => (
            <article key={recipe.id} className="rounded-xl border border-[var(--border)] bg-white p-3">
              <h3 className="font-semibold">{recipe.title}</h3>
              <p className="mt-1 text-sm subtle">{recipe.goal}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

