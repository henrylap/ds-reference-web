import type { LibraryId } from "@/lib/types";

export const LIBRARY_ORDER: LibraryId[] = [
  "python",
  "sql",
  "rstudio",
  "numpy",
  "pandas",
  "sklearn",
  "matplotlib",
  "seaborn"
];

export const LIBRARY_COLORS: Record<LibraryId, string> = {
  python: "var(--lib-python)",
  sql: "var(--lib-sql)",
  rstudio: "var(--lib-rstudio)",
  numpy: "var(--lib-numpy)",
  pandas: "var(--lib-pandas)",
  sklearn: "var(--lib-sklearn)",
  matplotlib: "var(--lib-matplotlib)",
  seaborn: "var(--lib-seaborn)"
};

export const LIBRARY_LABELS: Record<LibraryId, string> = {
  python: "Python Fundamentals for Data Science",
  sql: "SQL",
  rstudio: "R Studio (R + tidyverse)",
  numpy: "NumPy",
  pandas: "Pandas",
  sklearn: "scikit-learn",
  matplotlib: "Matplotlib",
  seaborn: "Seaborn"
};
