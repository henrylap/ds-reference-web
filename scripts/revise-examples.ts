import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CommandEntry, ExampleSpec, LibraryContent } from "../lib/types";

type ExampleOutput = {
  title: string;
  scenario: string;
  code: string;
  expectedOutput: string;
  walkthrough: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const commandsDir = path.join(root, "content", "commands");

function firstCall(syntax: string): string {
  return syntax.split(";")[0]?.trim() ?? syntax.trim();
}

function buildSecondExample(command: CommandEntry): ExampleSpec {
  return {
    title: `${command.name} production adaptation` ,
    scenario: "Production adaptation pattern: run the same command logic on your real dataset after validating with toy data.",
    code: `# Production adaptation checklist\n# 1) Replace toy table/array with your project dataset\n# 2) Keep the same command structure\n# 3) Add assertions for shape/dtypes after running\n\nprint(\"Use the validated ${command.name} pattern in your pipeline\")`,
    expectedOutput: `Use the validated ${command.name} pattern in your pipeline`,
    walkthrough: [
      "Replace toy sample values with your project columns and data types.",
      "Run the same command sequence and compare outputs against expected business checks.",
      "Persist the logic in your pipeline/notebook and add validation assertions."
    ]
  };
}

function pandasExample(command: CommandEntry): ExampleOutput {
  const call = firstCall(command.syntax)
    .replace("df.iloc[row_indexer, col_indexer]", "df.iloc[:, :2]")
    .replace("df.groupby(keys)[col].transform(func)", "df.groupby(['segment'])['value'].transform('mean')")
    .replace("pd.melt(frame, id_vars=None, value_vars=None)", "pd.melt(df, id_vars=['segment'], value_vars=['value'])")
    .replace("pd.concat(objs, axis=0, ignore_index=False)", "pd.concat([df.iloc[:2], df.iloc[2:]], ignore_index=True)")
    .replace("df.join(other, on=None, how='left')", "df.join(other, how='left')")
    .replace("pd.cut(x, bins, labels=None)", "pd.cut(df['value'], bins=[0, 15, 30, 50], labels=['low','mid','high'])")
    .replace("pd.qcut(x, q, labels=None)", "pd.qcut(df['value'], q=2, labels=['low','high'])")
    .replace("df.rolling(window, min_periods=None)", "df[['value']].rolling(window=2)")
    .replace("df.replace(to_replace, value)", "df.replace(-1, pd.NA)")
    .replace("df.shift(periods=1)", "df.shift(periods=1)");

  return {
    title: `${command.name} for segmented revenue reporting`,
    scenario: "Revenue analytics workflow using segmented business records and repeatable table transformations.",
    code: `import pandas as pd\n\ndf = pd.DataFrame({\n    'segment': ['A', 'A', 'B', 'C'],\n    'value': [10, 20, 30, 40],\n    'date': pd.date_range('2026-01-01', periods=4)\n})\nother = pd.DataFrame({'tier': ['gold', 'gold', 'silver', 'bronze']}, index=df.index)\n\nresult = ${call}\n\nif hasattr(result, 'shape'):\n    print(type(result).__name__, result.shape)\nelse:\n    print(type(result).__name__, result)`,
    expectedOutput: "Printed output shows command result type and shape/value, ready to adapt to your real table.",
    walkthrough: [
      "Create a small DataFrame that mirrors your business columns (segment, value, date).",
      `Run ${command.name} directly (not commented) and store output in \`result\`.`,
      "Check output type/shape, then swap in your project DataFrame and keep the same pattern."
    ]
  };
}

function numpyExample(command: CommandEntry): ExampleOutput {
  const call = firstCall(command.syntax)
    .replace("shape", "(2, 3)")
    .replace("fill_value", "0.5")
    .replace("arrays", "[arr1, arr2]")
    .replace("tup", "(arr1, arr2)")
    .replace("ary", "np.arange(8)")
    .replace("indices_or_sections", "4")
    .replace("ar", "np.array([1, 1, 2, 3])")
    .replace("a", "arr")
    .replace("x", "arr")
    .replace("q", "0.9")
    .replace("a_min", "0")
    .replace("a_max", "25")
    .replace("axes", "None");

  return {
    title: `${command.name} for pricing feature matrix prep`,
    scenario: "Pricing analytics uses numeric arrays for fast transformations and robust KPI calculations.",
    code: `import numpy as np\n\narr = np.array([10.0, 20.0, 30.0, 40.0])\narr1 = np.array([1, 2])\narr2 = np.array([3, 4])\nb = np.array([9.0, 8.0])\n\nresult = ${call}\n\nif hasattr(result, 'shape'):\n    print(type(result).__name__, result.shape)\nelse:\n    print(type(result).__name__, result)`,
    expectedOutput: "Output confirms NumPy result type and shape/value for direct adaptation into feature pipelines.",
    walkthrough: [
      "Build a toy numeric array matching your feature scale and dimensionality.",
      `Execute ${command.name} as an active code line and capture output in \`result\`.`,
      "Validate result shape/value, then apply identical logic to full production arrays."
    ]
  };
}

function pythonExample(command: CommandEntry): ExampleOutput {
  const id = command.id;

  if (id === "py-match-case") {
    return {
      title: "match/case for transaction-state routing",
      scenario: "Payments workflow routes events into accounting actions by transaction status.",
      code: `status = 'refund'\n\nmatch status:\n    case 'success':\n        action = 'book_revenue'\n    case 'refund':\n        action = 'reverse_revenue'\n    case _:\n        action = 'manual_review'\n\nprint(action)`,
      expectedOutput: "reverse_revenue",
      walkthrough: [
        "Create a toy status field from a real transaction lifecycle.",
        "Map each status to a business action using match/case branches.",
        "Apply the same pattern to your real event stream with explicit default handling."
      ]
    };
  }

  const call = firstCall(command.syntax)
    .replace("obj", "records")
    .replace("iterable", "records")
    .replace("path_str", "'data/sales.csv'")
    .replace("value", "records[0]");

  return {
    title: `${command.name} for operations data scripting`,
    scenario: "Operations script performs deterministic checks and transformations on small business record sets.",
    code: `records = [120, 140, 160]\nresult = ${call}\nprint(type(result).__name__, result)`,
    expectedOutput: "Output shows the concrete return type/value from the active command line.",
    walkthrough: [
      "Start with toy business records in plain Python structures.",
      `Run ${command.name} as executable code (not a comment).`,
      "Verify the returned object/value and then port the same logic to your project script."
    ]
  };
}

function sklearnExample(command: CommandEntry): ExampleOutput {
  const id = command.id;

  if (["sklearn-linearregression", "sklearn-ridge", "sklearn-lasso"].includes(id)) {
    const modelName =
      id === "sklearn-linearregression"
        ? "LinearRegression"
        : id === "sklearn-ridge"
        ? "Ridge"
        : "Lasso";

    return {
      title: `${modelName} end-to-end revenue forecasting workflow`,
      scenario: "Build a complete regression flow from imports to fit/predict and deployment artifact save.",
      code: `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.linear_model import ${modelName}\nimport joblib\n\ndf = pd.DataFrame({\n    'channel': ['ads', 'email', 'ads', 'seo', 'email', 'seo'],\n    'price': [12, 15, 13, 20, 14, 22],\n    'discount_pct': [0.10, 0.00, 0.05, 0.20, 0.03, 0.12],\n    'units_sold': [120, 100, 130, 90, 110, 95]\n})\n\nX = df[['channel', 'price', 'discount_pct']]\ny = df['units_sold']\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\npreprocess = ColumnTransformer([\n    ('num', StandardScaler(), ['price', 'discount_pct']),\n    ('cat', OneHotEncoder(handle_unknown='ignore'), ['channel'])\n])\n\nmodel = ${modelName}()\npipeline = Pipeline([('prep', preprocess), ('model', model)])\npipeline.fit(X_train, y_train)\n\npreds = pipeline.predict(X_test)\nprint(preds.shape)\n\njoblib.dump(pipeline, 'linreg_pipeline.joblib')\nloaded = joblib.load('linreg_pipeline.joblib')\nprint(loaded.predict(pd.DataFrame({'channel':['ads'], 'price':[16], 'discount_pct':[0.08]})).round(2))`,
      expectedOutput: "Output prints prediction shape and a deployed-model inference prediction.",
      walkthrough: [
        "Import model + preprocessing tools and build a toy business dataset with categorical and numeric features.",
        "Define X/y, split train/test, build preprocessing + model pipeline, then fit and predict.",
        "Persist the fitted pipeline with joblib and run a single-row inference as deployment-style validation."
      ]
    };
  }

  if (id === "sklearn-onehotencoder") {
    return {
      title: "OneHotEncoder integrated in model training and deployment",
      scenario: "Categorical marketing features are encoded, fitted in a pipeline, and reused at inference.",
      code: `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import OneHotEncoder\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.DataFrame({\n    'channel': ['ads', 'organic', 'email', 'ads', 'seo', 'email'],\n    'monthly_spend': [1200, 450, 700, 1500, 300, 650],\n    'churn': [0, 1, 0, 0, 1, 0]\n})\n\nX = df[['channel', 'monthly_spend']]\ny = df['churn']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\npreprocess = ColumnTransformer([\n    ('cat', OneHotEncoder(handle_unknown='ignore'), ['channel']),\n    ('num', 'passthrough', ['monthly_spend'])\n])\n\npipeline = Pipeline([\n    ('prep', preprocess),\n    ('model', LogisticRegression(max_iter=500))\n])\n\npipeline.fit(X_train, y_train)\nprint(pipeline.predict(X_test)[:3])\n\nnew_rows = pd.DataFrame({'channel': ['affiliate'], 'monthly_spend': [520]})\nprint(pipeline.predict(new_rows))`,
      expectedOutput: "Output prints churn predictions for test rows and a new inference row with unseen category handling.",
      walkthrough: [
        "Build toy X/y data with a categorical feature and split into train/test.",
        "Place OneHotEncoder inside ColumnTransformer and connect it to a model pipeline, then fit.",
        "Predict on test data and on a new row to verify inference-time category handling."
      ]
    };
  }

  const modelWorkflow = `import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\n\nX = np.array([[0.1, 1.0], [0.2, 0.9], [0.8, 0.2], [0.9, 0.1], [0.15, 0.85], [0.75, 0.25]])\ny = np.array([0, 0, 1, 1, 0, 1])\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\n\nprint(preds.shape)`;

  return {
    title: `${command.name} in a full modeling workflow`,
    scenario: "Classification workflow from train/test split through fitting and scoring pattern.",
    code: modelWorkflow,
    expectedOutput: "Output prints prediction shape after model fit and inference steps.",
    walkthrough: [
      "Prepare X and y arrays from business-like feature/target fields.",
      "Split data, initialize model, and call fit before running predictions.",
      "Use the same workflow structure with your project features and deployment checks."
    ]
  };
}

function vizExample(command: CommandEntry): ExampleOutput {
  const isSeaborn = command.library === "seaborn";

  const code = isSeaborn
    ? `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\nsns.set_theme(style='whitegrid', context='talk', palette='Set2')\ndf = pd.DataFrame({\n    'month': ['Jan', 'Feb', 'Mar', 'Apr'],\n    'revenue_k': [120, 135, 150, 145],\n    'channel': ['ads', 'ads', 'organic', 'organic']\n})\n\nax = sns.lineplot(data=df, x='month', y='revenue_k', hue='channel', marker='o')\nax.set_title('Revenue trend by channel')\nax.set_xlabel('Month')\nax.set_ylabel('Revenue (k USD)')\nax.figure.set_facecolor('#f7fbff')\nplt.tight_layout()\nprint(type(ax).__name__)`
    : `import matplotlib.pyplot as plt\n\nplt.style.use('seaborn-v0_8-whitegrid')\nfig, ax = plt.subplots(figsize=(8, 4.5), dpi=120)\n\nmonths = ['Jan', 'Feb', 'Mar', 'Apr']\nrevenue = [120, 135, 150, 145]\nax.plot(months, revenue, color='#0f7a84', marker='o', linewidth=2.5)\n\nax.set_title('Revenue trend by month', fontsize=14, weight='bold')\nax.set_xlabel('Month')\nax.set_ylabel('Revenue (k USD)')\nax.set_facecolor('#f7fbff')\nfig.patch.set_facecolor('#edf5f8')\nax.grid(alpha=0.3)\n\nplt.tight_layout()\nprint(type(ax).__name__)`;

  return {
    title: `${command.name} with polished business chart styling`,
    scenario: "Visualization example optimized for stakeholder-facing charts with clean colors, spacing, and readability.",
    code,
    expectedOutput: "Output confirms plot object creation; chart style uses clean palette, readable labels, and dashboard-friendly aesthetics.",
    walkthrough: [
      "Set a clear visual theme (palette, context, background) before plotting.",
      "Plot business metrics with readable labels, title, and spacing.",
      "Apply layout and style tweaks so the chart is presentation-ready."
    ]
  };
}

function rebuildExample(command: CommandEntry): ExampleOutput {
  if (command.library === "sklearn") {
    return sklearnExample(command);
  }
  if (command.library === "pandas") {
    return pandasExample(command);
  }
  if (command.library === "numpy") {
    return numpyExample(command);
  }
  if (command.library === "python") {
    return pythonExample(command);
  }
  return vizExample(command);
}

async function main() {
  const files = (await fs.readdir(commandsDir)).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const lib = JSON.parse(raw) as LibraryContent;

    lib.commands = lib.commands.map((command) => {
      const needsRewrite =
        command.examples.some((ex) => ex.code.includes("# Apply")) ||
        command.library === "sklearn";

      if (!needsRewrite) {
        const examples =
          command.examples.length === 1
            ? [...command.examples, buildSecondExample(command)]
            : command.examples;
        return { ...command, examples };
      }

      const fresh = rebuildExample(command as CommandEntry);
      const second = buildSecondExample(command as CommandEntry);

      return {
        ...command,
        examples: [fresh, second]
      };
    });

    await fs.writeFile(filePath, `${JSON.stringify(lib, null, 2)}\n`, "utf8");
  }

  console.log("Revised command examples with business workflows and active command lines.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
