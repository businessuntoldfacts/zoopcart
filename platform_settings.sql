-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO SUPPORT LIVE SETTINGS AND COMMISSION CONTROL
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_fee NUMERIC DEFAULT 2,
    fixed_fee NUMERIC DEFAULT 0,
    global_banner TEXT,
    enable_banner BOOLEAN DEFAULT false,
    sender_email TEXT DEFAULT 'hello@zoopcart.com',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of settings" ON platform_settings;
CREATE POLICY "Allow public read of settings" ON platform_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all on settings" ON platform_settings;
CREATE POLICY "Allow admin all on settings" ON platform_settings FOR ALL USING (true);

-- Insert a default row if none exists
INSERT INTO platform_settings (platform_fee, fixed_fee, sender_email, enable_banner)
SELECT 2, 0, 'hello@zoopcart.com', false
WHERE NOT EXISTS (SELECT 1 FROM platform_settings);
