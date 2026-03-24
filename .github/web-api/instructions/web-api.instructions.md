---
applyTo: "**/*Controller.cs,**/*Endpoint*.cs,**/Program.cs,**/Startup.cs"
---

# ASP.NET Core Web API Standards

- Prefer minimal API endpoints over controllers for new projects.
- Use the `Results` static class for returning responses in minimal APIs.
- Group endpoints using `MapGroup` and apply auth/middleware at the group level.
- Always return `ProblemDetails`-compliant error responses.
- Use `[FromBody]`, `[FromRoute]`, `[FromQuery]` explicitly — do not rely on implicit binding.
- Validate all input using `FluentValidation` or `DataAnnotations`; reject invalid input at the boundary.
- Never expose internal exception details in API responses.
- Use `ILogger<T>` for all logging; never use `Console.Write`.
- Apply `[Authorize]` at the group or endpoint level — deny by default, allow explicitly.
- Use `CancellationToken` in all endpoint handlers.
- Version your API using URL path versioning (`/api/v1/`).
