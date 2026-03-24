---
applyTo: "**/*.sql"
---

# T-SQL Standards

- Always specify a schema prefix (`dbo.TableName`), never assume the default schema.
- Use `SET NOCOUNT ON` at the top of all stored procedures.
- Wrap multi-statement procedures in explicit transactions with `TRY`/`CATCH`.
- Use `SET XACT_ABORT ON` in stored procedures that contain transactions.
- Never use `SELECT *` in production code — always name columns explicitly.
- Avoid cursors; prefer set-based operations or `STRING_AGG`/`CROSS APPLY`.
- Use `sp_executesql` with parameters for dynamic SQL — never concatenate user input.
- Index foreign key columns unless a covering index already exists.
- Use `NOLOCK` hints only when explicitly justified and documented.
- Write `JOIN` conditions using `ON`, not `WHERE` clause filtering.
- Prefer `EXISTS` over `COUNT(*)` for existence checks.
- All stored procedures and views must have a header comment block with purpose, author, and date.
