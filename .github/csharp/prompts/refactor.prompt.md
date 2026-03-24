Refactor the selected C# code to:

1. Apply guard clauses at the top of the method.
2. Replace any `if`/`else` chains with pattern matching or `switch` expressions where appropriate.
3. Extract any inline logic longer than 5 lines into a well-named private method.
4. Replace `var` usages where the type is not obvious.
5. Ensure `CancellationToken` is accepted and propagated if the method is async.
6. Enable nullable reference type annotations if not already present.

Preserve all existing behavior. Do not add new features.
