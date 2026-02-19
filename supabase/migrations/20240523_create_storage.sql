-- 1. Create the 'web-assets' bucket (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('web-assets', 'web-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Read Access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'web-assets' );

-- 3. Allow Authenticated Users to Upload (For Admin/Staff uploading images)
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'web-assets' AND auth.role() = 'authenticated' );
