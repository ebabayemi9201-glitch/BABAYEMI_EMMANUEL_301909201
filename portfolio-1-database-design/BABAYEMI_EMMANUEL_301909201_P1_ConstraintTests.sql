-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. customer duplicate pk. Expected: pk_customer, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "created_at")
VALUES (1001, 'Jordan Lee', 'jordan.lee@example.test', '2025-04-01T10:00:00Z');

-- 2. customer duplicate email. Expected: uq_customer_0, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "created_at")
VALUES (9001, 'Jordan Lee', 'avery.morgan@example.test', '2025-04-01T10:00:00Z');

-- 3. customer missing email. Expected: email, SQLSTATE 23502.
INSERT INTO portfolio."customer" ("customer_id", "full_name", "email", "created_at")
VALUES (9002, 'Jordan Lee', NULL, '2025-04-01T10:00:00Z');

-- 4. account duplicate pk. Expected: pk_account, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on")
VALUES (2001, 1001, 'SYN-USD-9001', 10, 'active', '2025-04-01');

-- 5. account duplicate number. Expected: uq_account_0, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on")
VALUES (9003, 1001, 'SYN-USD-0001', 10, 'active', '2025-04-01');

-- 6. account missing customer. Expected: fk_account_0, SQLSTATE 23503.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on")
VALUES (9004, 9999, 'SYN-USD-9004', 10, 'active', '2025-04-01');

-- 7. account negative balance. Expected: account_nonnegative_balance, SQLSTATE 23514.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "balance", "status", "opened_on")
VALUES (9005, 1001, 'SYN-USD-9005', -1, 'active', '2025-04-01');

-- 8. transfer duplicate pk. Expected: pk_transfer, SQLSTATE 23505.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (3001, 2001, 2002, 10, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-9001');

-- 9. transfer duplicate idempotency. Expected: uq_transfer_0, SQLSTATE 23505.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9002, 2001, 2002, 10, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-0001');

-- 10. transfer missing source. Expected: fk_transfer_0, SQLSTATE 23503.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9003, 9998, 2002, 10, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-9003');

-- 11. transfer missing destination. Expected: fk_transfer_1, SQLSTATE 23503.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9004, 2001, 9997, 10, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-9004');

-- 12. transfer zero amount. Expected: transfer_positive_amount, SQLSTATE 23514.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9005, 2001, 2002, 0, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-9005');

-- 13. transfer same accounts. Expected: transfer_distinct_accounts, SQLSTATE 23514.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9006, 2001, 2001, 10, 'pending', '2025-04-01T10:00:00Z', 'synthetic-transfer-9006');

-- 14. transfer invalid status. Expected: transfer_status_check, SQLSTATE 23514.
INSERT INTO portfolio."transfer" ("transfer_id", "source_account_id", "destination_account_id", "amount", "status", "created_at", "idempotency_key")
VALUES (9007, 2001, 2002, 10, 'queued', '2025-04-01T10:00:00Z', 'synthetic-transfer-9007');
