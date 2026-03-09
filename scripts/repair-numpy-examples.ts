import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { LibraryContent, CommandEntry } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const filePath = path.join(root, "content", "commands", "numpy.json");

function firstCall(syntax: string): string {
  return syntax.split(";")[0]?.trim() ?? syntax.trim();
}

function safeCall(command: CommandEntry): string {
  return firstCall(command.syntax)
    .replace(/\bshape\b/g, "(2, 3)")
    .replace(/\bfill_value\b/g, "0.5")
    .replace(/\barrays\b/g, "[arr1, arr2]")
    .replace(/\btup\b/g, "(arr1, arr2)")
    .replace(/\bary\b/g, "np.arange(8)")
    .replace(/\bindices_or_sections\b/g, "4")
    .replace(/\bar\b/g, "np.array([1, 1, 2, 3])")
    .replace(/\bq\b/g, "0.9")
    .replace(/\ba_min\b/g, "0")
    .replace(/\ba_max\b/g, "25")
    .replace(/\baxes\b/g, "None")
    .replace(/\ba\b/g, "arr")
    .replace(/\bx\b/g, "arr");
}

function example(command: CommandEntry) {
  const call = safeCall(command);
  return {
    title: `${command.name} for pricing feature matrix prep`,
    scenario: "Pricing analytics uses numeric arrays for fast transformations and robust KPI calculations.",
    code: `import numpy as np\n\narr = np.array([10.0, 20.0, 30.0, 40.0])\narr1 = np.array([1, 2])\narr2 = np.array([3, 4])\n\nresult = ${call}\n\nif hasattr(result, 'shape'):\n    print(type(result).__name__, result.shape)\nelse:\n    print(type(result).__name__, result)`,
    expectedOutput: "Output confirms NumPy result type and shape/value for direct adaptation into feature pipelines.",
    walkthrough: [
      "Build a toy numeric array matching your feature scale and dimensionality.",
      `Execute ${command.name} as an active code line and capture output in result.`,
      "Validate result shape/value, then apply identical logic to full production arrays."
    ]
  };
}

async function main() {
  const raw = await fs.readFile(filePath, "utf8");
  const lib = JSON.parse(raw) as LibraryContent;

  lib.commands = lib.commands.map((command) => {
    const c = command as CommandEntry;
    if (c.examples[0].code.includes("arrrray") || c.examples[0].title.includes("pricing feature matrix prep")) {
      c.examples[0] = example(c);
    }
    return c;
  });

  await fs.writeFile(filePath, `${JSON.stringify(lib, null, 2)}\n`, "utf8");
  console.log("Repaired NumPy generated examples.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
