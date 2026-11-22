ALTER TABLE demo_users
    ADD COLUMN fingerprint_slot INTEGER,
    ADD CONSTRAINT demo_users_fingerprint_slot_unique UNIQUE (fingerprint_slot),
    ADD CONSTRAINT demo_users_fingerprint_slot_positive CHECK (fingerprint_slot > 0);
