INSERT INTO species_catalog (category, scientific_name, korean_name, english_name)
SELECT '볏도마뱀붙이', 'Correlophus ciliatus', '크레스티드 게코', 'crested gecko'
WHERE NOT EXISTS (
    SELECT 1 FROM species_catalog WHERE scientific_name = 'Correlophus ciliatus'
);
