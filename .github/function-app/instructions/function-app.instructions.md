---
applyTo: "**/*Function.cs,**/*Trigger.cs,**/host.json,**/local.settings.json"
---

# Azure Functions Standards

- Use the isolated worker model (not in-process) for all new function apps.
- Prefer `[Function]` attribute over the classic `[FunctionName]`.
- Use dependency injection via `HostBuilder` — never use static classes for services.
- Always accept and propagate `CancellationToken` in function handlers.
- Use `ILogger<T>` from DI, not the injected `ILogger` parameter, for testability.
- Keep function handlers thin — delegate logic to injected services.
- Use `ServiceBusTrigger` with sessions for ordered processing scenarios.
- Avoid storing state in function instances — functions are stateless.
- Use Durable Functions for workflows requiring orchestration or fan-out/fan-in.
- Store all configuration in app settings / Key Vault — never hardcode connection strings.
- Idempotency is required for all message-triggered functions.
