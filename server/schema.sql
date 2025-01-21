-- Script generations table
CREATE TABLE IF NOT EXISTS script_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    user_request TEXT NOT NULL,
    script TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_email and created_at
CREATE INDEX IF NOT EXISTS idx_user_email_created_at
ON script_generations(user_email, created_at DESC);

-- Create index for created_at for global queries
CREATE INDEX IF NOT EXISTS idx_created_at
ON script_generations(created_at DESC);