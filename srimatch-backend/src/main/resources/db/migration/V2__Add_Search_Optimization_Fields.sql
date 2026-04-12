ALTER TABLE profiles 
ADD COLUMN is_boosted BOOLEAN DEFAULT FALSE,
ADD COLUMN id_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_is_boosted ON profiles(is_boosted);
CREATE INDEX idx_id_verified ON profiles(id_verified);
