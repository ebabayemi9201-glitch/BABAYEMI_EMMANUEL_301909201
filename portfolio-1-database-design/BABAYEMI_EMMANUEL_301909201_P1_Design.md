# Bank / Fintech Platform — database design

My case study records customer, account, transfer.

## Users

- Customers viewing their accounts and transfer history
- Operations analysts reviewing transfer activity
- Developers studying transactional account updates

## Main operations

- Register a customer and associate accounts with that customer.
- Record transfers between distinct accounts and track their status.
- List a customer's accounts by joining accounts to customers.
- Filter transfers by status and date range, joining the source account.
- Aggregate settled transfer amounts by source-account owner and month.
- Benchmark the same transfer date-range filter before and after a B-tree index using 50,000 synthetic transfer rows.

## Entities

| Entity | Information stored |
| --- | --- |
| customer | A synthetic customer who may own one or more accounts. |
| account | A customer's USD account with a current balance and operational status. |
| transfer | A transfer request and its lifecycle status between two distinct accounts. |

## customer

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| customer_id | BIGINT | PK | Yes |
| full_name | TEXT |  | Yes |
| email | TEXT | Unique | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
- Unique key: (email).

## account

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| account_id | BIGINT | PK | Yes |
| customer_id | BIGINT | FK | Yes |
| account_number | TEXT | Unique | Yes |
| balance | NUMERIC(18,2) |  | Yes |
| status | TEXT |  | Yes |
| opened_on | DATE |  | Yes |
- customer_id → customer.customer_id
- Unique key: (account_number).

## transfer

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| transfer_id | BIGINT | PK | Yes |
| source_account_id | BIGINT | FK | Yes |
| destination_account_id | BIGINT | FK | Yes |
| amount | NUMERIC(18,2) |  | Yes |
| status | TEXT |  | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
| idempotency_key | TEXT | Unique | Yes |
- source_account_id → account.account_id
- destination_account_id → account.account_id
- Unique key: (idempotency_key).

## Relationships and business rules

- Each customer email is unique.
- Each account number is unique.
- Every account belongs to an existing customer.
- Account balance must be greater than or equal to zero.
- Every transfer source account must exist.
- Every transfer destination account must exist.
- Transfer amount must be greater than zero.
- Source and destination account IDs must differ.
- An idempotency key can identify at most one transfer.
- Transfer status must be one of pending, settled, or rejected.

## Assumptions

- All records and identifiers are synthetic; identifiers are drawn from a shared globally unique ID namespace.
- The exercise models USD accounts only, so transfer amounts use the source and destination accounts' shared currency.
- Account balance is the current balance; transfer records describe activity and do not replace a full accounting ledger.
- A transfer is settled only after the account balance updates and transfer status are recorded in the same transaction.
- The account normalization example starts with account and its customer_id foreign key, then identifies customer attributes as belonging to customer; it uses no repeated ancestor roles.

