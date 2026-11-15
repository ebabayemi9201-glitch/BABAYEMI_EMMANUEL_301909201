# Bank / Fintech Platform — ER diagram

```mermaid
erDiagram
    direction LR
    customer {
        bigint customer_id PK
        text full_name
        text email UK
        timestamptz created_at
    }
    account {
        bigint account_id PK
        bigint customer_id FK
        text account_number UK
        numeric balance
        text status
        date opened_on
    }
    transfer {
        bigint transfer_id PK
        bigint source_account_id FK
        bigint destination_account_id FK
        numeric amount
        text status
        timestamptz created_at
        text idempotency_key UK
    }
    customer ||--o{ account : "customer_id"
    account ||--o{ transfer : "source_account_id"
    account ||--o{ transfer : "destination_account_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/BABAYEMI_EMMANUEL_301909201_ERDiagram.png)
