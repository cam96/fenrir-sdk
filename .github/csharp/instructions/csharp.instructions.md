---
applyTo: "**/*.cs"
---

# C# Coding Standards

- Target the latest stable C# language version unless the project specifies otherwise.
- Use file-scoped namespaces.
- Use primary constructors for simple types where appropriate.
- Prefer `record` types for immutable data transfer objects.
- Use `IReadOnlyList<T>` or `IEnumerable<T>` for return types when mutation is not intended.
- Prefer `switch` expressions over `switch` statements.
- Use pattern matching instead of type casting with `as`/`is`.
- Never use `var` when the type is not obvious from the right-hand side.
- Use nullable reference types (`#nullable enable`) in all new code.
- Guard clauses should be at the top of methods; avoid deeply nested `if` blocks.
- Use `ArgumentNullException.ThrowIfNull` for null guards.
