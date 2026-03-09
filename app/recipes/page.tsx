import { CodeBlock } from "@/components/code-block";
import { recipeList, libraryLabels } from "@/lib/content";

export default function RecipesPage() {
  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
        <p className="mt-2 text-sm subtle">
          End-to-end patterns that combine multiple libraries for common DS workflows.
        </p>
      </section>

      {recipeList.map((recipe) => (
        <article key={recipe.id} className="panel p-4 md:p-5">
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          <p className="mt-1 text-sm subtle">{recipe.goal}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {recipe.libraries.map((library) => (
              <span key={library} className="badge">
                {libraryLabels[library]}
              </span>
            ))}
            {recipe.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide subtle">Steps</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3 text-sm">
                <strong>Output hint:</strong> {recipe.outputHint}
              </p>
            </div>

            <div>
              <CodeBlock code={recipe.code} language="python" showRunLocalHint={true} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
