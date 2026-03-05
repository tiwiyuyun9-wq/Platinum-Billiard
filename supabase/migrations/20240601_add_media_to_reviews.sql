-- Add media arrays to user reviews
ALTER TABLE public.reviews
ADD COLUMN media_urls text[] DEFAULT ARRAY[]::text[];
