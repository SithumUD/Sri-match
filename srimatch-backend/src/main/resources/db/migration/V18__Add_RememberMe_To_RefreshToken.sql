-- V18: Add remember_me column to refresh_tokens table to track session persistence
ALTER TABLE refresh_tokens ADD COLUMN remember_me BIT(1) DEFAULT 0;
