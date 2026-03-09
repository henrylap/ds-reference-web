import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSearchDocument } from "../lib/search-doc";
import {
  libraryContentSchema,
  recipeSchema,
  searchDocumentSchema
} from "../lib/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const commandsDir = path.join(root, "content", "commands");
const recipesPath = path.join(root, "content", "recipes", "workflows.json");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function main() {
  const files = (await fs.readdir(commandsDir)).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    throw new Error("No command content files found in content/commands");
  }

  const libraries = [];

  for (const file of files) {
    const content = await readJsonFile<unknown>(path.join(commandsDir, file));
    const parsed = libraryContentSchema.parse(content);
    libraries.push(parsed);
  }

  const allCommands = libraries.flatMap((library) => library.commands);
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const command of allCommands) {
    if (ids.has(command.id)) {
      throw new Error(`Duplicate command id detected: ${command.id}`);
    }
    ids.add(command.id);

    if (slugs.has(command.slug)) {
      throw new Error(`Duplicate command slug detected: ${command.slug}`);
    }
    slugs.add(command.slug);
  }

  for (const library of libraries) {
    const localIds = new Set(library.commands.map((command) => command.id));

    for (const group of library.commandGroups) {
      for (const commandId of group.commandIds) {
        if (!localIds.has(commandId)) {
          throw new Error(
            `Library '${library.library}' group '${group.name}' references missing command id '${commandId}'`
          );
        }
      }
    }

    for (const commandId of library.cheatSheet) {
      if (!localIds.has(commandId)) {
        throw new Error(
          `Library '${library.library}' cheat sheet references missing command id '${commandId}'`
        );
      }
    }
  }

  for (const command of allCommands) {
    for (const related of command.related) {
      if (!ids.has(related)) {
        throw new Error(`Command '${command.id}' references missing related id '${related}'`);
      }
    }
  }

  const recipesRaw = await readJsonFile<unknown[]>(recipesPath);
  const recipes = recipesRaw.map((recipe) => recipeSchema.parse(recipe));

  for (const recipe of recipes) {
    if (recipe.libraries.length === 0) {
      throw new Error(`Recipe '${recipe.id}' must include at least one library`);
    }
  }

  const searchDocs = allCommands.map((command) => buildSearchDocument(command));
  searchDocs.forEach((doc) => searchDocumentSchema.parse(doc));

  console.log(`Validated ${libraries.length} libraries, ${allCommands.length} commands, ${recipes.length} recipes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
