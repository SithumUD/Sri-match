-- Create User Verifications table
CREATE TABLE user_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    id_front_path VARCHAR(255),
    id_back_path VARCHAR(255),
    selfie_path VARCHAR(255),
    selfie_session_token VARCHAR(100),
    admin_notes TEXT,
    resolved_at DATETIME,
    resolved_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_verif_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_verif_admin FOREIGN KEY (resolved_by) REFERENCES users(id)
);

-- Create Audit Logs table (in case it doesn't exist)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_email VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    request_method VARCHAR(10),
    request_url VARCHAR(500),
    status_code INT,
    response_time_ms BIGINT,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_email (user_email),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created_at (created_at)
);
