-- V12: Create System Settings Table (PostgreSQL)
CREATE TABLE system_settings (
    setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
    setting_value TEXT,
    description VARCHAR(255),
    setting_group VARCHAR(50),
    data_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (setting_key, setting_value, description, setting_group, data_type) VALUES
('MAINTENANCE_MODE', 'false', 'Enable maintenance mode to restrict user access', 'GENERAL', 'BOOLEAN'),
('FREE_LIKES_LIMIT', '15', 'Maximum number of likes a free user can send per cycle', 'MATCHMAKING', 'NUMBER'),
('FREE_LIKES_CYCLE_DAYS', '5', 'Number of days in a like limit cycle for free users', 'MATCHMAKING', 'NUMBER'),
('CONTACT_EMAIL', 'support@srimatch.com', 'Application support contact email', 'CONTACT_INFO', 'TEXT'),
('AUTO_APPROVE_PROFILES', 'true', 'Automatically approve newly registered user profiles', 'GENERAL', 'BOOLEAN');
