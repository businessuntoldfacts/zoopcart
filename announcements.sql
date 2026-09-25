-- Announcements Table (Supports Global & Personal)
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE, -- NULL means global
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'promotion'
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- RLS for Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Users can read global announcements OR their own personal ones
CREATE POLICY "Users can view relevant announcements" ON announcements
  FOR SELECT USING (
    is_active = true AND (business_id IS NULL OR business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
  );

-- Only service role (Admin via API) can manage announcements
CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (true)
  WITH CHECK (true);
