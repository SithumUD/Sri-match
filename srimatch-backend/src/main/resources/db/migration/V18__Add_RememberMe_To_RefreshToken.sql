-- V18: Add remember_me column to refresh_tokens table (PostgreSQL)
ALTER TABLE refresh_tokens ADD COLUMN remember_me BOOLEAN DEFAULT FALSE;
