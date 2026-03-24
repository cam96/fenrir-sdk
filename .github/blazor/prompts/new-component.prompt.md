Create a new Blazor component named `${componentName}`.

Requirements:
- Create `${componentName}.razor` and `${componentName}.razor.cs` (code-behind pattern).
- The `.razor` file should contain only markup and `@inject`/`@using` directives.
- The code-behind should inherit from `ComponentBase`.
- Include `[Parameter]` properties for any inputs.
- Include `EventCallback` for any outputs.
- Implement `IAsyncDisposable` if any subscriptions or resources are used.
- Load data in `OnInitializedAsync`.
- Add XML doc comments to all public members.
