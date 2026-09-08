-- V24: Unify Profile Schema — Add new fields, fix enum string data
-- Aligns DB with SriMatch-Unified-Profile-Schema-v2.md canonical definitions

-- ─── 1. Add new columns ───────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS future_aspirations TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_completion_percent INTEGER DEFAULT 0;

-- ─── 2. Fix RelocationWillingness string values ────────────────────────────
-- Old: WITHIN_DISTRICT → Canonical: WITHIN_CURRENT_AREA
UPDATE profiles SET relocation_willingness = 'WITHIN_CURRENT_AREA'
  WHERE relocation_willingness = 'WITHIN_DISTRICT';

-- Old: ANYWHERE → Canonical: ANYWHERE_INCLUDING_ABROAD
UPDATE profiles SET relocation_willingness = 'ANYWHERE_INCLUDING_ABROAD'
  WHERE relocation_willingness = 'ANYWHERE';

-- Backfill any NULL values with a safe default
UPDATE profiles SET relocation_willingness = 'WITHIN_SRI_LANKA'
  WHERE relocation_willingness IS NULL;

-- ─── 3. Fix Religion string values ────────────────────────────────────────
-- Old: NON_ROMAN_CATHOLIC → Canonical: CHRISTIAN (clearer label)
UPDATE profiles SET religion = 'CHRISTIAN'
  WHERE religion = 'NON_ROMAN_CATHOLIC';

-- Old: MUSLIM (religion field should use ISLAM; MOOR is the ethnic term) → ISLAM
UPDATE profiles SET religion = 'ISLAM'
  WHERE religion = 'MUSLIM';

-- Fix partner_preferences JSONB: rename .religion → .religionPreference if old key used
UPDATE profiles
  SET partner_preferences = (partner_preferences - 'religion') || jsonb_build_object('religionPreference', partner_preferences->'religion')
  WHERE partner_preferences ? 'religion'
    AND NOT (partner_preferences ? 'religionPreference');

-- ─── 4. Fix Ethnicity string values ───────────────────────────────────────
-- Old: MUSLIM (wrong — ethnicity term is MOOR) → MOOR
UPDATE profiles SET ethnicity = 'MOOR'
  WHERE ethnicity = 'MUSLIM';

-- ─── 5. Fix FamilyType string values ──────────────────────────────────────
-- Old: JOINT → Canonical: EXTENDED (matches UI everywhere)
UPDATE profiles SET family_type = 'EXTENDED'
  WHERE family_type = 'JOINT';

-- ─── 6. Fix EducationLevel string values ──────────────────────────────────
-- Old: PROFESSIONAL → Canonical: PROFESSIONAL_CERTIFICATION
UPDATE profiles SET education = 'PROFESSIONAL_CERTIFICATION'
  WHERE education = 'PROFESSIONAL';

-- ─── 7. Fix BodyType string values ────────────────────────────────────────
-- Consolidate: OVERWEIGHT + PLUS_SIZE → HEAVY
UPDATE profiles SET body_type = 'HEAVY'
  WHERE body_type IN ('OVERWEIGHT', 'PLUS_SIZE');

-- ─── 8. Initialize privacySettings defaults for existing profiles ──────────
UPDATE profiles
  SET privacy_settings = '{
    "profileVisibility": "EVERYONE",
    "showInSearchResults": true,
    "visibleToVerifiedOnly": false,
    "incognitoMode": false,
    "photoVisibility": "PUBLIC",
    "watermarkPhotos": false,
    "showExactLocation": true,
    "showDistance": true,
    "whoCanMessage": "MATCHED_MEMBERS_ONLY",
    "whoCanConnect": "EVERYONE",
    "readReceipts": true,
    "showTypingIndicator": true,
    "showOnlineStatus": true,
    "showLastActive": false,
    "showIncomeRange": false,
    "showFamilyDetails": true,
    "showPartnerPreferences": true,
    "showQuizAnswers": true,
    "requireMatchForContactInfo": true
  }'::jsonb
  WHERE privacy_settings IS NULL OR privacy_settings = '{}'::jsonb;
