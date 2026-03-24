---
name: sql-optimization
description: 'T-SQL and SQL Server performance optimization. Covers query tuning, indexing strategies, execution plan analysis, and common anti-patterns.'
---

# SQL Performance Optimization

Expert SQL Server performance optimization. Focus on query tuning, indexing, and eliminating anti-patterns.

## Core Optimization Areas

### Query Rewriting

```sql
-- BAD: Correlated subquery executes per row
SELECT p.Name, p.Price
FROM dbo.Products p
WHERE p.Price > (
    SELECT AVG(p2.Price)
    FROM dbo.Products p2
    WHERE p2.CategoryId = p.CategoryId
);

-- GOOD: Window function, single scan
SELECT Name, Price
FROM (
    SELECT Name, Price,
           AVG(Price) OVER (PARTITION BY CategoryId) AS AvgCategoryPrice
    FROM dbo.Products
) x
WHERE Price > AvgCategoryPrice;
```

### Avoid Functions on Indexed Columns in WHERE

```sql
-- BAD: Prevents index seek
WHERE UPPER(Email) = 'USER@EXAMPLE.COM'
WHERE YEAR(OrderDate) = 2024
WHERE LEN(Notes) > 0

-- GOOD: Sargable predicates
WHERE Email = 'user@example.com'          -- use case-insensitive collation
WHERE OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01'
WHERE Notes IS NOT NULL AND Notes <> ''
```

### Subquery vs JOIN vs EXISTS

```sql
-- GOOD: EXISTS for existence check (stops at first match)
WHERE EXISTS (SELECT 1 FROM dbo.Orders o WHERE o.CustomerId = c.Id)

-- BAD: COUNT for existence (scans all rows)
WHERE (SELECT COUNT(*) FROM dbo.Orders o WHERE o.CustomerId = c.Id) > 0
```

## Index Strategy

### Covering Indexes

```sql
-- Query: SELECT Id, TotalAmount FROM dbo.Orders WHERE CustomerId = @id AND Status = 'Active'
-- Covering index eliminates key lookup:
CREATE INDEX IX_Orders_CustomerId_Status
ON dbo.Orders (CustomerId, Status)
INCLUDE (Id, TotalAmount);
```

### Filtered Indexes

```sql
-- Only index the rows you query for:
CREATE INDEX IX_Orders_Pending
ON dbo.Orders (CreatedAt)
WHERE Status IN ('Pending', 'Processing');
```

### Over-Indexing Warning
- Every index slows `INSERT`, `UPDATE`, `DELETE`
- Remove unused indexes (check `sys.dm_db_index_usage_stats`)
- Consolidate indexes with overlapping leading columns

## Pagination

```sql
-- BAD: OFFSET degrades as page number grows
SELECT * FROM dbo.Products ORDER BY Id OFFSET 50000 ROWS FETCH NEXT 20 ROWS ONLY;

-- GOOD: Keyset/cursor-based pagination
SELECT TOP 20 Id, Name, Price
FROM dbo.Products
WHERE Id > @lastSeenId
ORDER BY Id;
```

## Aggregation

```sql
-- BAD: Three separate queries
SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'Pending';
SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'Shipped';
SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'Delivered';

-- GOOD: Single scan
SELECT
    COUNT(CASE WHEN Status = 'Pending'   THEN 1 END) AS PendingCount,
    COUNT(CASE WHEN Status = 'Shipped'   THEN 1 END) AS ShippedCount,
    COUNT(CASE WHEN Status = 'Delivered' THEN 1 END) AS DeliveredCount
FROM dbo.Orders;
```

## Execution Plan Analysis

Key things to look for in execution plans:
- **Key Lookup** — missing include columns on an index
- **RID Lookup** — table has no clustered index (heap); add a clustered index
- **Sort** — expensive; consider an index that pre-sorts the data
- **Hash Match** — join on unindexed columns; consider indexes or query rewrite
- **Table Scan / Clustered Index Scan** — may need a filtered index or WHERE rewrite
- **Estimated vs Actual rows diverge significantly** — stale statistics; run `UPDATE STATISTICS`

## Universal Optimization Checklist

- [ ] No `SELECT *` in production queries
- [ ] WHERE clause predicates are sargable (no functions on columns)
- [ ] EXISTS used instead of COUNT for existence checks
- [ ] Covering indexes exist for hot queries
- [ ] No correlated subqueries that execute per row
- [ ] Efficient pagination (keyset, not OFFSET for large datasets)
- [ ] Batch inserts/updates instead of row-by-row loops
- [ ] Statistics are up to date on large tables
- [ ] Unused indexes identified and removed
