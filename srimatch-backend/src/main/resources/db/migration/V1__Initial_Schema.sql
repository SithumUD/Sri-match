-- V1: Initial Schema for SriMatch (PostgreSQL)

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_profile_completed BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expiry_date TIMESTAMP,
    referral_code_used VARCHAR(255),
    agree_to_marketing BOOLEAN DEFAULT FALSE,
    agree_to_terms BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    daily_like_limit INT DEFAULT 20,
    likes_today INT DEFAULT 0,
    last_like_reset TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_phone ON users (phone_number);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_created_at ON users (created_at);

-- Profiles table
CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    gender VARCHAR(20),
    date_of_birth DATE,
    marital_status VARCHAR(20),
    has_children BOOLEAN,
    number_of_children INT,
    district VARCHAR(100),
    city VARCHAR(100),
    place_of_birth VARCHAR(100),
    religion VARCHAR(20),
    religious_practices TEXT,
    ethnicity VARCHAR(20),
    languages TEXT,
    horoscope_sign VARCHAR(30),
    birth_star VARCHAR(50),
    horoscope_details TEXT,
    education VARCHAR(30),
    field_of_study VARCHAR(100),
    profession VARCHAR(100),
    industry VARCHAR(100),
    employer VARCHAR(200),
    work_location VARCHAR(100),
    income_range VARCHAR(50),
    height INT,
    body_type VARCHAR(20),
    complexion VARCHAR(20),
    smoking VARCHAR(20),
    drinking VARCHAR(20),
    dietary_preferences VARCHAR(30),
    health_habits TEXT,
    lifestyle TEXT,
    family_background TEXT,
    cultural_values TEXT,
    family_involvement TEXT,
    wedding_preferences TEXT,
    about TEXT,
    interests TEXT,
    favorite_things TEXT,
    travel_preferences TEXT,
    personality_traits VARCHAR(500),
    partner_preferences TEXT,
    dealbreakers TEXT,
    profile_images TEXT,
    primary_image_url VARCHAR(500),
    quiz_answers TEXT,
    verification_status TEXT,
    completion_score INT DEFAULT 0,
    profile_views INT DEFAULT 0,
    last_active_at TIMESTAMP,
    is_visible BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_profiles_gender ON profiles (gender);
CREATE INDEX idx_profiles_religion ON profiles (religion);
CREATE INDEX idx_profiles_district ON profiles (district);
CREATE INDEX idx_profiles_marital_status ON profiles (marital_status);
CREATE INDEX idx_profiles_completion_score ON profiles (completion_score);
CREATE INDEX idx_profiles_last_active ON profiles (last_active_at);

-- Refresh Tokens table
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

-- OTP Verifications table
CREATE TABLE otp_verifications (
    id BIGSERIAL PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    otp_type VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_identifier_type ON otp_verifications (identifier, otp_type);
CREATE INDEX idx_otp_expires_at ON otp_verifications (expires_at);

-- Likes table
CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    expires_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (sender_id, receiver_id),
    CONSTRAINT fk_like_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_like_receiver FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_likes_sender_id ON likes (sender_id);
CREATE INDEX idx_likes_receiver_id ON likes (receiver_id);
CREATE INDEX idx_likes_status ON likes (status);
CREATE INDEX idx_likes_created_at ON likes (created_at);

-- Matches table
CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    like_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    compatibility_score INT DEFAULT 0,
    user1_notified BOOLEAN DEFAULT FALSE,
    user2_notified BOOLEAN DEFAULT FALSE,
    matched_at TIMESTAMP,
    expires_at TIMESTAMP,
    ended_at TIMESTAMP,
    end_reason VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_match_user1 FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_match_user2 FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_matches_user1_id ON matches (user1_id);
CREATE INDEX idx_matches_user2_id ON matches (user2_id);
CREATE INDEX idx_matches_status ON matches (status);
CREATE INDEX idx_matches_created_at ON matches (created_at);
CREATE INDEX idx_matches_compatibility_score ON matches (compatibility_score);

-- Messages table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    status VARCHAR(20) NOT NULL DEFAULT 'SENT',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_premium_message BOOLEAN DEFAULT FALSE,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_receiver BOOLEAN DEFAULT FALSE,
    media_url VARCHAR(500),
    media_type VARCHAR(50),
    media_size BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_message_match FOREIGN KEY (match_id) REFERENCES matches (id) ON DELETE SET NULL,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_message_receiver FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_match_id ON messages (match_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_status ON messages (status);
CREATE INDEX idx_messages_created_at ON messages (created_at);
CREATE INDEX idx_messages_is_premium_message ON messages (is_premium_message);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (is_read);
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

-- Payments table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payment_id VARCHAR(100) UNIQUE,
    order_id VARCHAR(100) UNIQUE,
    plan VARCHAR(20) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(3),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    payment_details TEXT,
    failure_reason TEXT,
    refund_amount DOUBLE PRECISION,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_payment_id ON payments (payment_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_created_at ON payments (created_at);

-- Reports table
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    reported_user_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by BIGINT,
    action_taken VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_report_reported_user FOREIGN KEY (reported_user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_report_resolver FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX idx_reports_reporter_id ON reports (reporter_id);
CREATE INDEX idx_reports_reported_user_id ON reports (reported_user_id);
CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_created_at ON reports (created_at);

-- Audit Logs table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
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
    success BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_action ON audit_logs (action);
CREATE INDEX idx_audit_ip_address ON audit_logs (ip_address);
CREATE INDEX idx_audit_created_at ON audit_logs (created_at);
