-- Fix Cities table to match Hibernate expectation (ID must be BIGINT for Long)
ALTER TABLE cities MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

-- Also update VARCHAR lengths to default 255 to prevent secondary validation errors
ALTER TABLE cities MODIFY name_en VARCHAR(255);
ALTER TABLE cities MODIFY name_si VARCHAR(255);
ALTER TABLE cities MODIFY name_ta VARCHAR(255);
ALTER TABLE cities MODIFY sub_name_en VARCHAR(255);
ALTER TABLE cities MODIFY sub_name_si VARCHAR(255);
ALTER TABLE cities MODIFY sub_name_ta VARCHAR(255);
ALTER TABLE cities MODIFY postcode VARCHAR(255);
