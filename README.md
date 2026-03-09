# DS Reference

DS Reference is a local, searchable coding companion for data science workflows.

## What is now included

- Next.js App Router + TypeScript + Tailwind app
- Global fuzzy search (library + tag filters)
- Left navigation tree (`library -> subtopic -> command`)
- Command detail tabs: `Overview | Parameters | Examples | Notes`
- Color-coded code blocks (editor-style syntax highlighting + line numbers)
- Bookmark + recently viewed (localStorage)
- Recipes, cheat sheets, and compare view
- Expanded command coverage:
  - Python fundamentals: 35
  - NumPy: 32
  - Pandas: 32
  - scikit-learn: 30
  - Matplotlib: 30
  - Seaborn: 30

Each command includes:
- Syntax
- Detailed overview
- Applications (business use-cases)
- Parameter index (types/defaults/values/pitfalls)
- Return spec
- Step-by-step walkthrough examples
- Official docs link

Examples are now revised to be business-oriented, with active command lines (not commented placeholders). Key scikit-learn commands include end-to-end flows (import, X/y setup, fit, predict, and deployment-style save/load patterns).

## Information Architecture

1. Home (`/`)
2. Library pages (`/library/[libraryId]`)
3. Command detail pages (`/command/[slug]`)
4. Recipes (`/recipes`)
5. Cheat sheets (`/cheatsheets`)
6. Compare (`/compare`)

## Content Schema

Primary sources:
- `content/commands/*.json`
- `content/recipes/workflows.json`

Types:
- `lib/types.ts`

Validation:
- `lib/schema.ts`
- `scripts/validate-content.ts`

### CommandEntry fields

```ts
interface CommandEntry {
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
  docs: { label: string; url: string }[];
  parameters: {
    name: string;
    type: string;
    default?: string;
    description: string;
    values: string[];
    pitfalls: string[];
  }[];
  returns: {
    type: string;
    shape?: string;
    description: string;
  };
  examples: {
    title: string;
    scenario: string;
    code: string;
    expectedOutput: string;
    walkthrough: string[];
  }[];
  notes: string[];
  related: string[];
}
```

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run content:validate` - validate all content against schema
- `npm run content:index` - rebuild `public/search-index.json`
- `npm run content:expand` - add extended command packs + metadata
- `npm run content:revise-examples` - rewrite examples into business workflows
- `npm run content:prepare` - run validation + index build
- `npm run build` - production build (includes content prep)

## How to add more commands

1. Edit the target file in `content/commands/`.
2. Add a command object to `commands` with all required fields.
3. Include official docs URL in `docs`.
4. Add command ID to a `commandGroups[].commandIds` list.
5. Optionally add to `cheatSheet`.
6. Run:

```bash
npm run content:validate
npm run content:index
```

## Keeping parity with official docs

For each library/topic:

1. Start from official reference index page.
2. Ensure high-usage APIs are covered first.
3. Track missing APIs in `coverageOutline`.
4. Keep examples practical and reproducible.
5. Re-validate content before shipping updates.

## Project Structure

```text
app/
components/
content/
lib/
public/
scripts/
```
