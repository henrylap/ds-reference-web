import { z } from "zod";

export const libraryIdSchema = z.enum([
  "python",
  "numpy",
  "pandas",
  "sklearn",
  "matplotlib",
  "seaborn",
  "sql",
  "rstudio"
]);

export const docsReferenceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const parameterSpecSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  default: z.string().optional(),
  description: z.string().min(1),
  values: z.array(z.string()).min(1),
  pitfalls: z.array(z.string())
});

export const returnSpecSchema = z.object({
  type: z.string().min(1),
  shape: z.string().optional(),
  description: z.string().min(1)
});

export const exampleSpecSchema = z.object({
  title: z.string().min(1),
  scenario: z.string().min(1),
  code: z.string().min(1),
  expectedOutput: z.string().min(1),
  walkthrough: z.array(z.string().min(1)).min(2)
});

export const commandEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  library: libraryIdSchema,
  subtopic: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  level: z.enum(["core", "extended"]),
  summary: z.string().min(1),
  syntax: z.string().min(1),
  description: z.string().min(1),
  overview: z.string().min(1),
  applications: z.array(z.string().min(1)).min(2),
  docs: z.array(docsReferenceSchema).min(1),
  parameters: z.array(parameterSpecSchema).min(1),
  returns: returnSpecSchema,
  examples: z.array(exampleSpecSchema).min(1).max(3),
  notes: z.array(z.string().min(1)).min(1),
  related: z.array(z.string())
});

export const commandGroupSchema = z.object({
  name: z.string().min(1),
  docs: z.array(docsReferenceSchema).min(1),
  commandIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1)
});

export const coverageTopicSchema = z.object({
  topic: z.string().min(1),
  docUrl: z.string().url(),
  status: z.enum(["seeded", "planned"]),
  highUsageApis: z.array(z.string().min(1)).min(1)
});

export const libraryContentSchema = z.object({
  library: libraryIdSchema,
  title: z.string().min(1),
  officialDocs: z.string().url(),
  overview: z.string().min(1),
  applications: z.array(z.string().min(1)).min(3),
  subtopics: z.array(z.string().min(1)).min(1),
  commandGroups: z.array(commandGroupSchema).min(1),
  cheatSheet: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  coverageOutline: z.array(coverageTopicSchema).min(1),
  commands: z.array(commandEntrySchema).min(25)
});

export const recipeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  libraries: z.array(libraryIdSchema).min(1),
  tags: z.array(z.string().min(1)).min(1),
  goal: z.string().min(1),
  steps: z.array(z.string().min(1)).min(2),
  code: z.string().min(1),
  outputHint: z.string().min(1)
});

export const searchDocumentSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  library: libraryIdSchema,
  subtopic: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  syntax: z.string().min(1),
  description: z.string().min(1),
  overview: z.string().min(1),
  applications: z.array(z.string().min(1)).min(1),
  parameters: z.array(z.string().min(1)).min(1),
  aliases: z.array(z.string().min(1)).min(1),
  keywords: z.string().min(1)
});
