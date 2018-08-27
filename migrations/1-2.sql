CREATE TABLE users (
    id TEXT CONSTRAINT users_pkey PRIMARY KEY,
    email TEXT NOT NULL UNIQUE DEFAULT '',
    password_hash TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX email_index ON users(email); 