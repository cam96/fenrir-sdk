#!/usr/bin/env node

const fs   = require("fs");
const path = require("path");

const VALID_TYPES = ["blazor", "web-api", "function-app", "tsql", "csharp"];

// ---------------------------------------------------------------------------
// Parse arguments
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

const typesIndex = args.findIndex(a => a === "--types" || a === "-t");
if (typesIndex === -1 || !args[typesIndex + 1]) {
  console.error("Error: --types <list> is required.\n");
  printHelp();
  process.exit(1);
}

const requestedTypes = args[typesIndex + 1]
  .split(",")
  .map(t => t.trim().toLowerCase())
  .filter(Boolean);

const invalidTypes = requestedTypes.filter(t => !VALID_TYPES.includes(t));
if (invalidTypes.length > 0) {
  console.error(`Error: Unknown project type(s): ${invalidTypes.join(", ")}`);
  console.error(`Valid types: ${VALID_TYPES.join(", ")}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const sdkGithubDir  = path.resolve(__dirname, "..", ".github");
const targetGithubDir = path.join(process.cwd(), ".github");

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------
const sources = ["common", ...requestedTypes];

for (const source of sources) {
  const sourceDir = path.join(sdkGithubDir, source);

  if (!fs.existsSync(sourceDir)) {
    console.warn(`Warning: source folder not found, skipping: ${source}`);
    continue;
  }

  for (const subDir of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!subDir.isDirectory()) continue;

    const srcPath  = path.join(sourceDir, subDir.name);
    const destPath = path.join(targetGithubDir, subDir.name);

    // Skills: merge each skill folder into .github/skills/{skillname}/
    if (subDir.name === "skills") {
      for (const skill of fs.readdirSync(srcPath, { withFileTypes: true })) {
        if (!skill.isDirectory()) continue;
        const skillDest = path.join(destPath, skill.name);
        copyDirRecursive(path.join(srcPath, skill.name), skillDest);
        console.log(`  Synced [${source}/skills/${skill.name}] -> [.github/skills/${skill.name}]`);
      }
      continue;
    }

    copyDirRecursive(srcPath, destPath);
    console.log(`  Synced [${source}/${subDir.name}] -> [.github/${subDir.name}]`);
  }
}

console.log("\nSync complete.");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcEntry  = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcEntry, destEntry);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  }
}

function printHelp() {
  console.log(`
Usage: npx fenrir-sdk --types <type1,type2,...>

Copies Copilot assets (instructions, prompts, agents) from fenrir-sdk
into the current project's .github/ folder, and installs skills
into ~/.agents/skills/ for VS Code Copilot to pick up.

Options:
  --types, -t   Comma-separated list of project types (required)
  --help,  -h   Show this help message

Valid types:
  blazor          Blazor Server / WebAssembly components
  csharp          General C# / .NET coding standards
  web-api         ASP.NET Core minimal APIs and REST endpoints
  function-app    Azure Functions (isolated worker model)
  tsql            T-SQL stored procedures and queries

Examples:
  npx fenrir-sdk --types blazor,csharp
  npx fenrir-sdk --types web-api,csharp,tsql
  npx fenrir-sdk --types function-app,csharp
`);
}
