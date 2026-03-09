import type { CommandEntry, SearchDocument } from "@/lib/types";

const NON_ALNUM = /[^a-z0-9]+/g;

export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(NON_ALNUM, " ").trim();
}

function splitWords(value: string): string[] {
  const withSpaces = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_./()-]+/g, " ");
  return withSpaces
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

export function createSearchAliases(command: CommandEntry): string[] {
  const nameWords = splitWords(command.name);
  const idWords = splitWords(command.id);
  const syntaxWords = splitWords(command.syntax).slice(0, 16);

  const aliases = [
    command.name,
    command.id,
    command.slug,
    nameWords.join(" "),
    nameWords.join(""),
    idWords.join(" "),
    idWords.join(""),
    ...nameWords.map((word) => word.replace(/er$/, "")),
    ...command.tags
  ];

  if (nameWords.includes("onehot") || nameWords.includes("onehotencoder")) {
    aliases.push("one hot encode", "one hot encoder", "onehotencode", "dummy encode");
  }
  if (nameWords.includes("train") && nameWords.includes("test")) {
    aliases.push("train test split", "holdout split");
  }
  if (nameWords.includes("groupby")) {
    aliases.push("group by", "grouping");
  }
  if (nameWords.includes("pivot")) {
    aliases.push("pivot", "cross tab");
  }
  if (nameWords.includes("fillna") || nameWords.includes("isna") || nameWords.includes("dropna")) {
    aliases.push("missing values", "null handling", "na handling");
  }
  if (nameWords.includes("linearregression")) {
    aliases.push("ols", "continuous prediction", "regression model");
  }

  aliases.push(...syntaxWords);
  return unique(aliases.map(normalizeSearchText));
}

export function buildSearchDocument(command: CommandEntry): SearchDocument {
  const parameterNames = command.parameters.map((parameter) => parameter.name);
  const aliases = createSearchAliases(command);
  const keywords = unique(
    [
      command.name,
      command.id,
      command.slug,
      command.library,
      command.subtopic,
      ...command.tags,
      ...parameterNames,
      command.syntax,
      command.summary,
      command.description,
      command.overview,
      ...command.applications,
      ...aliases
    ].map(normalizeSearchText)
  ).join(" ");

  return {
    id: command.id,
    slug: command.slug,
    name: command.name,
    library: command.library,
    subtopic: command.subtopic,
    tags: command.tags,
    summary: command.summary,
    syntax: command.syntax,
    description: command.description,
    overview: command.overview,
    applications: command.applications,
    parameters: parameterNames,
    aliases,
    keywords
  };
}
