"use client";

import { useEffect, useMemo, useState } from "react";
import { RecipeWorkflowCard } from "@/components/recipe-workflow-card";
import type { LibraryId, Recipe } from "@/lib/types";

type WorkflowTabId =
  | "all"
  | "feature-engineering"
  | "eda"
  | "visualization"
  | "modeling"
  | "customer-analytics"
  | "data-prep";

const workflowTabs: { id: WorkflowTabId; label: string; description: string }[] = [
  {
    id: "all",
    label: "All",
    description: "Browse every workflow in one indexed list."
  },
  {
    id: "feature-engineering",
    label: "Feature Engineering",
    description: "Feature design, leakage controls, and transformation patterns."
  },
  {
    id: "eda",
    label: "EDA",
    description: "Structured exploratory analysis pipelines for new datasets."
  },
    {
    id: "visualization",
    label: "Visualization",
    description: "Beautiful chart design, dashboard layout, and visual storytelling workflows."
  },{
    id: "modeling",
    label: "Modeling",
    description: "Train/evaluate/predict workflows across classification and regression tasks."
  },
  {
    id: "customer-analytics",
    label: "Customer Analytics",
    description: "A/B testing, segmentation, pricing, and ROI-oriented workflows."
  },
  {
    id: "data-prep",
    label: "Data Prep",
    description: "Import, cleaning, joins, reshaping, and table prep workflows."
  }
];

function hasAnyTag(recipe: Recipe, tags: string[]) {
  return tags.some((tag) => recipe.tags.includes(tag));
}

function recipesForTab(recipes: Recipe[], tabId: WorkflowTabId): Recipe[] {
  if (tabId === "all") {
    return recipes;
  }

  if (tabId === "feature-engineering") {
    return recipes.filter((recipe) =>
      hasAnyTag(recipe, ["feature-engineering", "tutorial", "leakage", "categorical", "time-series", "aggregation"])
    );
  }

  if (tabId === "eda") {
    return recipes.filter((recipe) => hasAnyTag(recipe, ["eda", "distribution", "outliers", "step-by-step"]));
  }

  if (tabId === "visualization") {
    return recipes.filter((recipe) =>
      hasAnyTag(recipe, ["visualization", "dashboard", "storytelling", "chart-design", "interactive"])
    );
  }

  if (tabId === "modeling") {
    return recipes.filter((recipe) =>
      hasAnyTag(recipe, ["modeling", "classification", "regression", "forecasting", "evaluation", "baseline"])
    );
  }

  if (tabId === "customer-analytics") {
    return recipes.filter((recipe) =>
      hasAnyTag(recipe, ["ab-testing", "segmentation", "pricing", "roi", "customer-analytics", "statistics", "kmeans"])
    );
  }

  return recipes.filter((recipe) =>
    hasAnyTag(recipe, ["etl", "join", "data-wrangling", "reporting", "aggregation", "preprocessing"])
  );
}

export function WorkflowsBrowser({
  recipes,
  labels
}: {
  recipes: Recipe[];
  labels: Record<LibraryId, string>;
}) {
  const [activeTab, setActiveTab] = useState<WorkflowTabId>("all");
  const tabRecipes = useMemo(() => recipesForTab(recipes, activeTab), [activeTab, recipes]);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(tabRecipes[0]?.id ?? null);

  useEffect(() => {
    if (tabRecipes.length === 0) {
      setActiveRecipeId(null);
      return;
    }

    if (!activeRecipeId || !tabRecipes.some((recipe) => recipe.id === activeRecipeId)) {
      setActiveRecipeId(tabRecipes[0].id);
    }
  }, [activeRecipeId, tabRecipes]);

  const activeRecipe =
    tabRecipes.find((recipe) => recipe.id === activeRecipeId) ?? (tabRecipes.length > 0 ? tabRecipes[0] : null);

  const activeTabMeta = workflowTabs.find((tab) => tab.id === activeTab) ?? workflowTabs[0];

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Workflows</h1>
        <p className="mt-2 text-sm subtle">
          Indexed, end-to-end data science workflows with interactive checklists, visuals, and runnable code.
        </p>
      </section>

      <section className="panel p-3">
        <div className="flex flex-wrap gap-2">
          {workflowTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-[var(--accent)] bg-white text-[var(--accent-strong)]"
                    : "border-[var(--border)] bg-white/70 text-[var(--muted)] hover:border-[var(--accent)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs subtle">{activeTabMeta.description}</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="panel p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Workflow Index</h2>
            <span className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs">
              {tabRecipes.length} items
            </span>
          </div>

          {tabRecipes.length === 0 ? (
            <p className="mt-3 text-sm subtle">No workflows match this tab yet.</p>
          ) : (
            <div className="mt-3 max-h-[72vh] space-y-2 overflow-y-auto pr-1">
              {tabRecipes.map((recipe, index) => {
                const isActive = recipe.id === activeRecipe?.id;
                return (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setActiveRecipeId(recipe.id)}
                    className={`w-full rounded-lg border p-2.5 text-left transition ${
                      isActive
                        ? "border-[var(--accent)] bg-white"
                        : "border-[var(--border)] bg-white/75 hover:border-[var(--accent)]"
                    }`}
                  >
                    <p className="text-xs subtle">{index + 1}</p>
                    <p className="mt-1 text-sm font-medium leading-snug">{recipe.title}</p>
                    <p className="mt-1 text-xs subtle">{recipe.tags.slice(0, 4).join(" · ")}</p>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <div>
          {activeRecipe ? (
            <RecipeWorkflowCard recipe={activeRecipe} libraryLabels={labels} />
          ) : (
            <section className="panel p-4">
              <p className="text-sm subtle">Select a tab to start exploring workflows.</p>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}



