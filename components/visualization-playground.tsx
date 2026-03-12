"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/code-block";

type VizTemplate = "timeseries" | "comparison" | "distribution" | "dashboard";
type VizLanguage = "python" | "r";
type VizPalette = "professional" | "contrast" | "neutral";

const templateOptions: { id: VizTemplate; label: string }[] = [
  { id: "timeseries", label: "Trend Story" },
  { id: "comparison", label: "Category KPI" },
  { id: "distribution", label: "Distribution Check" },
  { id: "dashboard", label: "Dashboard Grid" }
];

const languageOptions: { id: VizLanguage; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "r", label: "R (ggplot2)" }
];

const paletteOptions: { id: VizPalette; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "contrast", label: "High Contrast" },
  { id: "neutral", label: "Neutral Gray" }
];

const paletteMap: Record<VizPalette, { primary: string; secondary: string; accent: string }> = {
  professional: { primary: "#2f5d7c", secondary: "#4a9ba6", accent: "#cc7a2f" },
  contrast: { primary: "#1f3a93", secondary: "#16a085", accent: "#e74c3c" },
  neutral: { primary: "#4b5563", secondary: "#9ca3af", accent: "#111827" }
};

const practiceChecklist = [
  "Match chart type to question: trend -> line, ranking -> bar, distribution -> histogram/box.",
  "Lead with one message per chart and write a specific title that states the business takeaway.",
  "Keep scales honest and comparable; avoid truncated axes unless explicitly justified.",
  "Limit color usage to semantic meaning (e.g., highlight the one segment you want attention on).",
  "Annotate key events, thresholds, and outliers so interpretation is reproducible.",
  "For dashboards, standardize fonts, spacing, and metric definitions across every tile."
];

function pythonSnippet(template: VizTemplate, palette: VizPalette) {
  const colors = paletteMap[palette];

  if (template === "timeseries") {
    return `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")
df = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "revenue_k": [120, 128, 135, 149, 158, 171]
})

fig, ax = plt.subplots(figsize=(9, 4.8), dpi=130)
ax.plot(df["month"], df["revenue_k"], color="${colors.primary}", linewidth=2.6, marker="o")
ax.axhline(150, color="${colors.accent}", linestyle="--", linewidth=1.5, label="Target")
ax.set_title("Monthly Revenue Trend (Focus: Target Crossing)")
ax.set_xlabel("Month")
ax.set_ylabel("Revenue (k USD)")
ax.legend(frameon=True)
plt.tight_layout()`;
  }

  if (template === "comparison") {
    return `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
df = pd.DataFrame({
    "channel": ["Paid Search", "Email", "Organic", "Affiliate"],
    "cac": [76, 41, 35, 62]
}).sort_values("cac", ascending=True)

fig, ax = plt.subplots(figsize=(8.8, 4.8), dpi=130)
sns.barplot(data=df, x="cac", y="channel", color="${colors.secondary}", ax=ax)
ax.axvline(df["cac"].mean(), color="${colors.accent}", linestyle="--", linewidth=1.5)
ax.set_title("Customer Acquisition Cost by Channel")
ax.set_xlabel("CAC (USD)")
ax.set_ylabel("")
plt.tight_layout()`;
  }

  if (template === "distribution") {
    return `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
df = pd.DataFrame({"order_value": [22, 26, 28, 30, 31, 34, 40, 44, 49, 52, 58, 120]})
p95 = df["order_value"].quantile(0.95)

fig, ax = plt.subplots(figsize=(8.8, 4.8), dpi=130)
sns.histplot(df, x="order_value", bins=8, kde=True, color="${colors.primary}", ax=ax)
ax.axvline(p95, color="${colors.accent}", linestyle="--", linewidth=1.5, label="p95")
ax.set_title("Order Value Distribution with Tail Threshold")
ax.set_xlabel("Order Value (USD)")
ax.legend(frameon=True)
plt.tight_layout()`;
  }

  return `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.widgets import Slider

sns.set_theme(style="whitegrid")
df = pd.DataFrame({
    "week": np.arange(1, 13),
    "revenue_k": [96, 101, 107, 113, 118, 125, 132, 136, 142, 149, 155, 162],
    "orders": [420, 436, 451, 468, 479, 495, 512, 520, 538, 552, 568, 583]
})

fig, axes = plt.subplots(1, 2, figsize=(12, 4.8), dpi=130)
plt.subplots_adjust(bottom=0.24, wspace=0.28)

line_ax, bar_ax = axes
line_plot, = line_ax.plot(df["week"], df["revenue_k"], color="${colors.primary}", marker="o", linewidth=2.3)
bar_ax.bar(df["week"], df["orders"], color="${colors.secondary}", alpha=0.85)

line_ax.set_title("Revenue Trend")
line_ax.set_xlabel("Week")
line_ax.set_ylabel("Revenue (k USD)")
bar_ax.set_title("Order Volume")
bar_ax.set_xlabel("Week")
bar_ax.set_ylabel("Orders")

slider_ax = fig.add_axes([0.2, 0.08, 0.6, 0.04])
scenario = Slider(slider_ax, "Demand Multiplier", 0.8, 1.2, valinit=1.0, valstep=0.02)

def update(multiplier):
    scaled = df["revenue_k"] * multiplier
    line_plot.set_ydata(scaled)
    line_ax.set_ylim(scaled.min() - 5, scaled.max() + 8)
    fig.canvas.draw_idle()

scenario.on_changed(update)
plt.show()`;
}

function rSnippet(template: VizTemplate, palette: VizPalette) {
  const colors = paletteMap[palette];

  if (template === "timeseries") {
    return `library(ggplot2)
library(dplyr)

df <- tibble::tibble(
  month = factor(c("Jan","Feb","Mar","Apr","May","Jun"), levels = c("Jan","Feb","Mar","Apr","May","Jun")),
  revenue_k = c(120, 128, 135, 149, 158, 171)
)

ggplot(df, aes(x = month, y = revenue_k, group = 1)) +
  geom_line(color = "${colors.primary}", linewidth = 1.2) +
  geom_point(color = "${colors.secondary}", size = 2.6) +
  geom_hline(yintercept = 150, linetype = "dashed", color = "${colors.accent}") +
  labs(
    title = "Monthly Revenue Trend (Focus: Target Crossing)",
    x = "Month",
    y = "Revenue (k USD)"
  ) +
  theme_minimal(base_size = 12)`;
  }

  if (template === "comparison") {
    return `library(ggplot2)
library(dplyr)

df <- tibble::tibble(
  channel = c("Paid Search", "Email", "Organic", "Affiliate"),
  cac = c(76, 41, 35, 62)
) %>% arrange(cac)

ggplot(df, aes(x = reorder(channel, cac), y = cac)) +
  geom_col(fill = "${colors.secondary}") +
  geom_hline(yintercept = mean(df$cac), linetype = "dashed", color = "${colors.accent}") +
  coord_flip() +
  labs(
    title = "Customer Acquisition Cost by Channel",
    x = NULL,
    y = "CAC (USD)"
  ) +
  theme_minimal(base_size = 12)`;
  }

  if (template === "distribution") {
    return `library(ggplot2)
library(dplyr)

df <- tibble::tibble(order_value = c(22,26,28,30,31,34,40,44,49,52,58,120))
p95 <- quantile(df$order_value, 0.95)

ggplot(df, aes(x = order_value)) +
  geom_histogram(binwidth = 10, fill = "${colors.primary}", color = "white", alpha = 0.9) +
  geom_vline(xintercept = p95, linetype = "dashed", color = "${colors.accent}") +
  labs(
    title = "Order Value Distribution with Tail Threshold",
    x = "Order Value (USD)",
    y = "Count"
  ) +
  theme_minimal(base_size = 12)`;
  }

  return `library(ggplot2)
library(dplyr)
library(tidyr)

df <- tibble::tibble(
  week = rep(1:8, 2),
  metric = rep(c("Revenue (k USD)", "Orders"), each = 8),
  value = c(96, 101, 107, 113, 118, 125, 132, 136, 420, 436, 451, 468, 479, 495, 512, 520)
)

ggplot(df, aes(x = week, y = value)) +
  geom_line(color = "${colors.primary}", linewidth = 1.1) +
  geom_point(color = "${colors.secondary}", size = 2.1) +
  facet_wrap(~ metric, scales = "free_y", ncol = 2) +
  labs(
    title = "KPI Dashboard Grid",
    subtitle = "Consistent styling + shared time axis improves comparability",
    x = "Week",
    y = NULL
  ) +
  theme_minimal(base_size = 12) +
  theme(
    strip.text = element_text(face = "bold"),
    panel.grid.minor = element_blank()
  )`;
}

function PreviewFigure({
  template,
  palette,
  emphasis
}: {
  template: VizTemplate;
  palette: VizPalette;
  emphasis: number;
}) {
  const colors = paletteMap[palette];
  const bump = emphasis * 2.6;

  if (template === "timeseries") {
    return (
      <svg viewBox="0 0 380 210" className="h-48 w-full">
        <polyline
          points={`22,170 72,160 122,148 172,134 222,122 272,106 322,92 362,78`}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
        />
        {[22, 72, 122, 172, 222, 272, 322, 362].map((x, idx) => (
          <circle
            key={x}
            cx={x}
            cy={170 - idx * (10 + bump * 0.1)}
            r="4.5"
            fill={colors.secondary}
          />
        ))}
        <line x1="18" y1={112 - bump} x2="366" y2={112 - bump} stroke={colors.accent} strokeDasharray="6 4" />
        <text x="24" y={100 - bump} fontSize="11" fill={colors.accent}>Target</text>
      </svg>
    );
  }

  if (template === "comparison") {
    const bars = [62, 88, 112, 140].map((v) => v + bump);
    return (
      <svg viewBox="0 0 380 210" className="h-48 w-full">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={60}
            y={36 + i * 42}
            width={h}
            height={24}
            rx="4"
            fill={i === bars.length - 1 ? colors.accent : colors.secondary}
            opacity={0.9}
          />
        ))}
        <line x1={190} y1="28" x2={190} y2="194" stroke={colors.primary} strokeDasharray="5 4" />
        <text x="196" y="40" fontSize="11" fill={colors.primary}>Average</text>
      </svg>
    );
  }

  if (template === "distribution") {
    return (
      <svg viewBox="0 0 380 210" className="h-48 w-full">
        {[26, 38, 55, 78, 96, 74, 48, 30].map((h, i) => (
          <rect
            key={i}
            x={28 + i * 40}
            y={186 - h - bump * 0.5}
            width={28}
            height={h + bump * 0.5}
            fill={colors.primary}
            opacity={0.85}
            rx="3"
          />
        ))}
        <line x1={298} y1="26" x2={298} y2="190" stroke={colors.accent} strokeDasharray="6 4" />
        <text x="304" y="40" fontSize="11" fill={colors.accent}>p95</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 380 210" className="h-48 w-full">
      <rect x="18" y="20" width="166" height="78" rx="10" fill={colors.secondary} opacity="0.28" />
      <rect x="196" y="20" width="166" height="78" rx="10" fill={colors.primary} opacity="0.22" />
      <rect x="18" y="112" width="166" height="78" rx="10" fill={colors.primary} opacity="0.22" />
      <rect x="196" y="112" width="166" height="78" rx="10" fill={colors.secondary} opacity="0.28" />
      <polyline
        points={`30,82 60,72 90,64 120,52 150,44 174,36`}
        fill="none"
        stroke={colors.primary}
        strokeWidth="2.4"
      />
      {[214, 246, 278, 310, 342].map((x, i) => (
        <rect key={x} x={x} y={184 - (24 + i * 8 + bump * 0.7)} width="18" height={24 + i * 8 + bump * 0.7} fill={colors.secondary} rx="3" />
      ))}
      <line x1="24" y1="146" x2="176" y2="146" stroke={colors.accent} strokeDasharray="5 3" />
      <text x="26" y="138" fontSize="10" fill={colors.accent}>threshold</text>
    </svg>
  );
}

export function VisualizationPlayground({ defaultLanguage = "python" }: { defaultLanguage?: VizLanguage }) {
  const [template, setTemplate] = useState<VizTemplate>("timeseries");
  const [language, setLanguage] = useState<VizLanguage>(defaultLanguage);
  const [palette, setPalette] = useState<VizPalette>("professional");
  const [emphasis, setEmphasis] = useState(3);

  const code = useMemo(() => {
    return language === "python"
      ? pythonSnippet(template, palette)
      : rSnippet(template, palette);
  }, [language, template, palette]);

  return (
    <section className="panel p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Visualization Playground</h2>
          <p className="mt-1 text-sm subtle">
            Interactive examples for chart storytelling and dashboard structure.
          </p>
        </div>
        <span className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs">
          Interactive code + visual preview
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-3">
          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide subtle">Template</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {templateOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTemplate(option.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    template === option.id
                      ? "border-[var(--accent)] bg-white text-[var(--accent-strong)]"
                      : "border-[var(--border)] bg-white/70 text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide subtle">Language</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {languageOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLanguage(option.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    language === option.id
                      ? "border-[var(--accent)] bg-white text-[var(--accent-strong)]"
                      : "border-[var(--border)] bg-white/70 text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide subtle">Palette</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {paletteOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPalette(option.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    palette === option.id
                      ? "border-[var(--accent)] bg-white text-[var(--accent-strong)]"
                      : "border-[var(--border)] bg-white/70 text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Preview</p>
              <label className="text-xs subtle">
                Emphasis level: <span className="font-semibold text-[var(--ink)]">{emphasis}</span>
              </label>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={emphasis}
              onChange={(event) => setEmphasis(Number(event.target.value))}
              className="mt-2 w-full"
              aria-label="Adjust visual emphasis"
            />
            <div className="mt-2 rounded-lg border border-[var(--border)] bg-white p-2">
              <PreviewFigure template={template} palette={palette} emphasis={emphasis} />
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border)] bg-white/80 p-3">
            <h3 className="text-sm font-semibold">Visualization Best-Practice Checklist</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {practiceChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <CodeBlock code={code} language={language} showRunLocalHint={true} />
      </div>
    </section>
  );
}
