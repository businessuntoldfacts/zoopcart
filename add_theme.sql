-- Adding theme to businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'light';
