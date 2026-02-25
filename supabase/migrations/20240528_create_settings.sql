-- 1. Create a single-row settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id int PRIMARY KEY DEFAULT 1,
    qris_image_url text,
    updated_at timestamptz DEFAULT now()
);

-- 2. Ensure only row ID 1 can exist
ALTER TABLE public.settings ADD CONSTRAINT single_row CHECK (id = 1);

-- 3. Pre-populate the single row initially
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 4. Set up Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 5. Everyone can read settings (for frontend to display QRIS)
CREATE POLICY "Public can read settings"
  ON public.settings FOR SELECT
  USING (true);

-- 6. Admins only can update settings
CREATE POLICY "Admins can update settings"
  ON public.settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Reload schema caches
notify pgrst, 'reload schema';
