-- Add columns for point generation rules to the settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS points_per_booking INT DEFAULT 0;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS points_per_order INT DEFAULT 0;

-- Optionally, notify PostgREST to reload the schema schema caches
notify pgrst, 'reload schema';
