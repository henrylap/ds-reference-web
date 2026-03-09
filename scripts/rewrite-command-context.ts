import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CommandEntry, LibraryContent } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const commandsDir = path.join(root, "content", "commands");

const GENERIC_SUMMARY = /frequently used api|reusable pattern|part of .* workflows/i;

const SUMMARY_OVERRIDES: Record<string, string> = {
  "py-builtins-len-sum": "Use len() to count records and sum() to aggregate numeric iterables.",
  "py-builtins-min-max-sorted": "Use min(), max(), and sorted() to rank and order Python iterables.",
  "py-enumerate-zip": "Use enumerate() for indexed loops and zip() to iterate multiple iterables in lockstep.",
  "py-any-all": "Use any() and all() to evaluate boolean conditions across an iterable.",
  "py-string-methods": "Common string methods clean and normalize text fields before analysis.",
  "py-f-string-format": "f-strings format variables directly in strings for readable logs and reports.",
  "py-list-append-extend": "append() adds one item, while extend() appends many items from another iterable.",
  "py-list-sort-sorted": "sort() mutates a list in place, while sorted() returns a new ordered iterable.",
  "py-dict-items-keys-values": "keys(), values(), and items() expose dictionary views for iteration and joins.",
  "py-dict-comprehension": "Dictionary comprehensions build key-value mappings from compact transformation logic.",
  "py-set-comprehension": "Set comprehensions create unique collections from transformed iterables.",
  "py-match-case": "match/case performs structural pattern matching for multi-branch business rules.",
  "py-json-loads-dumps": "json.loads() parses JSON strings and json.dumps() serializes Python objects to JSON.",
  "py-csv-dictreader": "csv.DictReader reads CSV rows as dictionaries keyed by header names.",
  "py-pathlib-path": "pathlib.Path provides object-based filesystem paths for safer file operations.",
  "py-contextlib-suppress": "contextlib.suppress ignores specific expected exceptions in controlled blocks.",
  "py-datetime-timedelta": "timedelta represents elapsed time for date offsets and window calculations.",
  "py-datetime-timezone": "Timezone-aware datetime objects preserve absolute time across regions and systems.",
  "py-typing-typed-dict": "TypedDict defines dictionary key/value contracts for static type checking.",
  "py-dataclass-basics": "dataclass generates boilerplate methods for structured, typed data records.",

  "np-zeros": "numpy.zeros creates an array filled with zeros for initialization and placeholders.",
  "np-ones": "numpy.ones creates an array filled with ones for scaling masks and baselines.",
  "np-full": "numpy.full creates an array filled with a constant value.",
  "np-stack": "numpy.stack joins arrays along a new axis.",
  "np-vstack": "numpy.vstack stacks arrays vertically (row-wise).",
  "np-hstack": "numpy.hstack stacks arrays horizontally (column-wise).",
  "np-split": "numpy.split divides an array into equal sections or index-based segments.",
  "np-unique": "numpy.unique returns sorted unique values and optional counts/indices.",
  "np-sort": "numpy.sort returns a sorted copy of an array along an axis.",
  "np-argsort": "numpy.argsort returns index positions that would sort an array.",
  "np-argmax": "numpy.argmax/argmin returns index positions of max/min values.",
  "np-sum": "numpy.sum aggregates values across an array axis.",
  "np-median": "numpy.median computes the median, which is robust to outliers.",
  "np-quantile": "numpy.quantile computes quantile cut points for distribution analysis.",
  "np-nanmean": "numpy.nanmean computes the mean while ignoring NaN values.",
  "np-clip": "numpy.clip bounds array values between lower and upper limits.",
  "np-log": "numpy.log applies the natural logarithm elementwise.",
  "np-exp": "numpy.exp applies the exponential function elementwise.",
  "np-transpose": "numpy.transpose reorders array axes, commonly rows <-> columns.",
  "np-linalg-solve": "numpy.linalg.solve solves linear systems of the form Ax = b.",

  "pandas-read-excel": "pandas.read_excel loads worksheet data into a DataFrame.",
  "pandas-info": "DataFrame.info prints schema, non-null counts, and memory usage.",
  "pandas-describe": "DataFrame.describe returns summary statistics for numeric and categorical columns.",
  "pandas-iloc": "DataFrame.iloc performs integer-position based row/column selection.",
  "pandas-drop": "DataFrame.drop removes rows or columns by labels.",
  "pandas-rename": "DataFrame.rename changes row/column labels without mutating source by default.",
  "pandas-astype": "DataFrame.astype casts columns to specific data types.",
  "pandas-value-counts": "Series.value_counts counts category frequency, optionally normalized.",
  "pandas-groupby-transform": "GroupBy.transform computes group-level metrics aligned back to original rows.",
  "pandas-melt": "pandas.melt reshapes wide tables into long format.",
  "pandas-concat": "pandas.concat combines DataFrames along rows or columns.",
  "pandas-join": "DataFrame.join merges DataFrames using index alignment or key columns.",
  "pandas-drop-duplicates": "DataFrame.drop_duplicates removes duplicate rows by selected columns.",
  "pandas-isna": "DataFrame.isna returns a boolean mask of missing values.",
  "pandas-dropna": "DataFrame.dropna removes rows or columns containing missing values.",
  "pandas-replace": "DataFrame.replace substitutes values using scalar, list, dict, or regex rules.",
  "pandas-cut": "pandas.cut bins continuous values into interval categories.",
  "pandas-qcut": "pandas.qcut bins values into quantile-based buckets.",
  "pandas-rolling": "DataFrame.rolling creates moving window views for time-series statistics.",
  "pandas-shift": "DataFrame.shift offsets rows for lag/lead features.",

  "sklearn-simpleimputer": "SimpleImputer fills missing values using statistics such as mean, median, or most frequent.",
  "sklearn-minmaxscaler": "MinMaxScaler rescales numeric features into a fixed range such as [0, 1].",
  "sklearn-ordinalencoder": "OrdinalEncoder encodes categorical features as integer codes.",
  "sklearn-labelencoder": "LabelEncoder maps target labels to integer classes for model compatibility.",
  "sklearn-make-pipeline": "make_pipeline builds a preprocessing + model pipeline with automatic step naming.",
  "sklearn-linearregression": "LinearRegression fits an ordinary least squares model for continuous target prediction.",
  "sklearn-ridge": "Ridge adds L2 regularization to linear regression to reduce coefficient variance.",
  "sklearn-lasso": "Lasso adds L1 regularization and can drive weak feature coefficients to zero.",
  "sklearn-decisiontreeclassifier": "DecisionTreeClassifier learns rule-based class splits from feature thresholds.",
  "sklearn-gradientboostingclassifier": "GradientBoostingClassifier builds additive trees to reduce classification loss iteratively.",
  "sklearn-kneighborsclassifier": "KNeighborsClassifier predicts class by nearest labeled neighbors in feature space.",
  "sklearn-svc": "SVC trains a support vector classifier with margin maximization and optional kernels.",
  "sklearn-stratifiedkfold": "StratifiedKFold creates folds that preserve class ratios across splits.",
  "sklearn-cross-validate": "cross_validate runs multi-metric cross-validation and returns fit/score diagnostics.",
  "sklearn-randomizedsearchcv": "RandomizedSearchCV samples hyperparameter combinations with cross-validation.",
  "sklearn-confusion-matrix": "confusion_matrix counts true/false positives and negatives by class.",
  "sklearn-classification-report": "classification_report summarizes precision, recall, and F1 per class.",
  "sklearn-mean-squared-error": "mean_squared_error computes average squared prediction error for regression.",
  "sklearn-r2-score": "r2_score measures variance explained by regression predictions.",
  "sklearn-pca": "PCA projects features into orthogonal components that capture maximal variance.",

  "mpl-style-use": "plt.style.use applies a predefined visual style to all subsequent plots.",
  "mpl-show": "plt.show renders pending figures in interactive and script environments.",
  "mpl-ax-set-title": "Axes.set_title sets an axis title to communicate chart purpose.",
  "mpl-ax-set-xlim": "Axes.set_xlim sets lower and upper bounds of the x-axis.",
  "mpl-ax-set-ylim": "Axes.set_ylim sets lower and upper bounds of the y-axis.",
  "mpl-ax-grid": "Axes.grid toggles grid lines for easier value reading.",
  "mpl-ax-axhline": "Axes.axhline draws a horizontal reference line across the axis.",
  "mpl-ax-axvline": "Axes.axvline draws a vertical reference line across the axis.",
  "mpl-ax-annotate": "Axes.annotate places labels and arrows to highlight points of interest.",
  "mpl-ax-fill-between": "Axes.fill_between shades the area between two curves.",
  "mpl-ax-errorbar": "Axes.errorbar plots points with x/y uncertainty intervals.",
  "mpl-ax-boxplot": "Axes.boxplot visualizes quartiles, spread, and outliers.",
  "mpl-ax-violinplot": "Axes.violinplot visualizes distribution shape and spread by category.",
  "mpl-ax-pie": "Axes.pie displays part-to-whole proportions as slices.",
  "mpl-ax-imshow": "Axes.imshow displays image-like or matrix data as colored pixels.",
  "mpl-ax-twinx": "Axes.twinx creates a secondary y-axis sharing the same x-axis.",
  "mpl-subplots-adjust": "plt.subplots_adjust controls margins and spacing between subplots.",
  "mpl-figure-autofmt-xdate": "Figure.autofmt_xdate rotates and aligns date tick labels.",
  "mpl-close": "plt.close closes a figure to free memory in loops and batch jobs.",
  "mpl-ax-text": "Axes.text places custom text at data or axis coordinates.",

  "sns-relplot": "seaborn.relplot builds figure-level relational plots with optional faceting.",
  "sns-displot": "seaborn.displot builds figure-level distribution plots such as histograms and KDE.",
  "sns-kdeplot": "seaborn.kdeplot estimates and plots smooth probability density curves.",
  "sns-ecdfplot": "seaborn.ecdfplot plots cumulative distribution functions.",
  "sns-regplot": "seaborn.regplot draws scatter plus fitted regression trend and confidence interval.",
  "sns-lmplot": "seaborn.lmplot builds faceted regression plots across categories.",
  "sns-jointplot": "seaborn.jointplot combines bivariate and marginal distributions in one figure.",
  "sns-countplot": "seaborn.countplot visualizes category counts directly from raw rows.",
  "sns-stripplot": "seaborn.stripplot shows individual observations for categorical comparisons.",
  "sns-swarmplot": "seaborn.swarmplot prevents overlap to show each observation clearly.",
  "sns-pointplot": "seaborn.pointplot plots category estimates with uncertainty intervals.",
  "sns-boxenplot": "seaborn.boxenplot emphasizes distribution tails using letter-value boxes.",
  "sns-clustermap": "seaborn.clustermap performs hierarchical clustering and heatmap display.",
  "sns-facetgrid": "seaborn.FacetGrid builds multi-panel plots split by row/col/hue facets.",
  "sns-pairgrid": "seaborn.PairGrid builds customizable pairwise relationship matrices.",
  "sns-move-legend": "seaborn.move_legend repositions legends for readability and layout control.",
  "sns-color-palette": "seaborn.color_palette selects and generates color sequences.",
  "sns-set-context": "seaborn.set_context scales plot elements for notebook, talk, or poster output.",
  "sns-set-style": "seaborn.set_style sets axis/grid aesthetics such as darkgrid or whitegrid.",
  "sns-residplot": "seaborn.residplot visualizes residual patterns for regression diagnostics."
};

const CONTEXT_BY_SUBTOPIC: Record<string, string> = {
  "Core Syntax": "writing concise, reliable Python script logic",
  Collections: "transforming lists, dicts, and sets before loading them into DataFrames",
  "Control Flow": "encoding business rules and routing logic explicitly",
  "Error Handling": "hardening scripts against malformed records and runtime edge cases",
  "I/O": "ingesting exports and serializing clean outputs",
  Datetime: "building time-aware features and schedule calculations",
  Typing: "making utility functions safer for team reuse",

  "Array Creation": "initializing feature matrices and simulation arrays",
  "Shape Operations": "reshaping model-ready matrices and batch tensors",
  Selection: "filtering and selecting numeric values efficiently",
  Statistics: "computing robust summary metrics across arrays",
  "Linear Algebra": "solving matrix operations used in optimization and regression",
  Random: "sampling reproducibly for experiments and simulations",

  Transformation: "cleaning and engineering columns in tabular datasets",
  Join: "combining fact tables with lookup dimensions",
  Aggregation: "building grouped KPI tables for reporting",
  "Missing Data": "auditing and remediating null-heavy source extracts",
  "Time Series": "constructing lag, rolling, and resampled temporal features",

  "Data Splitting": "creating unbiased holdout sets",
  Preprocessing: "standardizing and encoding raw features before model fit",
  Pipelines: "keeping train/inference preprocessing identical",
  Models: "training estimators for classification or regression",
  "Model Selection": "choosing hyperparameters with validation discipline",
  Metrics: "quantifying model quality with target-specific metrics",

  "Figure Setup": "configuring chart canvases and defaults",
  "Line/Bar/Scatter": "visualizing trend and comparison metrics",
  "Line and Area": "showing trends with uncertainty or cumulative shading",
  Distribution: "diagnosing spread, skew, and outliers",
  Styling: "making charts publication-ready and readable",
  Annotation: "adding business context directly on plots",
  "Axis Control": "improving scale readability and comparability",
  Categorical: "comparing category-level performance",
  "Image and Matrix": "visualizing matrices, heatmaps, and image-like data",
  Relational: "analyzing feature relationships and trends",
  Matrix: "exploring pairwise or clustered structure"
};

const BUSINESS_BY_TAG: Record<string, string> = {
  regression: "forecasting continuous outcomes such as sales, revenue, demand, or cost",
  classification: "predicting discrete outcomes such as churn, fraud, or approval",
  preprocessing: "cleaning raw feature columns before model fitting",
  "missing-data": "handling null-heavy CRM, finance, and operations exports",
  join: "combining transactional tables with customer/product reference data",
  "time-series": "tracking daily/weekly performance with lag and rolling signals",
  visualization: "communicating KPI trends to business stakeholders",
  encoding: "turning categorical columns into model-consumable numeric features",
  scaling: "stabilizing feature magnitudes for distance- and gradient-based models",
  aggregation: "summarizing raw events into decision-ready KPIs",
  "feature-selection": "reducing noisy predictors before training"
};

const BUSINESS_BY_LIBRARY: Record<string, string> = {
  python: "implementing reliable data-cleaning and orchestration utilities",
  numpy: "engineering numeric features and matrix-ready inputs",
  pandas: "cleaning and reshaping transaction/event tables",
  sklearn: "training, validating, and serving machine learning models",
  matplotlib: "shipping stakeholder-ready reporting visuals",
  seaborn: "rapid exploratory analysis and model diagnostics"
};

const WORKFLOW_BY_LIBRARY: Record<string, string> = {
  python: "a reusable script utility that can be moved from notebook prototypes into production jobs",
  numpy: "a vectorized numeric operation that scales better than Python loops",
  pandas: "a tabular transformation step in ETL/EDA/model-prep workflows",
  sklearn: "a train/validation/inference workflow that should be wrapped in pipelines",
  matplotlib: "a chart-building step for stakeholder-ready reporting",
  seaborn: "a statistical plotting step for exploratory and diagnostic analysis"
};

const EXTRA_OVERVIEW: Record<string, string> = {
  "sklearn-linearregression":
    "LinearRegression fits an ordinary least squares line that minimizes squared residual error between observed and predicted values. Use it when the target is continuous (for example revenue, units sold, or expected demand) and you need a fast, interpretable baseline before trying more complex models.",
  "sklearn-logisticregression":
    "LogisticRegression estimates class probabilities using a linear decision boundary and regularization. Use it for binary or multiclass classification when you need calibrated probabilities and a strong baseline with interpretable coefficients.",
  "sklearn-onehotencoder":
    "OneHotEncoder converts each category into a sparse/dense binary indicator matrix so linear and tree models can consume categorical fields safely. Use it in training and inference pipelines to keep category handling consistent and avoid train/serve mismatches.",
  "sklearn-pipeline":
    "Pipeline chains preprocessing and model steps into one object so every cross-validation fold and deployment call uses identical transformations. Use it to eliminate leakage and guarantee consistent fit/predict behavior across environments.",
  "sklearn-columntransformer":
    "ColumnTransformer applies different preprocessing logic to numeric and categorical subsets in one pass. Use it when your table mixes feature types and you need deterministic, auditable feature engineering before model fit."
};

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function ensurePeriod(text: string): string {
  const clean = normalize(text);
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function isGeneric(text: string): boolean {
  return GENERIC_SUMMARY.test(text);
}

function pickBusinessContext(command: CommandEntry): string {
  for (const tag of command.tags) {
    if (BUSINESS_BY_TAG[tag]) {
      return BUSINESS_BY_TAG[tag];
    }
  }
  return BUSINESS_BY_LIBRARY[command.library] || "solving practical analytics tasks with reproducible code patterns";
}

function subtopicContext(command: CommandEntry): string {
  return (
    CONTEXT_BY_SUBTOPIC[command.subtopic] ||
    `delivering reliable ${command.library} workflows`
  );
}

function workflowContext(command: CommandEntry): string {
  return WORKFLOW_BY_LIBRARY[command.library] || "a reusable data-science workflow";
}

function selectSummary(command: CommandEntry): string {
  if (SUMMARY_OVERRIDES[command.id]) {
    return SUMMARY_OVERRIDES[command.id];
  }
  if (!isGeneric(command.summary)) {
    return ensurePeriod(command.summary);
  }

  const fallback = `${command.name} is a ${command.subtopic.toLowerCase()} API in ${command.library}.`;
  return ensurePeriod(fallback);
}

function parameterHint(command: CommandEntry): string {
  const names = command.parameters
    .slice(0, 4)
    .map((parameter) => parameter.name)
    .filter((name) => {
      const lowered = name.toLowerCase().trim();
      if (!lowered || lowered === "inputs") {
        return false;
      }
      if (lowered === "*arrays" || lowered === "arrays") {
        return false;
      }
      return true;
    });

  if (names.length === 0) {
    return "Most controls are optional keyword arguments.";
  }

  if (names.length === 1) {
    return `Key parameter: ${names[0]}.`;
  }

  return `Key parameters: ${names.slice(0, 3).join(", ")}.`;
}

function returnsHint(command: CommandEntry): string {
  const shape = command.returns.shape ? ` with shape ${command.returns.shape}` : "";
  return `Returns ${command.returns.type}${shape}.`;
}

function buildDescription(command: CommandEntry, summary: string): string {
  const sentence1 = ensurePeriod(summary);
  const sentence2 = `Use it for ${subtopicContext(command)} and ${pickBusinessContext(command)}.`;
  const sentence3 = parameterHint(command);
  return normalize([sentence1, sentence2, sentence3].filter(Boolean).join(" "));
}

function buildOverview(command: CommandEntry, summary: string): string {
  if (EXTRA_OVERVIEW[command.id]) {
    return normalize(`${EXTRA_OVERVIEW[command.id]} ${parameterHint(command)} ${returnsHint(command)}`);
  }

  const sentence1 = ensurePeriod(summary);
  const sentence2 = `Use ${command.name} when ${subtopicContext(command)}.`;
  const sentence3 = `Typical business pattern: ${pickBusinessContext(command)}.`;
  const sentence4 = `${parameterHint(command)} ${returnsHint(command)}`;
  return normalize([sentence1, sentence2, sentence3, sentence4].join(" "));
}

function buildApplications(command: CommandEntry): string[] {
  const business = pickBusinessContext(command);
  const workflow = workflowContext(command);

  return [
    `Primary application: ${command.name} is used for ${business}.`,
    `Workflow application: treat this command as ${workflow}.`,
    `Delivery application: document chosen parameters and output checks so teammates can reproduce results.`
  ];
}

function rewriteCommand(command: CommandEntry): CommandEntry {
  const summary = selectSummary(command);

  return {
    ...command,
    summary,
    description: buildDescription(command, summary),
    overview: buildOverview(command, summary),
    applications: buildApplications(command)
  };
}

async function main() {
  const files = (await fs.readdir(commandsDir)).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const content = JSON.parse(raw) as LibraryContent;

    content.commands = content.commands.map((command) => rewriteCommand(command));

    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  }

  console.log("Rewrote command summary/description/overview/applications across all libraries.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
