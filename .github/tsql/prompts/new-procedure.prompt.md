---
mode: edit
---

Write a T-SQL stored procedure named `${procedureName}` for `${description}`.

Requirements:
- Include `SET NOCOUNT ON` and `SET XACT_ABORT ON`.
- Wrap in `BEGIN TRY` / `BEGIN CATCH` with transaction rollback on error.
- Use explicit schema prefixes on all object references.
- Use `sp_executesql` if any dynamic SQL is needed.
- Name all columns explicitly — no `SELECT *`.
- Add a header comment block: purpose, parameters, return values.
- Use `CREATE OR ALTER PROCEDURE` syntax for idempotent deployment.
