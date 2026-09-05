-- V20: Enforce database-level immutability on audit_logs table (PostgreSQL)

-- 1. Create a trigger function that blocks any UPDATE or DELETE on audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Security Policy Violation: audit_logs is append-only and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

-- 2. Attach trigger to audit_logs table
DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_modification();

-- 3. Revoke permissions if srimatch_user role exists in the environment
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'srimatch_user') THEN
        REVOKE UPDATE, DELETE ON audit_logs FROM srimatch_user;
        GRANT INSERT, SELECT ON audit_logs TO srimatch_user;
    END IF;
END $$;
