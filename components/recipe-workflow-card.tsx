"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import type { LibraryId, Recipe } from "@/lib/types";

function recipeLanguage(libraries: LibraryId[]): string {
  const pythonLike: LibraryId[] = [
    "python",
    "numpy",
    "pandas",
    "sklearn",
    "matplotlib",
    "seaborn"
  ];
  if (libraries.some((library) => pythonLike.includes(library))) {
    return "python";
  }
  if (libraries.includes("rstudio")) {
    return "r";
  }
  if (libraries.includes("sql")) {
    return "sql";
  }
  return "python";
}

function RecipeMiniChart({ tags, scale }: { tags: string[]; scale: number }) {
  const tagSet = new Set(tags.map((tag) => tag.toLowerCase()));

  const variant =
    tagSet.has("ab-testing")
      ? "ab"
      : tagSet.has("pricing")
        ? "pricing"
        : tagSet.has("segmentation") || tagSet.has("kmeans")
          ? "segmentation"
          : tagSet.has("time-series") || tagSet.has("forecasting")
            ? "forecast"
            : tagSet.has("classification") || tagSet.has("churn")
              ? "classification"
              : tagSet.has("regression")
                ? "regression"
                : "pipeline";

  if (variant === "ab") {
    const control = 18 + scale;
    const test = control + 2 + scale * 0.7;
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        <rect x="40" y={130 - control * 4} width="70" height={control * 4} fill="#8db9c8" rx="4" />
        <rect x="140" y={130 - test * 4} width="70" height={test * 4} fill="#2c8f76" rx="4" />
        <text x="50" y="145" fontSize="11" fill="#4d6572">Control</text>
        <text x="155" y="145" fontSize="11" fill="#4d6572">Test</text>
        <text x="232" y="70" fontSize="11" fill="#1a3f4d">Lift +{(test - control).toFixed(1)}pp</text>
      </svg>
    );
  }

  if (variant === "pricing") {
    const peakX = 110 + scale * 12;
    const peakY = 36 - scale * 2;
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        <polyline
          points={`20,125 60,98 ${peakX},${peakY} 220,62 290,115`}
          fill="none"
          stroke="#1b6f5e"
          strokeWidth="3"
        />
        <line x1={peakX} y1={peakY} x2={peakX} y2="130" stroke="#b04f2f" strokeDasharray="4 3" />
        <circle cx={peakX} cy={peakY} r="4" fill="#b04f2f" />
        <text x={peakX + 6} y={peakY - 6} fontSize="11" fill="#1a3f4d">Best Price</text>
      </svg>
    );
  }

  if (variant === "segmentation") {
    const spread = 4 + scale;
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        {[0, 1, 2].map((cluster) => {
          const baseX = 65 + cluster * 90;
          const baseY = cluster % 2 === 0 ? 70 : 92;
          const color = ["#2f4f8a", "#2c8f76", "#a55320"][cluster];
          return [0, 1, 2, 3].map((point) => (
            <circle
              key={`${cluster}-${point}`}
              cx={baseX + point * spread}
              cy={baseY + (point % 2 === 0 ? -spread : spread)}
              r="5"
              fill={color}
              opacity="0.88"
            />
          ));
        })}
      </svg>
    );
  }

  if (variant === "forecast") {
    const bump = scale * 2;
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        <polyline
          points={`16,108 52,96 88,102 124,84 160,89 196,72 232,66 268,58 304,54`}
          fill="none"
          stroke="#356a91"
          strokeWidth="3"
        />
        <polyline
          points={`196,72 232,${66 - bump} 268,${58 - bump} 304,${54 - bump}`}
          fill="none"
          stroke="#d06f38"
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        <text x="225" y="38" fontSize="11" fill="#1a3f4d">Forecast</text>
      </svg>
    );
  }

  if (variant === "classification") {
    const threshold = 48 + scale * 4;
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        <polyline
          points="18,118 58,109 98,95 138,82 178,68 218,56 258,46 302,40"
          fill="none"
          stroke="#6b4f82"
          strokeWidth="3"
        />
        <line x1={threshold} y1="20" x2={threshold} y2="130" stroke="#2c8f76" strokeDasharray="4 3" />
        <text x={threshold + 4} y="30" fontSize="11" fill="#1a3f4d">Threshold</text>
      </svg>
    );
  }

  if (variant === "regression") {
    return (
      <svg viewBox="0 0 320 150" className="h-36 w-full">
        <line x1="25" y1="122" x2="300" y2="28" stroke="#2f4f8a" strokeWidth="2" />
        {[40, 70, 95, 125, 160, 210, 250, 285].map((x, i) => {
          const y = 126 - x * 0.32 + (i % 2 === 0 ? scale * 1.5 : -scale * 1.1);
          return <circle key={x} cx={x} cy={y} r="4" fill="#a55320" opacity="0.9" />;
        })}
      </svg>
    );
  }

  const bars = [30 + scale, 24 + scale, 20 + scale, 16 + scale, 14 + scale];
  return (
    <svg viewBox="0 0 320 150" className="h-36 w-full">
      {bars.map((value, index) => (
        <rect
          key={index}
          x={28 + index * 56}
          y={130 - value * 2.8}
          width="34"
          height={value * 2.8}
          fill={["#2f4f8a", "#1b6f5e", "#a55320", "#9b3f3f", "#2c6397"][index]}
          rx="4"
        />
      ))}
    </svg>
  );
}

export function RecipeWorkflowCard({
  recipe,
  libraryLabels
}: {
  recipe: Recipe;
  libraryLabels: Record<LibraryId, string>;
}) {
  const [checked, setChecked] = useState<boolean[]>([]);
  const [showCode, setShowCode] = useState(true);
  const [scale, setScale] = useState(3);

  useEffect(() => {
    setChecked(new Array(recipe.steps.length).fill(false));
    setShowCode(true);
    setScale(3);
  }, [recipe.id, recipe.steps.length]);

  const completeCount = checked.filter(Boolean).length;
  const progressPct = recipe.steps.length === 0 ? 0 : Math.round((completeCount / recipe.steps.length) * 100);

  const language = useMemo(() => recipeLanguage(recipe.libraries), [recipe.libraries]);

  const toggleStep = (index: number) => {
    setChecked((current) => current.map((item, i) => (i === index ? !item : item)));
  };

  const markAll = () => setChecked(new Array(recipe.steps.length).fill(true));
  const clearAll = () => setChecked(new Array(recipe.steps.length).fill(false));

  return (
    <article className="panel p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          <p className="mt-1 text-sm subtle">{recipe.goal}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs">
          {progressPct}% complete
        </div>
      </div>

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
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide subtle">Interactive Checklist</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={markAll}
                className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs hover:border-[var(--accent)]"
              >
                Mark all
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs hover:border-[var(--accent)]"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-alt)]">
            <div
              className="h-full bg-[var(--accent)] transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ol className="mt-3 space-y-2 text-sm">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-2 rounded-lg border border-[var(--border)] bg-white/70 p-2">
                <input
                  id={`${recipe.id}-step-${index}`}
                  type="checkbox"
                  checked={checked[index] ?? false}
                  onChange={() => toggleStep(index)}
                  className="mt-0.5"
                />
                <label htmlFor={`${recipe.id}-step-${index}`} className="cursor-pointer leading-relaxed">
                  <span className="mr-1 font-semibold subtle">{index + 1}.</span>
                  {step}
                </label>
              </li>
            ))}
          </ol>

          <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3 text-sm">
            <strong>Output hint:</strong> {recipe.outputHint}
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Workflow Visual</p>
              <label className="text-xs subtle">
                Scenario scale: <span className="font-semibold text-[var(--ink)]">{scale}</span>
              </label>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
              className="w-full"
              aria-label="Adjust chart scenario scale"
            />
            <div className="mt-2 rounded-lg border border-[var(--border)] bg-white px-2 py-1">
              <RecipeMiniChart tags={recipe.tags} scale={scale} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCode((current) => !current)}
            className="rounded-md border border-[var(--border)] bg-white px-3 py-1.5 text-sm hover:border-[var(--accent)]"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>

          {showCode ? <CodeBlock code={recipe.code} language={language} showRunLocalHint={true} /> : null}
        </div>
      </div>
    </article>
  );
}
