-- V21: Convert profile JSON text columns to native PostgreSQL JSONB with GIN indexes

-- 1. Safely alter partner_preferences to JSONB
ALTER TABLE profiles 
    ALTER COLUMN partner_preferences TYPE JSONB 
    USING (CASE WHEN partner_preferences IS NULL OR TRIM(partner_preferences) = '' THEN '{}'::jsonb ELSE partner_preferences::jsonb END);

-- 2. Safely alter interests to JSONB
ALTER TABLE profiles 
    ALTER COLUMN interests TYPE JSONB 
    USING (CASE WHEN interests IS NULL OR TRIM(interests) = '' THEN '[]'::jsonb ELSE interests::jsonb END);

-- 3. Safely alter favorite_things to JSONB
ALTER TABLE profiles 
    ALTER COLUMN favorite_things TYPE JSONB 
    USING (CASE WHEN favorite_things IS NULL OR TRIM(favorite_things) = '' THEN '{}'::jsonb ELSE favorite_things::jsonb END);

-- 4. Safely alter languages to JSONB
ALTER TABLE profiles 
    ALTER COLUMN languages TYPE JSONB 
    USING (CASE WHEN languages IS NULL OR TRIM(languages) = '' THEN '[]'::jsonb ELSE languages::jsonb END);

-- 5. Create GIN index on partner_preferences and interests for fast containment queries
CREATE INDEX IF NOT EXISTS idx_profiles_partner_preferences_gin ON profiles USING GIN (partner_preferences);
CREATE INDEX IF NOT EXISTS idx_profiles_interests_gin ON profiles USING GIN (interests);
