
CREATE TABLE demo_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(255),
    city VARCHAR(60) NOT NULL,
    upi_id VARCHAR(64) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_demo_users_mobile
        CHECK (mobile ~ '^[6-9][0-9]{9}$')
);

CREATE INDEX idx_demo_users_upi_id
    ON demo_users (upi_id);
