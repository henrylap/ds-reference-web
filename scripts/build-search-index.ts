import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSearchDocument } from "../lib/search-doc";
import { libraryContentSchema, searchDocumentSchema } from "../lib/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const commandsDir = path.join(root, "content", "commands");
const outputPath = path.join(root, "public", "search-index.json");

async function main() {
  const files = (await fs.readdir(commandsDir)).filter((file) => file.endsWith(".json"));

  const libraries = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(commandsDir, file), "utf8");
      return libraryContentSchema.parse(JSON.parse(raw));
    })
  );

  const docs = libraries.flatMap((library) =>
    library.commands.map((command) => searchDocumentSchema.parse(buildSearchDocument(command)))
  );

  await fs.writeFile(outputPath, JSON.stringify(docs, null, 2), "utf8");
  console.log(`Wrote ${docs.length} search docs to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
