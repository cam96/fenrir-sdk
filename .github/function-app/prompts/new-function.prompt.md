---
mode: edit
---

Create a new Azure Function named `${functionName}` using the isolated worker model.

Requirements:
- Use the `[Function("${functionName}")]` attribute.
- Trigger type: `${triggerType}` (e.g., HttpTrigger, ServiceBusTrigger, TimerTrigger).
- Inject dependencies via constructor — no static service access.
- Accept `CancellationToken` as a parameter.
- Delegate all business logic to an injected service interface.
- Add the function registration to `Program.cs` if not already present.
- Include basic structured logging at entry and exit.
- Handle and log exceptions without rethrowing unless necessary for retry semantics.
