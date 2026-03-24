---
description: Update an existing GitHub Copilot type folder under .github/ by discovering and downloading any new relevant instructions, prompts, agents, and skills from the awesome-copilot and skills.sh registries.
tools:
  - search/changes
  - search/codebase
  - edit/editFiles
  - web/fetch
  - read/problems
  - search
  - search/usages
---

You are updating an existing GitHub Copilot type named **`${typeName}`**.

## Step 1 — Check whether the type exists

Inspect the `.github/` folder in the current workspace.

- If a folder named `${typeName}` does **not** exist under `.github/`, **stop here** and report that the type does not exist. Use the `new-type` prompt instead to create it.
- If the folder **does** exist, inventory its current contents — list every file present across all subfolders (`instructions/`, `prompts/`, `agents/`, `skills/`) — then continue to Step 2.

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

## Step 3 — Identify new assets

Compare the full set of discovered assets against the inventory taken in Step 1.

- An asset is **new** if no file with a matching name or equivalent content already exists in the corresponding subfolder under `.github/${typeName}/`.
- An asset is **already present** if a file covering the same topic or originating from the same source URL already exists — do not overwrite it.
- An asset is a **duplicate** if an equivalent already exists under `.github/common/` — skip it and note it in the report.

Only proceed with writing files that are confirmed new.

---

## Step 4 — Write new asset files

For each new asset identified in Step 3, write it into the appropriate subfolder under `.github/${typeName}/`.

Rules for all files:
- Use the **exact content** fetched from the registry. Do not paraphrase or summarise.
- Preserve all frontmatter (`---` blocks) as-is.
- Use the original filename from the registry where available; otherwise derive a descriptive kebab-case filename.
- For skills, create a subfolder named after the skill and place `SKILL.md` (and any supporting reference files) inside it.
- Create a subfolder only if it does not already exist.

---

## Step 5 — Report

Summarise everything that was done:

1. **Registry results** — list every entry found in awesome-copilot and skills.sh, with its source URL and which subfolder it was placed in.
2. **Files added** — list every new file written under `.github/${typeName}/`, with a one-line description of its purpose.
3. **Files skipped (already present)** — assets that were not written because an equivalent file already existed in the type folder.
4. **Skipped duplicates** — any assets that were skipped because an equivalent already exists in `.github/common/`.
5. **Next steps** — anything the developer should do after running this prompt (e.g., review newly added instructions for accuracy, update `applyTo` glob patterns, wire new agents into `.vscode/settings.json`).
