---
name: az-cost-optimize
description: 'Analyze Azure resources used in the app (IaC files and/or resources in a target rg) and optimize costs - creating GitHub issues for identified optimizations.'
---

# Azure Cost Optimize

This workflow analyzes Infrastructure-as-Code (IaC) files and Azure resources to generate cost optimization recommendations. It creates individual GitHub issues for each optimization opportunity plus one EPIC issue to coordinate implementation, enabling efficient tracking and execution of cost savings initiatives.

## Prerequisites

- Azure MCP server configured and authenticated
- GitHub MCP server configured and authenticated
- Target GitHub repository identified
- Azure resources deployed (IaC files optional but helpful)
- Prefer Azure MCP tools (`azmcp-*`) over direct Azure CLI when available

## Workflow Steps

### Step 1: Get Azure Best Practices

**Action**: Retrieve cost optimization best practices before analysis
**Tools**: Azure MCP best practices tool
**Process**:
1. **Load Best Practices**:
   - Execute `azmcp-bestpractices-get` to get some of the latest Azure optimization guidelines. This may not cover all scenarios but provides a foundation.
   - Use these practices to inform subsequent analysis and recommendations as much as possible
   - Reference best practices in optimization recommendations, either from the MCP tool output or general Azure documentation

### Step 2: Discover Azure Infrastructure

**Action**: Dynamically discover and analyze Azure resources and configurations
**Tools**: Azure MCP tools + Azure CLI fallback + Local file system access
**Process**:
1. **Resource Discovery**:
   - Execute `azmcp-subscription-list` to find available subscriptions
   - Execute `azmcp-group-list --subscription <subscription-id>` to find resource groups
   - Get a list of all resources in the relevant group(s):
     - Use `az resource list --subscription <id> --resource-group <name>`
   - For each resource type, use MCP tools first if possible, then CLI fallback:
     - `azmcp-cosmos-account-list --subscription <id>` - Cosmos DB accounts
     - `azmcp-storage-account-list --subscription <id>` - Storage accounts
     - `azmcp-monitor-workspace-list --subscription <id>` - Log Analytics workspaces
     - `azmcp-keyvault-key-list` - Key Vaults
     - `az webapp list` - Web Apps (fallback - no MCP tool available)
     - `az appservice plan list` - App Service Plans (fallback)
     - `az functionapp list` - Function Apps (fallback)
     - `az sql server list` - SQL Servers (fallback)
     - `az redis list` - Redis Cache (fallback)

2. **IaC Detection**:
   - Use `file_search` to scan for IaC files: `**/*.bicep`, `**/*.tf`, `**/main.json`, `**/*template*.json`
   - Parse resource definitions to understand intended configurations
   - Compare against discovered resources to identify discrepancies
   - Note presence of IaC files for implementation recommendations later on
   - Do NOT use any other file from the repository, only IaC files. Using other files is NOT allowed as it is not a source of truth.
   - If you do not find IaC files, then STOP and report no IaC files found to the user.

3. **Configuration Analysis**:
   - Extract current SKUs, tiers, and settings for each resource
   - Identify resource relationships and dependencies
   - Map resource utilization patterns where available

### Step 3: Collect Usage Metrics & Validate Current Costs

**Action**: Gather utilization data AND verify actual resource costs
**Tools**: Azure MCP monitoring tools + Azure CLI
**Process**:
1. **Find Monitoring Sources**:
   - Use `azmcp-monitor-workspace-list --subscription <id>` to find Log Analytics workspaces
   - Use `azmcp-monitor-table-list --subscription <id> --workspace <name> --table-type "CustomLog"` to discover available data

2. **Execute Usage Queries**:
   - Use `azmcp-monitor-log-query` with predefined queries:
     - Query: `recent` for recent activity patterns
     - Query: `errors` for error-level logs indicating issues
   - For custom analysis, use KQL queries:
   ```kql
   // CPU utilization for App Services
   AppServiceAppLogs
   | where TimeGenerated > ago(7d)
   | summarize avg(CpuTime) by Resource, bin(TimeGenerated, 1h)

   // Cosmos DB RU consumption
   AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.DOCUMENTDB"
   | where TimeGenerated > ago(7d)
   | summarize avg(RequestCharge) by Resource

   // Storage account access patterns
   StorageBlobLogs
   | where TimeGenerated > ago(7d)
   | summarize RequestCount=count() by AccountName, bin(TimeGenerated, 1d)
   ```

3. **Calculate Baseline Metrics**:
   - CPU/Memory utilization averages
   - Database throughput patterns
   - Storage access frequency
   - Function execution rates

4. **VALIDATE CURRENT COSTS**:
   - Using the SKU/tier configurations discovered in Step 2
   - Look up current Azure pricing at https://azure.microsoft.com/pricing/ or use `az billing` commands
   - Document: Resource → Current SKU → Estimated monthly cost
   - Calculate realistic current monthly total before proceeding to recommendations

### Step 4: Generate Cost Optimization Recommendations

**Action**: Analyze resources to identify optimization opportunities
**Tools**: Local analysis using collected data
**Process**:
1. **Apply Optimization Patterns** based on resource types found:

   **Compute Optimizations**:
   - App Service Plans: Right-size based on CPU/memory usage
   - Function Apps: Premium → Consumption plan for low usage
   - Virtual Machines: Scale down oversized instances

   **Database Optimizations**:
   - Cosmos DB:
     - Provisioned → Serverless for variable workloads
     - Right-size RU/s based on actual usage
   - SQL Database: Right-size service tiers based on DTU usage

   **Storage Optimizations**:
   - Implement lifecycle policies (Hot → Cool → Archive)
   - Consolidate redundant storage accounts
   - Right-size storage tiers based on access patterns

   **Infrastructure Optimizations**:
   - Remove unused/redundant resources
   - Implement auto-scaling where beneficial
   - Schedule non-production environments

2. **Calculate Evidence-Based Savings**:
   - Current validated cost → Target cost = Savings
   - Document pricing source for both current and target configurations

3. **Calculate Priority Score** for each recommendation:
   ```
   Priority Score = (Value Score × Monthly Savings) / (Risk Score × Implementation Days)

   High Priority: Score > 20
   Medium Priority: Score 5-20
   Low Priority: Score < 5
   ```

4. **Validate Recommendations**:
   - Ensure Azure CLI commands are accurate
   - Verify estimated savings calculations
   - Assess implementation risks and prerequisites
   - Ensure all savings calculations have supporting evidence

### Step 5: User Confirmation

**Action**: Present summary and get approval before creating GitHub issues
**Process**:
1. **Display Optimization Summary** with resources analyzed, current monthly cost, potential savings, and list of recommendations.
2. **Wait for User Confirmation**: Only proceed if user confirms.

### Step 6: Create Individual Optimization Issues

**Action**: Create separate GitHub issues for each optimization opportunity. Label them with `cost-optimization` (green color), `azure` (blue color).
**MCP Tools Required**: `create_issue` for each recommendation
**Issue title format**: `[COST-OPT] [Resource Type] - [Brief Description] - $X/month savings`

Each issue body should include:
- Description of the optimization
- Implementation steps (IaC file changes if available, otherwise CLI commands)
- Evidence (current config, usage patterns, cost impact)
- Validation steps
- Risks and considerations
- Priority score

### Step 7: Create EPIC Coordinating Issue

**Action**: Create master issue to track all optimization work. Label it with `cost-optimization` (green), `azure` (blue), and `epic` (purple).
**MCP Tools Required**: `create_issue` for EPIC

The EPIC issue should include:
- Executive summary (resources analyzed, total savings potential)
- Current architecture overview (Mermaid diagram)
- Implementation tracking (issues grouped by priority)
- Progress tracking
- Success criteria

## Error Handling

- **Cost Validation**: If savings estimates lack supporting evidence or seem inconsistent with Azure pricing, re-verify configurations and pricing sources before proceeding
- **Azure Authentication Failure**: Provide manual Azure CLI setup steps
- **No Resources Found**: Create informational issue about Azure resource deployment
- **GitHub Creation Failure**: Output formatted recommendations to console
- **Insufficient Usage Data**: Note limitations and provide configuration-based recommendations only

## Success Criteria

- ✅ All cost estimates verified against actual resource configurations and Azure pricing
- ✅ Individual issues created for each optimization (trackable and assignable)
- ✅ EPIC issue provides comprehensive coordination and tracking
- ✅ All recommendations include specific, executable Azure CLI commands
- ✅ Priority scoring enables ROI-focused implementation
- ✅ Architecture diagram accurately represents current state
- ✅ User confirmation prevents unwanted issue creation
