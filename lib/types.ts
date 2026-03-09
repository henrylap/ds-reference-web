export type LibraryId =
  | "python"
  | "numpy"
  | "pandas"
  | "sklearn"
  | "matplotlib"
  | "seaborn"
  | "sql"
  | "rstudio";

export interface DocsReference {
  label: string;
  url: string;
}

export interface ParameterSpec {
  name: string;
  type: string;
  default?: string;
  description: string;
  values: string[];
  pitfalls: string[];
}

export interface ReturnSpec {
  type: string;
  shape?: string;
  description: string;
}

export interface ExampleSpec {
  title: string;
  scenario: string;
  code: string;
  expectedOutput: string;
  walkthrough: string[];
}

export interface CommandEntry {
  id: string;
  slug: string;
  name: string;
  library: LibraryId;
  subtopic: string;
  tags: string[];
  level: "core" | "extended";
  summary: string;
  syntax: string;
  description: string;
  overview: string;
  applications: string[];
  docs: DocsReference[];
  parameters: ParameterSpec[];
  returns: ReturnSpec;
  examples: ExampleSpec[];
  notes: string[];
  related: string[];
}

export interface CoverageTopic {
  topic: string;
  docUrl: string;
  status: "seeded" | "planned";
  highUsageApis: string[];
}

export interface LibraryContent {
  library: LibraryId;
  title: string;
  officialDocs: string;
  overview: string;
  applications: string[];
  subtopics: string[];
  commandGroups: {
    name: string;
    docs: DocsReference[];
    commandIds: string[];
  }[];
  cheatSheet: string[];
  coverageOutline: CoverageTopic[];
  commands: CommandEntry[];
}

export interface Recipe {
  id: string;
  title: string;
  libraries: LibraryId[];
  tags: string[];
  goal: string;
  steps: string[];
  code: string;
  outputHint: string;
}

export interface SearchDocument {
  id: string;
  slug: string;
  name: string;
  library: LibraryId;
  subtopic: string;
  tags: string[];
  summary: string;
  syntax: string;
  description: string;
  overview: string;
  applications: string[];
  parameters: string[];
  aliases: string[];
  keywords: string;
}
