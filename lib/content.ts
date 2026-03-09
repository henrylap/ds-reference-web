import python from "@/content/commands/python-fundamentals.json";
import sql from "@/content/commands/sql.json";
import rstudio from "@/content/commands/rstudio.json";
import numpy from "@/content/commands/numpy.json";
import pandas from "@/content/commands/pandas.json";
import sklearn from "@/content/commands/sklearn.json";
import matplotlib from "@/content/commands/matplotlib.json";
import seaborn from "@/content/commands/seaborn.json";
import recipes from "@/content/recipes/workflows.json";
import type { CommandEntry, LibraryContent, LibraryId, Recipe } from "@/lib/types";
import { libraryContentSchema, recipeSchema } from "@/lib/schema";

const rawLibraries = [
  python,
  sql,
  rstudio,
  numpy,
  pandas,
  sklearn,
  matplotlib,
  seaborn
] as unknown[];

export const libraries: LibraryContent[] = rawLibraries.map((library) =>
  libraryContentSchema.parse(library)
) as LibraryContent[];

export const recipeList: Recipe[] = (recipes as unknown[]).map((recipe) =>
  recipeSchema.parse(recipe)
) as Recipe[];

export const allCommands: CommandEntry[] = libraries.flatMap((lib) => lib.commands);

export const commandBySlug = new Map(allCommands.map((command) => [command.slug, command]));

export const libraryById = new Map(libraries.map((library) => [library.library, library]));

export const libraryLabels: Record<LibraryId, string> = libraries.reduce(
  (acc, library) => {
    acc[library.library] = library.title;
    return acc;
  },
  {} as Record<LibraryId, string>
);

export function getCommand(slug: string): CommandEntry | undefined {
  return commandBySlug.get(slug);
}

export function getLibrary(libraryId: LibraryId): LibraryContent | undefined {
  return libraryById.get(libraryId);
}

export function getCommandsForLibrary(libraryId: LibraryId): CommandEntry[] {
  return allCommands.filter((command) => command.library === libraryId);
}

export function getTopCheatSheetCommands(libraryId: LibraryId): CommandEntry[] {
  const library = getLibrary(libraryId);
  if (!library) {
    return [];
  }

  const idSet = new Set(library.cheatSheet);
  return library.commands.filter((command) => idSet.has(command.id));
}

export function groupCommandsBySubtopic(commands: CommandEntry[]): Record<string, CommandEntry[]> {
  return commands.reduce<Record<string, CommandEntry[]>>((acc, command) => {
    const key = command.subtopic;
    acc[key] = acc[key] ?? [];
    acc[key].push(command);
    return acc;
  }, {});
}

export const commandLookupById = new Map(allCommands.map((command) => [command.id, command]));
