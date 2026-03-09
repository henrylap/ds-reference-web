import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { LibraryContent } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const filePath = path.join(root, "content", "commands", "numpy.json");

const calls: Record<string, string> = {
  "np-array": "np.array([1, 2, 3], dtype=float)",
  "np-arange": "np.arange(0, 10, 2, dtype=int)",
  "np-linspace": "np.linspace(0, 1, num=5)",
  "np-reshape": "np.arange(12).reshape(3, 4)",
  "np-concatenate": "np.concatenate([arr1, arr2])",
  "np-where": "np.where(arr > 20, 'high', 'low')",
  "np-mean": "np.mean(arr)",
  "np-std": "np.std(arr)",
  "np-percentile": "np.percentile(arr, 90)",
  "np-dot": "np.dot(arr1, arr2)",
  "np-random-default-rng": "np.random.default_rng(42).normal(loc=0, scale=1, size=3)",
  "np-isnan": "np.isnan(np.array([1.0, np.nan, 2.0]))",
  "np-zeros": "np.zeros((2, 3))",
  "np-ones": "np.ones((2, 3))",
  "np-full": "np.full((2, 3), 0.5)",
  "np-stack": "np.stack([arr1, arr2], axis=0)",
  "np-vstack": "np.vstack((arr1, arr2))",
  "np-hstack": "np.hstack((arr1, arr2))",
  "np-split": "np.split(np.arange(8), 4)",
  "np-unique": "np.unique(np.array([1, 1, 2, 3]), return_counts=True)",
  "np-sort": "np.sort(arr)",
  "np-argsort": "np.argsort(arr)",
  "np-argmax": "np.argmax(arr)",
  "np-sum": "np.sum(arr)",
  "np-median": "np.median(arr)",
  "np-quantile": "np.quantile(arr, 0.9)",
  "np-nanmean": "np.nanmean(np.array([1.0, np.nan, 3.0]))",
  "np-clip": "np.clip(arr, 12, 28)",
  "np-log": "np.log(np.array([1.0, 10.0, 100.0]))",
  "np-exp": "np.exp(np.array([0.0, 1.0, 2.0]))",
  "np-transpose": "np.transpose(np.array([[1, 2, 3], [4, 5, 6]]))",
  "np-linalg-solve": "np.linalg.solve(np.array([[3, 1], [1, 2]]), np.array([9, 8]))"
};

async function main() {
  const raw = await fs.readFile(filePath, "utf8");
  const lib = JSON.parse(raw) as LibraryContent;

  lib.commands = lib.commands.map((command) => {
    if (command.examples.length < 2) {
      return command;
    }

    const call = calls[command.id] ?? "np.mean(arr)";

    command.examples[1].title = `${command.name} additional business case`;
    command.examples[1].scenario = "Secondary business slice: confirm the same numeric pattern on another cohort before production rollout.";
    command.examples[1].code = `import numpy as np\n\narr = np.array([10.0, 20.0, 30.0, 40.0])\narr1 = np.array([1.0, 2.0])\narr2 = np.array([3.0, 4.0])\n\nresult = ${call}\n\nif hasattr(result, 'shape'):\n    print(type(result).__name__, result.shape)\nelse:\n    print(type(result).__name__, result)`;
    command.examples[1].expectedOutput = "Output confirms executable numeric pattern for a second business use case.";
    command.examples[1].walkthrough = [
      "Create a second toy numeric slice with realistic magnitudes.",
      `Execute ${command.name} directly and inspect output type/shape/value.`,
      "Reuse the same code pattern in your production feature engineering step."
    ];

    return command;
  });

  await fs.writeFile(filePath, `${JSON.stringify(lib, null, 2)}\n`, "utf8");
  console.log("Normalized NumPy second examples with safe active calls.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
