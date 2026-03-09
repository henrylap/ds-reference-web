import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CommandEntry, LibraryContent, LibraryId } from "../lib/types";

type Compact = {
  id: string;
  name: string;
  subtopic: string;
  syntax: string;
  docs: string;
  tags: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const commandsDir = path.join(root, "content", "commands");

const libraryMeta: Record<LibraryId, { overview: string; applications: string[]; defaultsDoc: string }> = {
  python: {
    overview:
      "Python fundamentals are the core execution language behind data science workflows: cleaning raw files, implementing business rules, shaping features, and orchestrating repeatable analysis scripts.",
    applications: [
      "Data ingestion and preprocessing scripts for analytics pipelines.",
      "Business-rule logic for risk, pricing, churn, and operations monitoring.",
      "Reusable helpers for datetime handling, typing, exceptions, and file I/O."
    ],
    defaultsDoc: "https://docs.python.org/3/"
  },
  numpy: {
    overview:
      "NumPy provides high-performance array programming primitives for numerical computing, vectorized transformations, and matrix operations used by most DS/ML stacks.",
    applications: [
      "Numeric feature engineering at scale.",
      "Fast statistics and distribution calculations.",
      "Linear algebra and simulation workflows."
    ],
    defaultsDoc: "https://numpy.org/doc/stable/"
  },
  pandas: {
    overview:
      "Pandas is the daily workhorse for tabular data in analytics: load, clean, join, aggregate, reshape, and time-align datasets before visualization or modeling.",
    applications: [
      "ETL from CSV/Excel exports into analysis-ready tables.",
      "EDA and KPI reporting with groupby, pivots, and time windows.",
      "Feature table preparation for machine learning."
    ],
    defaultsDoc: "https://pandas.pydata.org/docs/"
  },
  sklearn: {
    overview:
      "scikit-learn standardizes practical machine learning with composable APIs for preprocessing, model training, validation, hyperparameter tuning, and evaluation.",
    applications: [
      "Production-grade classification and regression workflows.",
      "Reliable preprocessing pipelines for mixed data types.",
      "Model selection with cross-validation and robust metrics."
    ],
    defaultsDoc: "https://scikit-learn.org/stable/"
  },
  matplotlib: {
    overview:
      "Matplotlib is the low-level charting engine for precise visualization control, custom annotations, and publication-quality figure export.",
    applications: [
      "Executive-ready KPI charts and trend diagnostics.",
      "Fine-grained control over axes, legends, labels, and layout.",
      "Batch generation and export of reporting visuals."
    ],
    defaultsDoc: "https://matplotlib.org/stable/"
  },
  seaborn: {
    overview:
      "Seaborn builds statistical visualizations quickly on top of Matplotlib, with strong defaults and semantic mappings for EDA and model diagnostics.",
    applications: [
      "Fast exploratory data analysis by segment and distribution.",
      "Relationship plots for feature/target diagnostics.",
      "Consistent style and faceting for notebook storytelling."
    ],
    defaultsDoc: "https://seaborn.pydata.org/"
  }
};

const extras: Record<LibraryId, Compact[]> = {
  python: [
    { id: "py-builtins-len-sum", name: "len and sum", subtopic: "Core Syntax", syntax: "len(obj); sum(iterable, start=0)", docs: "https://docs.python.org/3/library/functions.html", tags: ["builtins", "aggregation", "lists"] },
    { id: "py-builtins-min-max-sorted", name: "min max sorted", subtopic: "Core Syntax", syntax: "min(iterable); max(iterable); sorted(iterable, key=None, reverse=False)", docs: "https://docs.python.org/3/library/functions.html", tags: ["builtins", "sorting", "ranking"] },
    { id: "py-enumerate-zip", name: "enumerate and zip", subtopic: "Control Flow", syntax: "enumerate(iterable, start=0); zip(*iterables)", docs: "https://docs.python.org/3/library/functions.html", tags: ["iteration", "loops", "pairing"] },
    { id: "py-any-all", name: "any and all", subtopic: "Control Flow", syntax: "any(iterable); all(iterable)", docs: "https://docs.python.org/3/library/functions.html", tags: ["boolean", "validation", "quality-checks"] },
    { id: "py-string-methods", name: "string methods", subtopic: "Collections", syntax: "s.strip(); s.lower(); s.upper(); s.replace(old, new)", docs: "https://docs.python.org/3/library/stdtypes.html#string-methods", tags: ["strings", "text-cleaning", "normalization"] },
    { id: "py-f-string-format", name: "f-strings", subtopic: "Core Syntax", syntax: "f'{value:.2f}'", docs: "https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals", tags: ["formatting", "reporting", "strings"] },
    { id: "py-list-append-extend", name: "list append extend", subtopic: "Collections", syntax: "lst.append(item); lst.extend(iterable)", docs: "https://docs.python.org/3/tutorial/datastructures.html", tags: ["lists", "mutation", "collections"] },
    { id: "py-list-sort-sorted", name: "list sort and sorted", subtopic: "Collections", syntax: "lst.sort(key=None, reverse=False); sorted(iterable, key=None, reverse=False)", docs: "https://docs.python.org/3/howto/sorting.html", tags: ["sorting", "lists", "ranking"] },
    { id: "py-dict-items-keys-values", name: "dict keys values items", subtopic: "Collections", syntax: "d.keys(); d.values(); d.items()", docs: "https://docs.python.org/3/library/stdtypes.html#dict", tags: ["dict", "mapping", "iteration"] },
    { id: "py-dict-comprehension", name: "dictionary comprehension", subtopic: "Collections", syntax: "{k: v for k, v in iterable}", docs: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries", tags: ["dict", "comprehension", "transformation"] },
    { id: "py-set-comprehension", name: "set comprehension", subtopic: "Collections", syntax: "{expr for item in iterable if condition}", docs: "https://docs.python.org/3/tutorial/datastructures.html#sets", tags: ["set", "comprehension", "deduplication"] },
    { id: "py-match-case", name: "match case", subtopic: "Control Flow", syntax: "match value: case pattern: ...", docs: "https://docs.python.org/3/tutorial/controlflow.html#match-statements", tags: ["pattern-matching", "rules", "branching"] },
    { id: "py-json-loads-dumps", name: "json loads dumps", subtopic: "I/O", syntax: "json.loads(s); json.dumps(obj)", docs: "https://docs.python.org/3/library/json.html", tags: ["json", "serialization", "io"] },
    { id: "py-csv-dictreader", name: "csv DictReader", subtopic: "I/O", syntax: "csv.DictReader(file_obj)", docs: "https://docs.python.org/3/library/csv.html", tags: ["csv", "ingestion", "io"] },
    { id: "py-pathlib-path", name: "pathlib Path", subtopic: "I/O", syntax: "Path(path_str); path.exists(); path / 'child'", docs: "https://docs.python.org/3/library/pathlib.html", tags: ["filesystem", "paths", "io"] },
    { id: "py-contextlib-suppress", name: "contextlib suppress", subtopic: "Error Handling", syntax: "with suppress(ExceptionType): ...", docs: "https://docs.python.org/3/library/contextlib.html#contextlib.suppress", tags: ["exceptions", "context-managers", "robustness"] },
    { id: "py-datetime-timedelta", name: "datetime timedelta", subtopic: "Datetime", syntax: "timedelta(days=0, seconds=0)", docs: "https://docs.python.org/3/library/datetime.html#timedelta-objects", tags: ["datetime", "time-deltas", "time-series"] },
    { id: "py-datetime-timezone", name: "timezone-aware datetime", subtopic: "Datetime", syntax: "datetime.now(timezone.utc); dt.astimezone(tz)", docs: "https://docs.python.org/3/library/datetime.html#aware-and-naive-objects", tags: ["datetime", "timezone", "timestamps"] },
    { id: "py-typing-typed-dict", name: "typing TypedDict", subtopic: "Typing", syntax: "class Row(TypedDict): ...", docs: "https://docs.python.org/3/library/typing.html#typing.TypedDict", tags: ["typing", "schemas", "contracts"] },
    { id: "py-dataclass-basics", name: "dataclass", subtopic: "Core Syntax", syntax: "@dataclass class Name: field: type", docs: "https://docs.python.org/3/library/dataclasses.html", tags: ["dataclass", "typed-records", "models"] }
  ],
  numpy: [
    { id: "np-zeros", name: "numpy.zeros", subtopic: "Array Creation", syntax: "np.zeros(shape, dtype=float)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.zeros.html", tags: ["array-creation", "initialization"] },
    { id: "np-ones", name: "numpy.ones", subtopic: "Array Creation", syntax: "np.ones(shape, dtype=float)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.ones.html", tags: ["array-creation", "initialization"] },
    { id: "np-full", name: "numpy.full", subtopic: "Array Creation", syntax: "np.full(shape, fill_value, dtype=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.full.html", tags: ["array-creation", "constants"] },
    { id: "np-stack", name: "numpy.stack", subtopic: "Shape Operations", syntax: "np.stack(arrays, axis=0)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.stack.html", tags: ["stack", "shape"] },
    { id: "np-vstack", name: "numpy.vstack", subtopic: "Shape Operations", syntax: "np.vstack(tup)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.vstack.html", tags: ["stack", "rows"] },
    { id: "np-hstack", name: "numpy.hstack", subtopic: "Shape Operations", syntax: "np.hstack(tup)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.hstack.html", tags: ["stack", "columns"] },
    { id: "np-split", name: "numpy.split", subtopic: "Shape Operations", syntax: "np.split(ary, indices_or_sections, axis=0)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.split.html", tags: ["split", "windows"] },
    { id: "np-unique", name: "numpy.unique", subtopic: "Selection", syntax: "np.unique(ar, return_counts=False)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.unique.html", tags: ["uniqueness", "categorical"] },
    { id: "np-sort", name: "numpy.sort", subtopic: "Selection", syntax: "np.sort(a, axis=-1)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.sort.html", tags: ["sorting", "ordering"] },
    { id: "np-argsort", name: "numpy.argsort", subtopic: "Selection", syntax: "np.argsort(a, axis=-1)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.argsort.html", tags: ["sorting", "indexing"] },
    { id: "np-argmax", name: "numpy.argmax and argmin", subtopic: "Selection", syntax: "np.argmax(a, axis=None); np.argmin(a, axis=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.argmax.html", tags: ["indexing", "selection"] },
    { id: "np-sum", name: "numpy.sum", subtopic: "Statistics", syntax: "np.sum(a, axis=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.sum.html", tags: ["aggregation", "statistics"] },
    { id: "np-median", name: "numpy.median", subtopic: "Statistics", syntax: "np.median(a, axis=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.median.html", tags: ["statistics", "robustness"] },
    { id: "np-quantile", name: "numpy.quantile", subtopic: "Statistics", syntax: "np.quantile(a, q, axis=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.quantile.html", tags: ["quantiles", "risk"] },
    { id: "np-nanmean", name: "numpy.nanmean", subtopic: "Statistics", syntax: "np.nanmean(a, axis=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.nanmean.html", tags: ["missing-data", "statistics"] },
    { id: "np-clip", name: "numpy.clip", subtopic: "Selection", syntax: "np.clip(a, a_min, a_max)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.clip.html", tags: ["outliers", "bounds"] },
    { id: "np-log", name: "numpy.log", subtopic: "Statistics", syntax: "np.log(x)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.log.html", tags: ["transform", "math"] },
    { id: "np-exp", name: "numpy.exp", subtopic: "Statistics", syntax: "np.exp(x)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.exp.html", tags: ["transform", "math"] },
    { id: "np-transpose", name: "numpy.transpose", subtopic: "Shape Operations", syntax: "np.transpose(a, axes=None)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.transpose.html", tags: ["matrix", "shape"] },
    { id: "np-linalg-solve", name: "numpy.linalg.solve", subtopic: "Linear Algebra", syntax: "np.linalg.solve(a, b)", docs: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html", tags: ["linear-algebra", "solvers"] }
  ],
  pandas: [
    { id: "pandas-read-excel", name: "pandas.read_excel", subtopic: "I/O", syntax: "pd.read_excel(io, sheet_name=0, usecols=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html", tags: ["excel", "io", "loading"] },
    { id: "pandas-info", name: "DataFrame.info", subtopic: "I/O", syntax: "df.info(verbose=None, show_counts=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.info.html", tags: ["inspection", "schema"] },
    { id: "pandas-describe", name: "DataFrame.describe", subtopic: "Aggregation", syntax: "df.describe(include=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html", tags: ["eda", "summary"] },
    { id: "pandas-iloc", name: "DataFrame.iloc", subtopic: "Selection", syntax: "df.iloc[row_indexer, col_indexer]", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html", tags: ["selection", "indexing"] },
    { id: "pandas-drop", name: "DataFrame.drop", subtopic: "Transformation", syntax: "df.drop(labels=None, axis=0, columns=None, inplace=False)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html", tags: ["cleanup", "columns"] },
    { id: "pandas-rename", name: "DataFrame.rename", subtopic: "Transformation", syntax: "df.rename(columns=None, index=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rename.html", tags: ["labels", "cleanup"] },
    { id: "pandas-astype", name: "DataFrame.astype", subtopic: "Transformation", syntax: "df.astype(dtype, copy=True)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.astype.html", tags: ["types", "casting"] },
    { id: "pandas-value-counts", name: "Series.value_counts", subtopic: "Aggregation", syntax: "s.value_counts(normalize=False, dropna=True)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.Series.value_counts.html", tags: ["counts", "categorical"] },
    { id: "pandas-groupby-transform", name: "GroupBy.transform", subtopic: "Aggregation", syntax: "df.groupby(keys)[col].transform(func)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.SeriesGroupBy.transform.html", tags: ["groupby", "features"] },
    { id: "pandas-melt", name: "pandas.melt", subtopic: "Transformation", syntax: "pd.melt(frame, id_vars=None, value_vars=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.melt.html", tags: ["reshape", "long-format"] },
    { id: "pandas-concat", name: "pandas.concat", subtopic: "Join", syntax: "pd.concat(objs, axis=0, ignore_index=False)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.concat.html", tags: ["combine", "append"] },
    { id: "pandas-join", name: "DataFrame.join", subtopic: "Join", syntax: "df.join(other, on=None, how='left')", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.join.html", tags: ["join", "index"] },
    { id: "pandas-drop-duplicates", name: "DataFrame.drop_duplicates", subtopic: "Transformation", syntax: "df.drop_duplicates(subset=None, keep='first')", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html", tags: ["deduplication", "quality"] },
    { id: "pandas-isna", name: "DataFrame.isna", subtopic: "Missing Data", syntax: "df.isna()", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.isna.html", tags: ["missing-data", "diagnostics"] },
    { id: "pandas-dropna", name: "DataFrame.dropna", subtopic: "Missing Data", syntax: "df.dropna(axis=0, how='any', subset=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html", tags: ["missing-data", "cleanup"] },
    { id: "pandas-replace", name: "DataFrame.replace", subtopic: "Transformation", syntax: "df.replace(to_replace, value)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.replace.html", tags: ["cleaning", "values"] },
    { id: "pandas-cut", name: "pandas.cut", subtopic: "Transformation", syntax: "pd.cut(x, bins, labels=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.cut.html", tags: ["binning", "segmentation"] },
    { id: "pandas-qcut", name: "pandas.qcut", subtopic: "Transformation", syntax: "pd.qcut(x, q, labels=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.qcut.html", tags: ["quantiles", "segmentation"] },
    { id: "pandas-rolling", name: "DataFrame.rolling", subtopic: "Time Series", syntax: "df.rolling(window, min_periods=None)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html", tags: ["window", "time-series"] },
    { id: "pandas-shift", name: "DataFrame.shift", subtopic: "Time Series", syntax: "df.shift(periods=1)", docs: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.shift.html", tags: ["lag", "features"] }
  ],
  sklearn: [
    { id: "sklearn-simpleimputer", name: "SimpleImputer", subtopic: "Preprocessing", syntax: "SimpleImputer(strategy='mean').fit(X).transform(X)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html", tags: ["missing-data", "imputation", "preprocessing"] },
    { id: "sklearn-minmaxscaler", name: "MinMaxScaler", subtopic: "Preprocessing", syntax: "MinMaxScaler(feature_range=(0, 1)).fit(X).transform(X)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html", tags: ["scaling", "preprocessing", "normalization"] },
    { id: "sklearn-ordinalencoder", name: "OrdinalEncoder", subtopic: "Preprocessing", syntax: "OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html", tags: ["encoding", "categorical", "preprocessing"] },
    { id: "sklearn-labelencoder", name: "LabelEncoder", subtopic: "Preprocessing", syntax: "LabelEncoder().fit(y).transform(y)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html", tags: ["target", "encoding", "labels"] },
    { id: "sklearn-make-pipeline", name: "make_pipeline", subtopic: "Pipelines", syntax: "make_pipeline(step1, step2, ...)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html", tags: ["pipeline", "workflow", "reproducibility"] },
    { id: "sklearn-linearregression", name: "LinearRegression", subtopic: "Models", syntax: "LinearRegression(fit_intercept=True)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html", tags: ["regression", "baseline", "models"] },
    { id: "sklearn-ridge", name: "Ridge", subtopic: "Models", syntax: "Ridge(alpha=1.0)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html", tags: ["regression", "regularization", "models"] },
    { id: "sklearn-lasso", name: "Lasso", subtopic: "Models", syntax: "Lasso(alpha=1.0)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html", tags: ["regression", "regularization", "feature-selection"] },
    { id: "sklearn-decisiontreeclassifier", name: "DecisionTreeClassifier", subtopic: "Models", syntax: "DecisionTreeClassifier(max_depth=None, random_state=None)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html", tags: ["classification", "tree-model", "models"] },
    { id: "sklearn-gradientboostingclassifier", name: "GradientBoostingClassifier", subtopic: "Models", syntax: "GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html", tags: ["classification", "boosting", "models"] },
    { id: "sklearn-kneighborsclassifier", name: "KNeighborsClassifier", subtopic: "Models", syntax: "KNeighborsClassifier(n_neighbors=5)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html", tags: ["classification", "distance", "models"] },
    { id: "sklearn-svc", name: "SVC", subtopic: "Models", syntax: "SVC(C=1.0, kernel='rbf')", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html", tags: ["classification", "svm", "models"] },
    { id: "sklearn-stratifiedkfold", name: "StratifiedKFold", subtopic: "Model Selection", syntax: "StratifiedKFold(n_splits=5, shuffle=False, random_state=None)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html", tags: ["cv", "validation", "splits"] },
    { id: "sklearn-cross-validate", name: "cross_validate", subtopic: "Model Selection", syntax: "cross_validate(estimator, X, y, cv=None, scoring=None)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html", tags: ["cv", "validation", "metrics"] },
    { id: "sklearn-randomizedsearchcv", name: "RandomizedSearchCV", subtopic: "Model Selection", syntax: "RandomizedSearchCV(estimator, param_distributions, n_iter=10)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html", tags: ["tuning", "search", "optimization"] },
    { id: "sklearn-confusion-matrix", name: "confusion_matrix", subtopic: "Metrics", syntax: "confusion_matrix(y_true, y_pred)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html", tags: ["metrics", "classification", "evaluation"] },
    { id: "sklearn-classification-report", name: "classification_report", subtopic: "Metrics", syntax: "classification_report(y_true, y_pred)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html", tags: ["metrics", "classification", "evaluation"] },
    { id: "sklearn-mean-squared-error", name: "mean_squared_error", subtopic: "Metrics", syntax: "mean_squared_error(y_true, y_pred)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html", tags: ["metrics", "regression", "evaluation"] },
    { id: "sklearn-r2-score", name: "r2_score", subtopic: "Metrics", syntax: "r2_score(y_true, y_pred)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html", tags: ["metrics", "regression", "evaluation"] },
    { id: "sklearn-pca", name: "PCA", subtopic: "Preprocessing", syntax: "PCA(n_components=None).fit(X).transform(X)", docs: "https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html", tags: ["dimensionality-reduction", "features", "preprocessing"] }
  ],
  matplotlib: [
    { id: "mpl-style-use", name: "plt.style.use", subtopic: "Figure Setup", syntax: "plt.style.use(style)", docs: "https://matplotlib.org/stable/api/style_api.html", tags: ["style", "theme", "setup"] },
    { id: "mpl-show", name: "plt.show", subtopic: "Figure Setup", syntax: "plt.show()", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.show.html", tags: ["render", "display", "setup"] },
    { id: "mpl-ax-set-title", name: "Axes.set_title", subtopic: "Annotation", syntax: "ax.set_title(label)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_title.html", tags: ["labels", "annotation", "titles"] },
    { id: "mpl-ax-set-xlim", name: "Axes.set_xlim", subtopic: "Axis Control", syntax: "ax.set_xlim(left=None, right=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlim.html", tags: ["axes", "limits", "formatting"] },
    { id: "mpl-ax-set-ylim", name: "Axes.set_ylim", subtopic: "Axis Control", syntax: "ax.set_ylim(bottom=None, top=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_ylim.html", tags: ["axes", "limits", "formatting"] },
    { id: "mpl-ax-grid", name: "Axes.grid", subtopic: "Axis Control", syntax: "ax.grid(visible=True, which='major', axis='both')", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.grid.html", tags: ["grid", "readability", "formatting"] },
    { id: "mpl-ax-axhline", name: "Axes.axhline", subtopic: "Annotation", syntax: "ax.axhline(y=0, xmin=0, xmax=1)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.axhline.html", tags: ["reference-lines", "thresholds", "annotation"] },
    { id: "mpl-ax-axvline", name: "Axes.axvline", subtopic: "Annotation", syntax: "ax.axvline(x=0, ymin=0, ymax=1)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.axvline.html", tags: ["reference-lines", "events", "annotation"] },
    { id: "mpl-ax-annotate", name: "Axes.annotate", subtopic: "Annotation", syntax: "ax.annotate(text, xy, xytext=None, arrowprops=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.annotate.html", tags: ["annotation", "labels", "explanations"] },
    { id: "mpl-ax-fill-between", name: "Axes.fill_between", subtopic: "Line and Area", syntax: "ax.fill_between(x, y1, y2=0)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html", tags: ["area", "confidence", "bands"] },
    { id: "mpl-ax-errorbar", name: "Axes.errorbar", subtopic: "Line and Area", syntax: "ax.errorbar(x, y, yerr=None, xerr=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.errorbar.html", tags: ["uncertainty", "error-bars", "lines"] },
    { id: "mpl-ax-boxplot", name: "Axes.boxplot", subtopic: "Distribution", syntax: "ax.boxplot(x)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html", tags: ["distribution", "outliers", "summary"] },
    { id: "mpl-ax-violinplot", name: "Axes.violinplot", subtopic: "Distribution", syntax: "ax.violinplot(dataset)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html", tags: ["distribution", "density", "summary"] },
    { id: "mpl-ax-pie", name: "Axes.pie", subtopic: "Categorical", syntax: "ax.pie(x, labels=None, autopct=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.pie.html", tags: ["categorical", "composition", "shares"] },
    { id: "mpl-ax-imshow", name: "Axes.imshow", subtopic: "Image and Matrix", syntax: "ax.imshow(X, cmap=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html", tags: ["matrix", "heat", "image"] },
    { id: "mpl-ax-twinx", name: "Axes.twinx", subtopic: "Axis Control", syntax: "ax2 = ax.twinx()", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.twinx.html", tags: ["dual-axis", "comparison", "axes"] },
    { id: "mpl-subplots-adjust", name: "plt.subplots_adjust", subtopic: "Figure Setup", syntax: "plt.subplots_adjust(left=None, right=None, wspace=None, hspace=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots_adjust.html", tags: ["layout", "spacing", "setup"] },
    { id: "mpl-figure-autofmt-xdate", name: "Figure.autofmt_xdate", subtopic: "Axis Control", syntax: "fig.autofmt_xdate(bottom=0.2, rotation=30)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.autofmt_xdate.html", tags: ["dates", "ticks", "formatting"] },
    { id: "mpl-close", name: "plt.close", subtopic: "Figure Setup", syntax: "plt.close(fig=None)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.close.html", tags: ["memory", "cleanup", "setup"] },
    { id: "mpl-ax-text", name: "Axes.text", subtopic: "Annotation", syntax: "ax.text(x, y, s)", docs: "https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html", tags: ["annotation", "labels", "text"] }
  ],
  seaborn: [
    { id: "sns-relplot", name: "seaborn.relplot", subtopic: "Relational", syntax: "sns.relplot(data, x=None, y=None, hue=None, col=None)", docs: "https://seaborn.pydata.org/generated/seaborn.relplot.html", tags: ["facets", "relational", "eda"] },
    { id: "sns-displot", name: "seaborn.displot", subtopic: "Distribution", syntax: "sns.displot(data, x=None, kind='hist')", docs: "https://seaborn.pydata.org/generated/seaborn.displot.html", tags: ["distribution", "histogram", "eda"] },
    { id: "sns-kdeplot", name: "seaborn.kdeplot", subtopic: "Distribution", syntax: "sns.kdeplot(data=None, x=None, y=None)", docs: "https://seaborn.pydata.org/generated/seaborn.kdeplot.html", tags: ["density", "distribution", "eda"] },
    { id: "sns-ecdfplot", name: "seaborn.ecdfplot", subtopic: "Distribution", syntax: "sns.ecdfplot(data=None, x=None, hue=None)", docs: "https://seaborn.pydata.org/generated/seaborn.ecdfplot.html", tags: ["cumulative", "distribution", "percentiles"] },
    { id: "sns-regplot", name: "seaborn.regplot", subtopic: "Relational", syntax: "sns.regplot(data=None, x=None, y=None)", docs: "https://seaborn.pydata.org/generated/seaborn.regplot.html", tags: ["regression", "relationship", "eda"] },
    { id: "sns-lmplot", name: "seaborn.lmplot", subtopic: "Relational", syntax: "sns.lmplot(data, x, y, hue=None, col=None)", docs: "https://seaborn.pydata.org/generated/seaborn.lmplot.html", tags: ["regression", "facets", "relationship"] },
    { id: "sns-jointplot", name: "seaborn.jointplot", subtopic: "Relational", syntax: "sns.jointplot(data=None, x=None, y=None, kind='scatter')", docs: "https://seaborn.pydata.org/generated/seaborn.jointplot.html", tags: ["joint", "relationship", "distribution"] },
    { id: "sns-countplot", name: "seaborn.countplot", subtopic: "Categorical", syntax: "sns.countplot(data=None, x=None, hue=None)", docs: "https://seaborn.pydata.org/generated/seaborn.countplot.html", tags: ["categorical", "counts", "eda"] },
    { id: "sns-stripplot", name: "seaborn.stripplot", subtopic: "Categorical", syntax: "sns.stripplot(data=None, x=None, y=None, jitter=True)", docs: "https://seaborn.pydata.org/generated/seaborn.stripplot.html", tags: ["categorical", "distribution", "points"] },
    { id: "sns-swarmplot", name: "seaborn.swarmplot", subtopic: "Categorical", syntax: "sns.swarmplot(data=None, x=None, y=None)", docs: "https://seaborn.pydata.org/generated/seaborn.swarmplot.html", tags: ["categorical", "distribution", "points"] },
    { id: "sns-pointplot", name: "seaborn.pointplot", subtopic: "Categorical", syntax: "sns.pointplot(data=None, x=None, y=None, hue=None)", docs: "https://seaborn.pydata.org/generated/seaborn.pointplot.html", tags: ["categorical", "estimates", "comparison"] },
    { id: "sns-boxenplot", name: "seaborn.boxenplot", subtopic: "Categorical", syntax: "sns.boxenplot(data=None, x=None, y=None)", docs: "https://seaborn.pydata.org/generated/seaborn.boxenplot.html", tags: ["categorical", "distribution", "quantiles"] },
    { id: "sns-clustermap", name: "seaborn.clustermap", subtopic: "Matrix", syntax: "sns.clustermap(data, metric='euclidean', method='average')", docs: "https://seaborn.pydata.org/generated/seaborn.clustermap.html", tags: ["matrix", "clustering", "heatmap"] },
    { id: "sns-facetgrid", name: "seaborn.FacetGrid", subtopic: "Relational", syntax: "sns.FacetGrid(data, row=None, col=None, hue=None)", docs: "https://seaborn.pydata.org/generated/seaborn.FacetGrid.html", tags: ["facets", "small-multiples", "layout"] },
    { id: "sns-pairgrid", name: "seaborn.PairGrid", subtopic: "Matrix", syntax: "sns.PairGrid(data, vars=None, hue=None)", docs: "https://seaborn.pydata.org/generated/seaborn.PairGrid.html", tags: ["pairwise", "matrix", "eda"] },
    { id: "sns-move-legend", name: "seaborn.move_legend", subtopic: "Styling", syntax: "sns.move_legend(obj, loc)", docs: "https://seaborn.pydata.org/generated/seaborn.move_legend.html", tags: ["legend", "styling", "layout"] },
    { id: "sns-color-palette", name: "seaborn.color_palette", subtopic: "Styling", syntax: "sns.color_palette(palette=None, n_colors=None)", docs: "https://seaborn.pydata.org/generated/seaborn.color_palette.html", tags: ["colors", "styling", "theme"] },
    { id: "sns-set-context", name: "seaborn.set_context", subtopic: "Styling", syntax: "sns.set_context(context, font_scale=1)", docs: "https://seaborn.pydata.org/generated/seaborn.set_context.html", tags: ["theme", "styling", "scale"] },
    { id: "sns-set-style", name: "seaborn.set_style", subtopic: "Styling", syntax: "sns.set_style(style='darkgrid')", docs: "https://seaborn.pydata.org/generated/seaborn.set_style.html", tags: ["theme", "style", "formatting"] },
    { id: "sns-residplot", name: "seaborn.residplot", subtopic: "Relational", syntax: "sns.residplot(data=None, x=None, y=None)", docs: "https://seaborn.pydata.org/generated/seaborn.residplot.html", tags: ["residuals", "diagnostics", "regression"] }
  ]
};

function slugFromId(id: string): string {
  return id
    .replace(/^py-/, "python-")
    .replace(/^np-/, "numpy-")
    .replace(/^pandas-/, "pandas-")
    .replace(/^sklearn-/, "sklearn-")
    .replace(/^mpl-/, "matplotlib-")
    .replace(/^sns-/, "seaborn-");
}

function exampleScenario(library: LibraryId, name: string): string {
  const scenarios: Record<LibraryId, string> = {
    python: "cleaning and validating exported business records before analytics steps",
    numpy: "building fast numeric transformations for feature engineering",
    pandas: "preparing tabular business data for reporting and modeling",
    sklearn: "training and evaluating a reproducible ML pipeline",
    matplotlib: "producing publication-quality KPI visuals",
    seaborn: "running exploratory statistical visualization workflows"
  };
  return `${name} is used in ${scenarios[library]}.`;
}

function codeTemplate(library: LibraryId, name: string, syntax: string): string {
  const template: Record<LibraryId, string[]> = {
    python: [
      "# 1) Toy business input",
      "records = [10, 20, 30]",
      `# 2) Apply ${name}`,
      `# ${syntax}`,
      "# 3) Inspect output and adapt field names to your dataset",
      "print(records)"
    ],
    numpy: [
      "import numpy as np",
      "arr = np.array([10, 20, 30])",
      `# Apply ${name}`,
      `# ${syntax}`,
      "print(arr.shape, arr[:2])"
    ],
    pandas: [
      "import pandas as pd",
      "df = pd.DataFrame({'segment': ['A', 'B'], 'value': [10, 20]})",
      `# Apply ${name}`,
      `# ${syntax}`,
      "print(df.head())"
    ],
    sklearn: [
      "import numpy as np",
      "X = np.array([[0.1, 1.0], [0.2, 0.8], [0.9, 0.1], [1.0, 0.2]])",
      "y = np.array([0, 0, 1, 1])",
      `# Apply ${name}`,
      `# ${syntax}`,
      "print(X.shape, y.shape)"
    ],
    matplotlib: [
      "import matplotlib.pyplot as plt",
      "fig, ax = plt.subplots()",
      "ax.plot([1, 2, 3], [2, 3, 5])",
      `# Apply ${name}`,
      `# ${syntax}`,
      "print(type(ax).__name__)"
    ],
    seaborn: [
      "import seaborn as sns",
      "import pandas as pd",
      "df = pd.DataFrame({'x':[1,2,3], 'y':[2,4,3], 'group':['A','A','B']})",
      `# Apply ${name}`,
      `# ${syntax}`,
      "print(df.shape)"
    ]
  };

  return template[library].join("\n");
}

function walkSteps(name: string): string[] {
  return [
    "Create a toy dataset that mirrors your project columns and value types.",
    `Apply ${name} with explicit parameters shown in the snippet, then verify shapes/dtypes.`,
    "Transfer the same pattern to your full dataset and rerun your validation checks."
  ];
}

function parseParams(syntax: string, name: string) {
  const match = syntax.match(/\(([^)]*)\)/);
  const raw = match?.[1] ?? "inputs";
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);

  return parts.map((part) => {
    const [paramNameRaw, defaultRaw] = part.split("=");
    const paramName = paramNameRaw.replace(/\*+/g, "").trim();
    const hasDefault = typeof defaultRaw === "string";
    const key = paramName.toLowerCase();
    const type = key.includes("size") || key.includes("n_") || key.includes("axis") ? "int" : key.includes("random") ? "int | None" : key.includes("drop") || key.includes("copy") || key.includes("inplace") ? "bool" : key.includes("col") || key.includes("label") || key.includes("style") || key.includes("kind") || key.includes("method") ? "str | list[str]" : "Any";
    return {
      name: paramName || "inputs",
      type,
      default: hasDefault ? defaultRaw.trim() : undefined,
      description: `Controls ${paramName || "inputs"} in ${name}.`,
      values: type === "bool" ? ["True", "False"] : type.includes("int") ? ["1", "5", "10"] : type.includes("str") ? ["'auto'", "'left'", "'mean'"] : ["data-specific"],
      pitfalls: ["Verify defaults and accepted values in the official docs for your installed version."]
    };
  });
}

function returnSpec(library: LibraryId) {
  if (library === "python") {
    return { type: "Python object", shape: "depends on input", description: "Return type depends on object and operation semantics." };
  }
  if (library === "numpy") {
    return { type: "numpy.ndarray | scalar", shape: "depends on operation", description: "Numeric array/scalar output from vectorized computation." };
  }
  if (library === "pandas") {
    return { type: "DataFrame | Series | scalar", shape: "(rows, columns) or scalar", description: "Tabular transformation or summary result." };
  }
  if (library === "sklearn") {
    return { type: "estimator | array | metric", shape: "depends on estimator and data", description: "Fitted estimator, transformed matrix, or evaluation scalar." };
  }
  return { type: "Axes | Figure | Grid | None", shape: "n/a", description: "Visualization object for further customization and rendering." };
}

function buildCommand(library: LibraryId, spec: Compact): CommandEntry {
  const params = parseParams(spec.syntax, spec.name);
  return {
    id: spec.id,
    slug: slugFromId(spec.id),
    name: spec.name,
    library,
    subtopic: spec.subtopic,
    tags: spec.tags,
    level: "extended",
    summary: spec.name + " is a frequently used API in practical data science workflows.",
    syntax: spec.syntax,
    description: `${spec.name} helps with ${spec.subtopic.toLowerCase()} tasks. Use it when implementing production-style patterns with reproducible transformations and checks.`,
    overview: `${spec.name} gives a reusable pattern for ${spec.subtopic.toLowerCase()} in ${library}. It is commonly used while iterating in notebooks and then hardening logic into project scripts or pipelines.`,
    applications: [
      `Primary application: ${exampleScenario(library, spec.name)}`,
      "Operational application: convert notebook steps into deterministic, testable pipeline code.",
      "Team application: use the same API pattern to keep analyses consistent across projects."
    ],
    docs: [{ label: `${spec.name} official docs`, url: spec.docs || libraryMeta[library].defaultsDoc }],
    parameters: params.length > 0 ? params : parseParams("inputs", spec.name),
    returns: returnSpec(library),
    examples: [
      {
        title: `${spec.name} step-by-step pattern`,
        scenario: exampleScenario(library, spec.name),
        code: codeTemplate(library, spec.name, spec.syntax),
        expectedOutput: "Output should confirm shape/type and provide a baseline you can adapt to your own dataset.",
        walkthrough: walkSteps(spec.name)
      }
    ],
    notes: [
      "Start with toy data and explicit parameters, then scale to full datasets.",
      "Always verify version-specific defaults in official docs before production deployment."
    ],
    related: []
  };
}

function enrichCommand(library: LibraryId, command: CommandEntry): CommandEntry {
  return {
    ...command,
    overview:
      command.overview && command.overview.trim().length > 0
        ? command.overview
        : `${command.name} is part of ${command.subtopic.toLowerCase()} workflows in ${library}.`,
    applications:
      command.applications && command.applications.length >= 2
        ? command.applications
        : [
            `Primary use: ${command.summary}`,
            "Prototype with toy data before moving to full production data.",
            "Document parameter choices so teammates can reproduce your logic."
          ],
    examples: command.examples.map((example) => ({
      ...example,
      walkthrough:
        example.walkthrough && example.walkthrough.length >= 2
          ? example.walkthrough
          : walkSteps(command.name)
    }))
  };
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function main() {
  const files = (await fs.readdir(commandsDir)).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const libraryContent = JSON.parse(raw) as LibraryContent;
    const lib = libraryContent.library as LibraryId;

    const existingMap = new Map<string, CommandEntry>(
      libraryContent.commands.map((cmd) => [cmd.id, enrichCommand(lib, cmd as CommandEntry)])
    );

    const addedCommands = extras[lib].map((spec) => buildCommand(lib, spec));
    for (const cmd of addedCommands) {
      if (!existingMap.has(cmd.id)) {
        existingMap.set(cmd.id, cmd);
      }
    }

    const merged = Array.from(existingMap.values());
    const addedIds = addedCommands.map((c) => c.id).filter((id) => !libraryContent.commands.some((c) => c.id === id));

    libraryContent.overview = libraryMeta[lib].overview;
    libraryContent.applications = libraryMeta[lib].applications;
    libraryContent.commands = merged;
    libraryContent.subtopics = unique(merged.map((c) => c.subtopic));

    const extGroupName = "Extended APIs and Step-by-Step Patterns";
    const extGroupIndex = libraryContent.commandGroups.findIndex((g) => g.name === extGroupName);
    if (extGroupIndex === -1) {
      libraryContent.commandGroups.push({
        name: extGroupName,
        docs: [{ label: `${libraryContent.title} official docs`, url: libraryMeta[lib].defaultsDoc }],
        commandIds: addedIds
      });
    } else {
      libraryContent.commandGroups[extGroupIndex].commandIds = unique([
        ...libraryContent.commandGroups[extGroupIndex].commandIds,
        ...addedIds
      ]);
    }

    libraryContent.cheatSheet = unique([...libraryContent.cheatSheet, ...addedIds]).slice(0, 40);

    await fs.writeFile(filePath, `${JSON.stringify(libraryContent, null, 2)}\n`, "utf8");
  }

  console.log("Expanded all library content with richer metadata and +20 commands per library.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
