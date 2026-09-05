DO $$
BEGIN
    FOR i IN 1..5000 LOOP
        INSERT INTO users (first_name, last_name, email, password, role) 
        VALUES ('User'||i, 'Test'||i, 'user'||i||'@test.com', 'pwd_hash_123', 'USER') 
        ON CONFLICT (email) DO NOTHING;
        
        INSERT INTO profiles (user_id, profession, district, partner_preferences, interests)
        VALUES (
            (SELECT id FROM users WHERE email = 'user'||i||'@test.com'),
            'Engineer',
            'Colombo',
            CASE WHEN i % 20 = 0 THEN '{"educationLevel": "BACHELORS", "maxAge": 30}'::jsonb ELSE '{"educationLevel": "MASTERS", "maxAge": 35}'::jsonb END,
            '["Reading", "Travel"]'::jsonb
        ) ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END $$;
