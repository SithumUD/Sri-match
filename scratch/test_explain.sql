SET enable_seqscan = off;
EXPLAIN ANALYZE SELECT * FROM profiles WHERE partner_preferences @> '{"educationLevel": "BACHELORS"}';
