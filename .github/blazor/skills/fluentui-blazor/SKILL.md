---
name: fluentui-blazor
description: >
  Guide for using the Microsoft Fluent UI Blazor component library
  (Microsoft.FluentUI.AspNetCore.Components NuGet package) in Blazor applications.
  Use this when the user is building a Blazor app with Fluent UI components,
  setting up the library, using FluentUI components like FluentButton, FluentDataGrid,
  FluentDialog, FluentToast, FluentNavMenu, FluentTextField, FluentSelect,
  FluentAutocomplete, FluentDesignTheme, or any component prefixed with "Fluent".
  Also use when troubleshooting missing providers, JS interop issues, or theming.
---

# Fluent UI Blazor — Consumer Usage Guide

This skill teaches how to correctly use the **Microsoft.FluentUI.AspNetCore.Components** (version 4) NuGet package in Blazor applications.

## Critical Rules

### 1. No manual `<script>` or `<link>` tags needed

The library auto-loads all CSS and JS via Blazor's static web assets and JS initializers. **Never tell users to add `<script>` or `<link>` tags for the core library.**

### 2. Providers are mandatory for service-based components

These provider components **MUST** be added to the root layout (e.g. `MainLayout.razor`) for their corresponding services to work. Without them, service calls fail silently.

```razor
<FluentToastProvider />
<FluentDialogProvider />
<FluentMessageBarProvider />
<FluentTooltipProvider />
<FluentKeyCodeProvider />
```

### 3. Service registration in Program.cs

```csharp
builder.Services.AddFluentUIComponents();

// Or with configuration:
builder.Services.AddFluentUIComponents(options =>
{
    options.UseTooltipServiceProvider = true;  // default: true
    options.ServiceLifetime = ServiceLifetime.Scoped; // default
});
```

**ServiceLifetime rules:**
- `ServiceLifetime.Scoped` — for Blazor Server / Interactive (default)
- `ServiceLifetime.Singleton` — for Blazor WebAssembly standalone
- `ServiceLifetime.Transient` — **throws `NotSupportedException`**

### 4. Icons require a separate NuGet package

```
dotnet add package Microsoft.FluentUI.AspNetCore.Components.Icons
```

Usage:
```razor
@using Icons = Microsoft.FluentUI.AspNetCore.Components.Icons

<FluentIcon Value="@(Icons.Regular.Size24.Save)" />
<FluentIcon Value="@(Icons.Filled.Size20.Delete)" Color="@Color.Error" />
```

Pattern: `Icons.[Variant].[Size].[Name]`. **Never use string-based icon names.**

### 5. List component binding model

`FluentSelect<TOption>`, `FluentCombobox<TOption>`, `FluentListbox<TOption>`, and `FluentAutocomplete<TOption>` use:

- `Items` — the data source (`IEnumerable<TOption>`)
- `OptionText` — `Func<TOption, string?>` to extract display text
- `OptionValue` — `Func<TOption, string?>` to extract the value string
- `SelectedOption` / `SelectedOptionChanged` — for single selection
- `SelectedOptions` / `SelectedOptionsChanged` — for multi-selection

```razor
<FluentSelect Items="@countries"
              OptionText="@(c => c.Name)"
              OptionValue="@(c => c.Code)"
              @bind-SelectedOption="@selectedCountry"
              Label="Country" />
```

**NOT** like this (wrong pattern):
```razor
@* WRONG — do not use InputSelect pattern *@
<FluentSelect @bind-Value="@selectedValue">
    <option value="1">One</option>
</FluentSelect>
```

### 6. Dialog service pattern

**Do NOT toggle visibility of `<FluentDialog>` tags.** Create a content component implementing `IDialogContentComponent<TData>` and show it via `IDialogService`:

```csharp
[Inject] private IDialogService DialogService { get; set; } = default!;

private async Task ShowEditDialog()
{
    var dialog = await DialogService.ShowDialogAsync<EditPersonDialog, Person>(
        person,
        new DialogParameters
        {
            Title = "Edit Person",
            PrimaryAction = "Save",
            SecondaryAction = "Cancel",
        });

    var result = await dialog.Result;
    if (!result.Cancelled)
    {
        var updatedPerson = result.Data as Person;
    }
}
```

### 7. Toast notifications

```csharp
[Inject] private IToastService ToastService { get; set; } = default!;

ToastService.ShowSuccess("Item saved successfully");
ToastService.ShowError("Failed to save");
ToastService.ShowWarning("Check your input");
ToastService.ShowInfo("New update available");
```

### 8. Design tokens work only after render

Design tokens rely on JS interop. **Never set them in `OnInitialized`** — use `OnAfterRenderAsync`.

```razor
<FluentDesignTheme Mode="DesignThemeModes.System"
                   OfficeColor="OfficeColor.Teams"
                   StorageName="mytheme" />
```

### 9. Forms: use EditForm with Fluent components

`FluentEditForm` is only needed inside `FluentWizard` steps. For regular forms use standard `EditForm`:

```razor
<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    <FluentTextField @bind-Value="@model.Name" Label="Name" Required />
    <FluentValidationSummary />
    <FluentButton Type="ButtonType.Submit" Appearance="Appearance.Accent">Save</FluentButton>
</EditForm>
```

Use `FluentValidationMessage` and `FluentValidationSummary` instead of standard Blazor validation components for Fluent styling.
