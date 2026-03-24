---
applyTo: "**"
---

# General Coding Standards

- Follow SOLID principles.
- Prefer composition over inheritance.
- Keep methods short and focused on a single responsibility.
- Use meaningful names for variables, methods, and classes — avoid abbreviations.
- Never suppress warnings without a documented justification.
- All public APIs must have XML doc comments.
- Do not leave dead code or commented-out blocks in committed files.
- Prefer `async`/`await` over raw `Task.ContinueWith`.
- Always handle `CancellationToken` propagation in async methods.
