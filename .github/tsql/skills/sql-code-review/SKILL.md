---
name: sql-code-review
description: 'Comprehensive SQL code review for security, performance, maintainability, and best practices. Focuses on SQL injection prevention, access control, code standards, and anti-pattern detection.'
---

# SQL Code Review

Perform a thorough SQL code review of the selected code focusing on security, performance, maintainability, and T-SQL best practices.

## Security Analysis

### SQL Injection Prevention
- All user input must use parameterized queries (`sp_executesql` with typed parameters)
- Never concatenate user input into dynamic SQL strings
- Review all `EXEC` and `sp_executesql` calls

```sql
-- BAD: SQL injection vulnerability
SET @sql = 'SELECT * FROM dbo.Users WHERE Name = ''' + @input + ''''

-- GOOD: Parameterized dynamic SQL
EXEC sp_executesql
    N'SELECT u.Id, u.Name FROM dbo.Users u WHERE u.Name = @name',
    N'@name NVARCHAR(100)',
    @name = @input;
```

### Access Control & Permissions
- Grant minimum required permissions (principle of least privilege)
- Use database roles instead of direct user permissions
- Review `EXECUTE AS` and ownership chains

### Data Protection
- Avoid `SELECT *` on tables with sensitive columns
- Ensure sensitive operations are logged
- Use appropriate data types to prevent data truncation silently

## Performance Review

### Query Structure
```sql
-- BAD: Function in WHERE clause prevents index usage
WHERE YEAR(o.OrderDate) = 2024

-- GOOD: Range condition uses index
WHERE o.OrderDate >= '2024-01-01' AND o.OrderDate < '2025-01-01'
```

### Index Strategy
- Identify columns that need indexing (frequent WHERE, JOIN, ORDER BY columns)
- Find unused or redundant indexes
- Check for missing covering indexes on hot queries
- Flag foreign key columns without indexes

### Join Optimization
- Verify appropriate join types (INNER vs LEFT vs EXISTS)
- Identify missing join conditions (accidental Cartesian products)
- Prefer `EXISTS` over `COUNT(*)` for existence checks
- Prefer `EXISTS`/`NOT EXISTS` over `IN`/`NOT IN` for subqueries with NULLs

### Anti-Patterns
- N+1 queries (correlated subqueries that execute per row)
- Overuse of `DISTINCT` masking missing join conditions
- `OR` in WHERE clauses that prevent index seeks
- Implicit conversions in JOIN/WHERE conditions

## Code Quality Checklist

### Must Fix
- [ ] All dynamic SQL uses `sp_executesql` with parameters
- [ ] No `SELECT *` in stored procedures or views
- [ ] Schema prefixes on all object references (`dbo.TableName`)
- [ ] `SET NOCOUNT ON` at top of all procedures
- [ ] `SET XACT_ABORT ON` in procedures with transactions
- [ ] Transactions wrapped in `BEGIN TRY` / `BEGIN CATCH` with rollback

### Should Fix
- [ ] Consistent naming conventions across all objects
- [ ] Header comment block on all procedures and views (purpose, params, author)
- [ ] `CREATE OR ALTER` syntax for idempotent deployments
- [ ] Appropriate data types (avoid `VARCHAR(MAX)` unless necessary)
- [ ] `NOT NULL` constraints where nulls are not meaningful

### Review Output Format

For each issue found:
- **Location**: Object name and approximate line
- **Issue**: Explanation of the problem
- **Risk**: Security risk or performance impact
- **Fix**: Specific corrected code example
