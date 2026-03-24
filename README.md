<div align="center">

<img src="logo.png" alt="Fenrir SDK" width="160"/>

# fenrir-sdk

**One source of truth for GitHub Copilot customizations across every project.**

</div>

Most teams copy-paste Copilot instructions between repos, let them drift out of sync, and end up with inconsistent AI behaviour across projects. **fenrir-sdk** solves that.

It is a centralized, versioned library of GitHub Copilot assets — coding instructions, reusable prompts, custom agents, and skill definitions — organized by project type. Any project can pull in exactly the assets it needs with a single `npx` command, and stay up to date as the SDK evolves.

**Why this matters:**
- **Consistency** — every project that uses the same type gets the same Copilot behaviour, enforced automatically
- **Zero maintenance overhead** — update the SDK once, propagate to all consuming projects on next sync
- **Composable** — mix and match types (`blazor,csharp,tsql`) to assemble the right context for any stack
- **No lock-in** — assets land in your `.github/` folder as plain files; you own them

---

## Getting Started

### Step 1 — Run the sync from your project root

No installation required. Run this command from the **root of your project**, replacing `cam96` with the GitHub user or org that owns this repository. Specify one or more [project types](#available-project-types) with `--types`.

```powershell
npx github:cam96/fenrir-sdk --types blazor,csharp
```

That's it. The sync pulls assets directly from GitHub and writes them into your project's `.github/` folder.

```
.github/
├── instructions/    ← merged from common + selected types
├── prompts/         ← merged from common + selected types
├── agents/          ← merged from selected types
└── skills/          ← merged from selected types
```

The `common/` assets are always included automatically — you only need to specify the types relevant to your stack.

---

### Step 2 — Commit the `.github/` folder

The synced files are plain text. Commit them like any other source file so your team gets consistent Copilot behaviour immediately.

```powershell
git add .github/
git commit -m "chore: sync Copilot assets from fenrir-sdk"
```

---

### Available project types

| Value | Description |
|---|---|
| `blazor` | Blazor Server and WebAssembly components |
| `csharp` | General C# / .NET coding standards |
| `web-api` | ASP.NET Core minimal APIs and REST endpoints |
| `function-app` | Azure Functions isolated worker model |
| `tsql` | T-SQL stored procedures and queries for SQL Server |

Multiple types can be combined in a single run:

```powershell
npx github:cam96/fenrir-sdk --types blazor,csharp,tsql
```

---

## Staying Up to Date

`npx` caches packages locally, so running the same command again won't pull the latest changes. Use `--yes` to force a fresh fetch:

```powershell
npx --yes github:cam96/fenrir-sdk --types blazor,csharp
```

This is **additive** — it overwrites SDK-managed files but leaves any files you added locally untouched.

### Full reset with `--clean`

Add `--clean` when you want your local state to exactly mirror the SDK, including removing assets that have been deleted from the SDK.

> **Warning:** `--clean` permanently deletes everything inside `.github/instructions/`, `.github/prompts/`, `.github/agents/`, and `.github/skills/` before repopulating. Any locally added files in those folders will be lost.

```powershell
npx --yes github:cam96/fenrir-sdk --types blazor,csharp --clean
```

---

## Contributing

### Repository structure

Assets are organised under `.github/` by project type. A `common/` folder holds assets that are pulled into every consuming project regardless of the types they specify.

```
.github/
├── common/              # Included in every sync
│   ├── instructions/
│   └── prompts/
├── <type>/              # One folder per project type
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
```

Each asset type has a defined file extension and destination in consuming projects:

| Asset | Extension | Destination | Purpose |
|---|---|---|---|
| Instructions | `.instructions.md` | `.github/instructions/` | Rules automatically applied by Copilot based on `applyTo` glob |
| Prompts | `.prompt.md` | `.github/prompts/` | Reusable prompt templates invokable from Copilot Chat |
| Agents | `.agent.md` | `.github/agents/` | Custom agent modes with specific tool sets and personas |
| Skills | `SKILL.md` | `.github/skills/{name}/` | Domain-specific knowledge invokable by name in Copilot Chat |

---

### Adding a new project type

The fastest way is to use the `new-type` prompt in Copilot Chat — it will search the [awesome-copilot](https://awesome-copilot.github.com/) and [skills.sh](https://skills.sh/) registries, download relevant assets, and place them in the right folders automatically.

```
/new-type typeName=<your-type>
```

To add a type manually:

1. Create a folder at `.github/<type>/`
2. Add any combination of `instructions/`, `prompts/`, `agents/`, and `skills/` subfolders with the relevant files
3. Register the new type by adding it to the `VALID_TYPES` array in [bin/sync.js](bin/sync.js)

---

### Updating an existing project type

Use the `update-type` prompt to discover and pull in new assets from the registries that aren't already present locally:

```
/update-type typeName=<your-type>
```

To update manually, add or edit files in the relevant `.github/<type>/` subfolders. Existing files in consuming projects will be overwritten on their next sync.

---

### Prompts reference

| Prompt | When to use |
|---|---|
| `/new-type typeName=x` | Bootstrap a brand-new type folder from registry assets |
| `/update-type typeName=x` | Discover and add new registry assets to an existing type |
