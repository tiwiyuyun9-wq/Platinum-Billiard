-- Enable RLS on the tables collection
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tables (needed for customers to see what's available)
CREATE POLICY "Allow public read access to tables" ON public.tables
  FOR SELECT
  USING (true);

-- Allow authenticated users (Admins) full CRUD access to tables
CREATE POLICY "Allow authenticated users full access to tables" ON public.tables
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reload schema cache ensuring policies are registered
notify pgrst, 'reload schema';
