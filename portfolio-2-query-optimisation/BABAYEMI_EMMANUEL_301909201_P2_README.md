# Bank / Fintech Platform — SQL queries

## 1. Show related customer, account records (up to 20).

```sql
SELECT t0."customer_id" AS "customer_customer_id",
       t0."full_name" AS "customer_full_name",
       t1."account_id" AS "account_account_id",
       t1."account_number" AS "account_account_number"
FROM portfolio."customer" t0
JOIN portfolio."account" t1 ON t1."customer_id" = t0."customer_id"
ORDER BY t0."customer_id", t1."account_id"
LIMIT 20;
```

| customer_customer_id | customer_full_name | account_account_id | account_account_number |
| --- | --- | --- | --- |
| 1001 | Avery Morgan | 2001 | SYN-USD-0001 |
| 1002 | Riley Chen | 2002 | SYN-USD-0002 |

## 2. Find transfer records where created_at matches "2025-03-01T14:00:00Z" (up to 20).

```sql
SELECT * FROM portfolio."transfer"
WHERE "created_at" IS NOT DISTINCT FROM '2025-03-01T14:00:00Z'
ORDER BY "transfer_id"
LIMIT 20;
```

| transfer_id | source_account_id | destination_account_id | amount | status | created_at | idempotency_key |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | 2002 | 125.5 | settled | 2025-03-01T14:00:00+00:00 | synthetic-transfer-0001 |

## 3. Count transfer records for each source_account_id (up to 20 groups).

```sql
SELECT "source_account_id", count(*) AS record_count
FROM portfolio."transfer"
GROUP BY "source_account_id"
ORDER BY record_count DESC, "source_account_id" NULLS LAST
LIMIT 20;
```

| source_account_id | record_count |
| --- | --- |
| 2001 | 1 |
| 2002 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 2.523 | 2.523, 5.372, 2.398 | Sort → Seq Scan | 274 |
| After index | 0.311 | 0.387, 0.311, 0.281 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 55 |

The median execution time changed from 2.523 ms to 0.311 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=2.495..2.498 rows=50 loops=1)
  Seq Scan on transfer (actual time=0.015..2.453 rows=50 loops=1)
Planning Time: 0.343 ms
Execution Time: 2.523 ms
```

### Before index, run 2

```text
Sort (actual time=5.309..5.328 rows=50 loops=1)
  Seq Scan on transfer (actual time=0.023..5.243 rows=50 loops=1)
Planning Time: 0.457 ms
Execution Time: 5.372 ms
```

### Before index, run 3

```text
Sort (actual time=2.371..2.373 rows=50 loops=1)
  Seq Scan on transfer (actual time=0.014..2.331 rows=50 loops=1)
Planning Time: 0.348 ms
Execution Time: 2.398 ms
```

### After index, run 1

```text
Sort (actual time=0.306..0.31 rows=50 loops=1)
  Bitmap Heap Scan on transfer (actual time=0.044..0.249 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.024..0.024 rows=50 loops=1)
Planning Time: 0.755 ms
Execution Time: 0.387 ms
```

### After index, run 2

```text
Sort (actual time=0.253..0.256 rows=50 loops=1)
  Bitmap Heap Scan on transfer (actual time=0.031..0.216 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.016 rows=50 loops=1)
Planning Time: 0.495 ms
Execution Time: 0.311 ms
```

### After index, run 3

```text
Sort (actual time=0.226..0.229 rows=50 loops=1)
  Bitmap Heap Scan on transfer (actual time=0.031..0.187 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.016..0.016 rows=50 loops=1)
Planning Time: 0.518 ms
Execution Time: 0.281 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run BABAYEMI_EMMANUEL_301909201_P2_Queries.sql, then BABAYEMI_EMMANUEL_301909201_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/BABAYEMI_EMMANUEL_301909201_P2_QueryResults.png) · [Index comparison](screenshots/BABAYEMI_EMMANUEL_301909201_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

