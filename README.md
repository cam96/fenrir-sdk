<div align="center">

⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛                               
⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛                               
⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬛⬛⬛⬛⬛                               
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛                               
⬛⬛⬛🟨🟨🟨⬛⬛⬛⬛🟨🟨🟨⬛⬛                               
⬛⬛⬛🟨🟨🟨⬛⬛⬛⬛🟨🟨🟨⬛⬛                               
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛                               
⬛⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛                               
⬛⬛⬛⬜⬜⬜⬜⬛⬛⬜⬜⬜⬜⬛⬛                               
⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛                               
⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛                               
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛                               
⬜⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜                                                                

# fenrir-sdk

</div>

A central repository of GitHub Copilot customization assets — instructions, prompts, and custom agents — organized by project type. Consuming projects run a sync script to pull in only the assets relevant to their stack.

## Repository Structure

```
.github/
├── common/              # Pulled into every project
│   ├── instructions/
│   └── prompts/
├── blazor/              # Blazor Server / WebAssembly
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
│       └── fluentui-blazor/
├── csharp/              # General C# / .NET
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
│       ├── csharp-async/
│       ├── csharp-xunit/
│       ├── dotnet-best-practices/
│       └── ef-core/
├── web-api/             # ASP.NET Core Web API / Minimal API
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
│       └── aspnet-minimal-api-openapi/
├── function-app/        # Azure Functions (isolated worker model)
│   ├── instructions/
│   ├── prompts/
│   ├── agents/
│   └── skills/
│       └── appinsights-instrumentation/
└── tsql/                # T-SQL / SQL Server
    ├── instructions/
    ├── prompts/
    ├── agents/
    └── skills/
        ├── sql-code-review/
        └── sql-optimization/

scripts/
└── sync-copilot.ps1     # Sync script for consuming projects
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

## Skills Index

Skills are invokable by name in GitHub Copilot Chat (Agent mode). After syncing, trigger them by describing the task:

| Skill | Project type | Trigger phrases |
|---|---|---|
| `csharp-async` | csharp | *"review my async code"*, *"best practices for async"* |
| `csharp-xunit` | csharp | *"write unit tests"*, *"xunit best practices"* |
| `dotnet-best-practices` | csharp | *"review this C# code"*, *".NET best practices"* |
| `ef-core` | csharp | *"EF Core best practices"*, *"review my DbContext"* |
| `fluentui-blazor` | blazor | *"FluentUI component"*, *"Fluent dialog"*, *"FluentSelect"* |
| `aspnet-minimal-api-openapi` | web-api | *"create a minimal API endpoint"*, *"add OpenAPI docs"* |
| `appinsights-instrumentation` | function-app | *"add Application Insights"*, *"instrument my app"* |
| `sql-code-review` | tsql | *"review this SQL"*, *"SQL code review"* |
| `sql-optimization` | tsql | *"optimize this query"*, *"SQL performance"* |

## Adding a New Project Type

1. Create a folder under `.github/<type>/`
2. Add `instructions/`, `prompts/`, `agents/`, and/or `skills/` subfolders with the relevant files
3. Add the new type to the `ValidateSet` in [scripts/sync-copilot.ps1](scripts/sync-copilot.ps1) and to the `VALID_TYPES` array in [bin/sync.js](bin/sync.js)
