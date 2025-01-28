CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50)  UNIQUE NOT NULL CHECK (LENGTH(username) >= 3),
    password_hash VARCHAR(60) NOT NULL,
    totp VARCHAR(50)
);