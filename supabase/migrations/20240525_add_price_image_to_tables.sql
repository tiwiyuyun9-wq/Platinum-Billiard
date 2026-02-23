-- Add price and image_url columns to the tables schema
ALTER TABLE public.tables
ADD COLUMN IF NOT EXISTS price integer DEFAULT 35000,
ADD COLUMN IF NOT EXISTS image_url text;

-- Add comment to explain columns
COMMENT ON COLUMN public.tables.price IS 'Harga per jam sewa meja (IDR)';
COMMENT ON COLUMN public.tables.image_url IS 'URL gambar (bisa dari Supabase Storage)';
