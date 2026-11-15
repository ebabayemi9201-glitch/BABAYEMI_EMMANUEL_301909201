-- Fictional sample records for Bank / Fintech Platform.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "created_at") VALUES (1001, 'Avery Morgan', 'avery.morgan@example.test', '2025-01-10T09:30:00Z');
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "created_at") VALUES (1002, 'Riley Chen', 'riley.chen@example.test', '2025-02-14T11:45:00+00:00');
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on") VALUES (2001, 1001, 'SYN-USD-0001', 1250.75, 'active', '2025-01-12');
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on") VALUES (2002, 1002, 'SYN-USD-0002', 800, 'active', '2025-02-16');
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key") VALUES (3001, 2001, 2002, 125.5, 'settled', '2025-03-01T14:00:00Z', 'synthetic-transfer-0001');
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key") VALUES (3002, 2002, 2001, 40, 'pending', '2025-03-02T08:15:00-05:00', 'synthetic-transfer-0002');
COMMIT;
