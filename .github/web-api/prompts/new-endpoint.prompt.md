---
mode: edit
---

Create a new minimal API endpoint group for `${resourceName}`.

Requirements:
- Create a static class `${resourceName}Endpoints` with a `MapRoutes(IEndpointRouteBuilder app)` method.
- Group all routes under `/api/v1/${resourceName}`.
- Implement GET (list + by id), POST, PUT, and DELETE handlers.
- Accept and return a `${resourceName}Dto` record type.
- Use `Results<T1, T2>` union return types for proper OpenAPI schema generation.
- Apply `[Authorize]` to the group.
- Accept `CancellationToken` in each handler.
- Return `ProblemDetails` on error cases.
- Register the endpoint group in `Program.cs`.
