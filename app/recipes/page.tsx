import { RecipeWorkflowCard } from "@/components/recipe-workflow-card";
import { recipeList, libraryLabels } from "@/lib/content";

export default function RecipesPage() {
  const featureEngineeringRecipes = recipeList.filter((recipe) =>
    recipe.tags.includes("feature-engineering")
  );

  const otherRecipes = recipeList.filter(
    (recipe) => !recipe.tags.includes("feature-engineering")
  );

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
        <p className="mt-2 text-sm subtle">
          End-to-end patterns that combine multiple libraries for common DS workflows.
        </p>
        <p className="mt-1 text-xs subtle">
          New: interactive checklist + visual workflow previews to help you adapt each pattern quickly.
        </p>
      </section>

      {featureEngineeringRecipes.length > 0 ? (
        <section className="space-y-3">
          <article className="panel p-4">
            <h2 className="text-xl font-semibold">Feature Engineering Playbook</h2>
            <p className="mt-2 text-sm subtle">
              Step-by-step tutorials for designing, validating, and productionizing strong features
              across numeric, categorical, datetime, and aggregated event data.
            </p>
          </article>

          {featureEngineeringRecipes.map((recipe) => (
            <RecipeWorkflowCard
              key={recipe.id}
              recipe={recipe}
              libraryLabels={libraryLabels}
            />
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        <article className="panel p-4">
          <h2 className="text-xl font-semibold">All Other Workflows</h2>
          <p className="mt-1 text-sm subtle">
            Complete examples for EDA, modeling, forecasting, experimentation, and deployment
            handoffs.
          </p>
        </article>

        {otherRecipes.map((recipe) => (
          <RecipeWorkflowCard
            key={recipe.id}
            recipe={recipe}
            libraryLabels={libraryLabels}
          />
        ))}
      </section>
    </div>
  );
}
