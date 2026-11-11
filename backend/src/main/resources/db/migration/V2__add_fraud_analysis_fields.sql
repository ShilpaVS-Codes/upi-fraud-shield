
ALTER TABLE demo_transactions
    ADD COLUMN risk_score INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    ADD COLUMN risk_reasons TEXT NOT NULL DEFAULT '',
    ADD COLUMN decision VARCHAR(20) NOT NULL DEFAULT 'APPROVED';

ALTER TABLE demo_transactions
    ADD CONSTRAINT chk_demo_transactions_risk_score
        CHECK (risk_score BETWEEN 0 AND 100);
