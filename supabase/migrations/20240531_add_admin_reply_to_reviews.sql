-- Add admin reply columns to reviews table
ALTER TABLE public.reviews
ADD COLUMN admin_reply text,
ADD COLUMN admin_reply_at timestamptz;
