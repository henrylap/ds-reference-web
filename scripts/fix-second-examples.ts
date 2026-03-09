import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CommandEntry, LibraryContent } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dir = path.join(root, "content", "commands");

function firstCall(syntax: string): string {
  return syntax.split(";")[0]?.trim() ?? syntax.trim();
}

function normalizeCall(command: CommandEntry): string {
  let call = firstCall(command.syntax);

  return call
    .replace("df.iloc[row_indexer, col_indexer]", "df.iloc[:, :2]")
    .replace("df.groupby(keys)[col].transform(func)", "df.groupby(['segment'])['value'].transform('mean')")
    .replace("pd.melt(frame, id_vars=None, value_vars=None)", "pd.melt(df, id_vars=['segment'], value_vars=['value'])")
    .replace("pd.concat(objs, axis=0, ignore_index=False)", "pd.concat([df.iloc[:2], df.iloc[2:]], ignore_index=True)")
    .replace("df.join(other, on=None, how='left')", "df.join(other, how='left')")
    .replace("pd.cut(x, bins, labels=None)", "pd.cut(df['value'], bins=[0,15,30,50], labels=['low','mid','high'])")
    .replace("pd.qcut(x, q, labels=None)", "pd.qcut(df['value'], q=2, labels=['low','high'])")
    .replace("df.rolling(window, min_periods=None)", "df[['value']].rolling(window=2)")
    .replace("shape", "(2, 3)")
    .replace("fill_value", "0.5")
    .replace("arrays", "[arr1, arr2]")
    .replace("tup", "(arr1, arr2)")
    .replace("ary", "np.arange(8)")
    .replace("indices_or_sections", "4")
    .replace("ar", "np.array([1, 1, 2, 3])")
    .replace("q", "0.9")
    .replace("obj", "records")
    .replace("iterable", "records")
    .replace("value", "records[0]")
    .replace("path_str", "'data/sales.csv'")
    .replace(/\\ba\\b/g, "arr")
    .replace(/\\bx\\b/g, "arr");
}

function activeSecond(command: CommandEntry) {
  const call = normalizeCall(command);

  if (command.library === "python") {
    return `records = [120, 140, 160]\nresult = ${call}\nprint(type(result).__name__, result)`;
  }

  if (command.library === "numpy") {
    return `import numpy as np\narr = np.array([10.0, 20.0, 30.0])\narr1 = np.array([1, 2])\narr2 = np.array([3, 4])\nresult = ${call}\nprint(type(result).__name__)`;
  }

  if (command.library === "pandas") {
    return `import pandas as pd\ndf = pd.DataFrame({'segment':['A','B','A'], 'value':[10,20,30]})\nother = pd.DataFrame({'tier':['gold','silver','gold']}, index=df.index)\nresult = ${call}\nprint(type(result).__name__)`;
  }

  if (command.library === "sklearn") {
    return `import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\n\nX = np.array([[0.1,1.0],[0.2,0.8],[0.8,0.2],[0.9,0.1],[0.15,0.85],[0.75,0.25]])\ny = np.array([0,0,1,1,0,1])\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train, y_train)\nprint(model.predict(X_test))`;
  }

  if (command.library === "matplotlib") {
    return `import matplotlib.pyplot as plt\nplt.style.use('seaborn-v0_8-whitegrid')\nfig, ax = plt.subplots(figsize=(7,4), dpi=120)\nax.plot([1,2,3], [2,3,5], color='#0f7a84', marker='o')\nax.set_title('Styled KPI trend')\nplt.tight_layout()\nprint(type(ax).__name__)`;
  }

  return `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\nsns.set_theme(style='whitegrid', palette='Set2')\ndf = pd.DataFrame({'x':[1,2,3], 'y':[2,4,3], 'group':['A','A','B']})\nax = sns.lineplot(data=df, x='x', y='y', hue='group', marker='o')\nplt.tight_layout()\nprint(type(ax).__name__)`;
}

async function main() {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, 'utf8');
    const lib = JSON.parse(raw) as LibraryContent;

    lib.commands = lib.commands.map((command) => {
      if (command.examples.length < 2) {
        return command;
      }

      command.examples[1].title = `${command.name} additional business case`;
      command.examples[1].scenario = "Second realistic usage variant for adapting the command to another business dataset slice.";
      command.examples[1].code = activeSecond(command as CommandEntry);
      command.examples[1].expectedOutput = "Output confirms executable pattern for a second business use case.";
      command.examples[1].walkthrough = [
        "Create a second toy business slice (different segment/time window).",
        `Run ${command.name} again on this alternate slice to validate transferability.`,
        "Move the same pattern into your production notebook/script with assertions."
      ];

      return command;
    });

    await fs.writeFile(full, `${JSON.stringify(lib, null, 2)}\n`, 'utf8');
  }

  console.log('Converted second examples to active executable snippets.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

