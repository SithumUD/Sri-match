-- Fix Cities table / add city indexes for fast search (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_cities_name_en ON cities (name_en);
CREATE INDEX IF NOT EXISTS idx_cities_postcode ON cities (postcode);
