---
name: appinsights-instrumentation
description: 'Instrument an ASP.NET Core or Azure Functions app to send telemetry data to Azure Application Insights'
---

# Application Insights Instrumentation

This skill enables sending telemetry data from ASP.NET Core and Azure Functions apps to Azure Application Insights for observability.

## When to use this skill

Use this skill when adding Application Insights telemetry to:
- An ASP.NET Core Web API hosted in Azure
- An Azure Functions app (isolated worker model)

## Prerequisites

- An Azure subscription
- The application must be hosted in Azure (App Service, Container Apps, or Azure Functions)

## ASP.NET Core Setup

### 1. Install the NuGet package

```
dotnet add package Microsoft.ApplicationInsights.AspNetCore
```

### 2. Register in Program.cs

```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

### 3. Configure the connection string

In `appsettings.json`:
```json
{
  "ApplicationInsights": {
    "ConnectionString": "<Your Connection String>"
  }
}
```

Or via environment variable: `APPLICATIONINSIGHTS_CONNECTION_STRING`

**Never hardcode the connection string** — use Key Vault or app settings.

## Azure Functions Setup

### 1. Enable in host.json

```json
{
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  }
}
```

### 2. Set the connection string

In `local.settings.json` (local only):
```json
{
  "Values": {
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "<Your Connection String>"
  }
}
```

In Azure: set the `APPLICATIONINSIGHTS_CONNECTION_STRING` application setting.

## Custom Telemetry

```csharp
public class MyService(TelemetryClient telemetry)
{
    public async Task ProcessAsync(string item)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            // ... work ...
            telemetry.TrackEvent("ItemProcessed", new Dictionary<string, string>
            {
                ["item"] = item
            });
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            throw;
        }
        finally
        {
            telemetry.TrackMetric("ProcessingTime", sw.ElapsedMilliseconds);
        }
    }
}
```

## Best Practices

- Use structured logging via `ILogger<T>` — it flows to Application Insights automatically
- Set sampling rates to control costs on high-volume apps
- Use `TelemetryClient` for custom events, metrics, and dependency tracking
- Create a Bicep or ARM resource for the Application Insights instance rather than creating it manually
- Prefer workspace-based Application Insights (linked to a Log Analytics workspace)
