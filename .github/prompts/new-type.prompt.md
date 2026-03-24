---
description: Bootstrap a new GitHub Copilot type folder under .github/ by discovering and downloading relevant instructions, prompts, agents, and skills from the awesome-copilot and skills.sh registries.
tools:
  - search/changes
  - search/codebase
  - edit/editFiles
  - web/fetch
  - read/problems
  - search
  - search/usages
---

You are bootstrapping a new GitHub Copilot type named **`${typeName}`**.

## Step 1 — Check whether the type already exists

Inspect the `.github/` folder in the current workspace.

- If a folder named `${typeName}` already exists under `.github/`, **stop here** and report that the type already exists. Do not overwrite or modify any existing files.
- If the folder does **not** exist, continue to Step 2.

---

## Step 2 — Discover relevant assets

Search the following registries for assets that are relevant to `${typeName}` and its domain. Fetch each index first, then follow individual asset links.

### awesome-copilot registry

```
https://awesome-copilot.github.com/
```

Look for entries whose tags, title, or description match:
- The type name itself (e.g., `${typeName}`)
- Related languages, runtimes, or frameworks associated with this type
- Common patterns, concerns, or tools used in this domain (e.g., `testing`, `linting`, `ci`, `deployment`, `security`)

Collect all matching entries. For each, fetch the raw asset URL and load the full content into context.

Identify which asset category each entry belongs to:
- **Instructions** — coding standards, `applyTo` rules, linting rules
- **Prompts** — task-oriented `.prompt.md` files
- **Agents** — `.agent.md` files
- **Skills** — `SKILL.md` files with domain-specific knowledge

### skills.sh registry

```
https://skills.sh/
```

Search for skills that match:
- The type's language, runtime, or platform (e.g., `${typeName}`, a framework it uses, a related cloud service)
- Architectural roles or patterns commonly associated with this type (e.g., `repository`, `service`, `handler`, `pipeline`)

For each matching skill, fetch its `SKILL.md` and any referenced files, then load the content into context.

---

## Step 3 — Create the type folder and subfolders

Create the folder `.github/${typeName}/` and, based on the assets found, create any of the following subfolders that have content:

| Subfolder | Contents |
|---|---|
| `instructions/` | Instruction files (`.instructions.md`) — coding standards, scoped rules |
| `prompts/` | Prompt files (`.prompt.md`) — reusable task prompts |
| `agents/` | Agent files (`.agent.md`) — specialist agent definitions |
| `skills/` | Skill directories — each skill gets its own folder containing `SKILL.md` and any reference files |

Only create subfolders that will contain at least one file. Do not create empty folders.

---

## Step 4 — Write the asset files

For each asset discovered in Step 2, write it into the appropriate subfolder under `.github/${typeName}/`.

Rules for all files:
- Use the **exact content** fetched from the registry. Do not paraphrase or summarise.
- Preserve all frontmatter (`---` blocks) as-is.
- Use the original filename from the registry where available; otherwise derive a descriptive kebab-case filename.
- For skills, create a subfolder named after the skill and place `SKILL.md` (and any supporting reference files) inside it.

If a fetched asset is a generic/common asset that already exists under `.github/common/`, note it in the report but do **not** duplicate it.

---

## Step 5 — Report

Summarise everything that was done:

1. **Registry results** — list every entry found in awesome-copilot and skills.sh, with its source URL and which subfolder it was placed in.
2. **Files created** — list every file written under `.github/${typeName}/`, with a one-line description of its purpose.
3. **Skipped duplicates** — any assets that were skipped because an equivalent already exists in `.github/common/`.
4. **Next steps** — anything the developer should do after running this prompt (e.g., review auto-discovered instructions for accuracy, update `applyTo` glob patterns, wire agents into `.vscode/settings.json`).
