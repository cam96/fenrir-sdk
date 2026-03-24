---
applyTo: "**/*.razor,**/*.razor.cs"
---

# Blazor Coding Standards

- Prefer code-behind (`.razor.cs`) files for components with significant logic.
- Use `[Parameter]` only for values the parent controls; use cascading parameters sparingly.
- Always implement `IDisposable` (or `IAsyncDisposable`) when subscribing to events or using resources.
- Use `EventCallback<T>` for component events, not plain `Action` or `Func`.
- Prefer `@inject` over constructor injection in `.razor` files.
- Do not perform async data loading in `OnInitialized`; use `OnInitializedAsync`.
- Use `StateHasChanged()` only when needed (e.g., after non-UI-thread updates).
- Keep components small and focused — extract child components rather than growing a single component.
- Use `EditForm` with `DataAnnotationsValidator` for all forms.
- Avoid direct DOM manipulation; use JS interop only as a last resort.
