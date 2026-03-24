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

## Repository Structure

```
.github/
├── common/              # Pulled into every project
│   ├── instructions/
│   └── prompts/
├── project-type/              
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
```

## Asset Types

| File type | Extension | Destination | Purpose |
|---|---|---|---|
| Instructions | `.instructions.md` | `.github/instructions/` | Rules automatically applied by Copilot based on `applyTo` glob |
| Prompts | `.prompt.md` | `.github/prompts/` | Reusable prompt templates invokable from Copilot Chat |
| Agents | `.agent.md` | `.github/agents/` | Custom agent modes with specific tool sets and personas |
| Skills | `SKILL.md` | `.github/skills/{name}/` | Domain-specific knowledge invokable by name in Copilot Chat |

## Using in a Consuming Project

Both scenarios use `npx` to run the sync directly from this GitHub repository — no local clone or script copy needed. The `common/` assets are always included automatically alongside the types you specify.

The sync copies two things:

All assets — instructions, prompts, agents, and skills — are merged into your project's `.github/` folder.

```
.github/
├── instructions/    ← merged from common + selected types
├── prompts/         ← merged from common + selected types
├── agents/          ← merged from selected types
└── skills/          ← merged from selected types
    ├── csharp-async/
    ├── csharp-xunit/
    ├── dotnet-best-practices/
    ├── ef-core/
    ├── fluentui-blazor/
    └── ...
```

---

### Fresh install into a project

Run this from the **root of your project**. Replace `cam96` with the GitHub user or organization that owns this repository. Specify one or more project types with `--types`.

```powershell
# Blazor project
npx github:cam96/fenrir-sdk --types blazor

# Blazor project with C# standards (recommended — Blazor uses C#)
npx github:cam96/fenrir-sdk --types blazor,csharp

# Web API project with C# and T-SQL
npx github:cam96/fenrir-sdk --types web-api,csharp,tsql

# Azure Functions project
npx github:cam96/fenrir-sdk --types function-app,csharp
```

---

### Update an already-installed project to the latest assets

`npx` caches packages locally. To force it to fetch the latest version from GitHub and overwrite existing files, add the `--yes` flag:

```powershell
# Update a Blazor + C# project (additive — keeps any locally added files)
npx --yes github:cam96/fenrir-sdk --types blazor,csharp

# Update a Web API project
npx --yes github:cam96/fenrir-sdk --types web-api,csharp,tsql
```

#### Updating with a clean sync (`--clean`)

Add `--clean` when you want your local state to exactly mirror the SDK — for example, after a skill has been removed from the SDK and you want it deleted locally too.

> **Warning:** `--clean` permanently deletes everything inside `.github/instructions/`, `.github/prompts/`, `.github/agents/`, and `.github/skills/` before repopulating from the SDK. Any files you added to those folders manually will be lost. Only use this flag if you intentionally want a full reset.

```powershell
# Full clean sync — local state will exactly match the SDK
npx --yes github:cam96/fenrir-sdk --types blazor,csharp --clean
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


## Adding a New Project Type

1. Create a folder under `.github/<type>/`
2. Add `instructions/`, `prompts/`, `agents/`, and/or `skills/` subfolders with the relevant files
3. Add the new type to the `VALID_TYPES` array in [bin/sync.js](bin/sync.js)

---

## Prompts

These prompts are available in Copilot Chat to help maintain the SDK itself.

### `new-type`

Bootstraps a new project type by discovering and downloading relevant assets from the [awesome-copilot](https://awesome-copilot.github.com/) and [skills.sh](https://skills.sh/) registries.

Use this when adding a brand-new type that doesn't yet exist under `.github/`.

```
/new-type typeName=blazor
```

The prompt will:
1. Verify the type folder does not already exist
2. Search both registries for instructions, prompts, agents, and skills relevant to the type
3. Download and place each asset into the correct subfolder
4. Summarize what was added

---

### `update-type`

Updates an existing project type by discovering new assets from the registries that aren't already present locally.

Use this when a type already exists and you want to pull in anything new from the registries.

```
/update-type typeName=blazor
```

The prompt will:
1. Verify the type folder exists (suggests `new-type` if it doesn't)
2. Inventory the current contents
3. Search both registries for assets not yet present
4. Download and add any new assets, leaving existing files untouched
5. Summarize what was added
