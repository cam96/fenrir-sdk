#Requires -Version 5.1
<#
.SYNOPSIS
    Syncs Copilot assets from fenrir-sdk into the current project's .github folder.

.DESCRIPTION
    Clones (or updates) the fenrir-sdk repository and copies the common assets
    plus any project-type-specific assets into the consuming project's .github folder.

.PARAMETER ProjectTypes
    One or more project types to pull assets for.
    Valid values: blazor, web-api, function-app, tsql, csharp

.PARAMETER SdkRepoUrl
    URL of the fenrir-sdk repository.

.PARAMETER SdkBranch
    Branch to pull from. Defaults to 'main'.

.EXAMPLE
    .\sync-copilot.ps1 -ProjectTypes blazor, csharp

.EXAMPLE
    .\sync-copilot.ps1 -ProjectTypes web-api, csharp, tsql
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateSet("blazor", "web-api", "function-app", "tsql", "csharp")]
    [string[]]$ProjectTypes,

    [string]$SdkRepoUrl = "https://github.com/your-org/fenrir-sdk",

    [string]$SdkBranch = "main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$sdkCachePath = Join-Path $env:TEMP "fenrir-sdk"
$projectRoot  = Resolve-Path (Join-Path $PSScriptRoot "..")
$targetBase   = Join-Path $projectRoot ".github"

# ---------------------------------------------------------------------------
# 1. Clone or update the SDK repo
# ---------------------------------------------------------------------------
if (Test-Path (Join-Path $sdkCachePath ".git")) {
    Write-Host "Updating fenrir-sdk cache..." -ForegroundColor Cyan
    git -C $sdkCachePath fetch --quiet origin $SdkBranch
    git -C $sdkCachePath checkout --quiet $SdkBranch
    git -C $sdkCachePath reset --quiet --hard "origin/$SdkBranch"
} else {
    Write-Host "Cloning fenrir-sdk..." -ForegroundColor Cyan
    git clone --quiet --depth 1 --branch $SdkBranch $SdkRepoUrl $sdkCachePath
}

# ---------------------------------------------------------------------------
# 2. Copy common + requested project-type folders
# ---------------------------------------------------------------------------
$sources = @("common") + $ProjectTypes

foreach ($source in $sources) {
    $sourceDir = Join-Path $sdkCachePath ".github" $source

    if (-not (Test-Path $sourceDir)) {
        Write-Warning "Source folder not found, skipping: $source"
        continue
    }

    foreach ($subDir in Get-ChildItem -Path $sourceDir -Directory) {
        if ($subDir.Name -eq "skills") { continue }  # handled separately below

        $dest = Join-Path $targetBase $subDir.Name
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Copy-Item -Path (Join-Path $subDir.FullName "*") -Destination $dest -Recurse -Force
        Write-Host "  Synced [$source/$($subDir.Name)] -> [.github/$($subDir.Name)]" -ForegroundColor Green
    }
}

# ---------------------------------------------------------------------------
# 3. Install skills to the user-level agents directory
# ---------------------------------------------------------------------------
$userSkillsBase = Join-Path $env:USERPROFILE ".agents" "skills"

foreach ($source in $sources) {
    $skillsDir = Join-Path $sdkCachePath ".github" $source "skills"

    if (-not (Test-Path $skillsDir)) { continue }

    foreach ($skillDir in Get-ChildItem -Path $skillsDir -Directory) {
        $dest = Join-Path $userSkillsBase $skillDir.Name
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Copy-Item -Path (Join-Path $skillDir.FullName "*") -Destination $dest -Recurse -Force
        Write-Host "  Installed skill [$($skillDir.Name)] -> [~/.agents/skills/$($skillDir.Name)]" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Sync complete." -ForegroundColor Cyan
