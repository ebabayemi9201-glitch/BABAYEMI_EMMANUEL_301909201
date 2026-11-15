# Bank / Fintech Platform — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| customer_id | account records (list) |
| --- | --- |
| 1001 | [2001] |
| 1002 | [2002] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.full_name |
| --- | --- | --- | --- | --- |
| 2001 | 1001 | SYN-USD-0001 | 1001 | Avery Morgan |
| 2002 | 1002 | SYN-USD-0002 | 1002 | Riley Chen |

Key: account_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## account_example

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.full_name |
| --- | --- | --- | --- | --- |
| 2001 | 1001 | SYN-USD-0001 | 1001 | Avery Morgan |
| 2002 | 1002 | SYN-USD-0002 | 1002 | Riley Chen |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## customer

| customer_id | full_name | email | created_at |
| --- | --- | --- | --- |
| 1001 | Avery Morgan | avery.morgan@example.test | 2025-01-10T09:30:00+00:00 |
| 1002 | Riley Chen | riley.chen@example.test | 2025-02-14T11:45:00+00:00 |

## account

| account_id | customer_id | account_number | balance | status | opened_on |
| --- | --- | --- | --- | --- | --- |
| 2001 | 1001 | SYN-USD-0001 | 1250.75 | active | 2025-01-12 |
| 2002 | 1002 | SYN-USD-0002 | 800 | active | 2025-02-16 |

## transfer

| transfer_id | source_account_id | destination_account_id | amount | status | created_at | idempotency_key |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | 2002 | 125.5 | settled | 2025-03-01T14:00:00+00:00 | synthetic-transfer-0001 |
| 3002 | 2002 | 2001 | 40 | pending | 2025-03-02T13:15:00+00:00 | synthetic-transfer-0002 |

## Dependencies

- customer: (customer_id) → full_name, email, created_at
- account: (account_id) → customer_id, account_number, balance, status, opened_on
- transfer: (transfer_id) → source_account_id, destination_account_id, amount, status, created_at, idempotency_key

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
