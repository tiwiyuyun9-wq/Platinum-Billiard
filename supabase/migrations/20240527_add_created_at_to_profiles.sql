-- 1. Add the missing created_at column to the profiles table
-- This is required because the /admin/users page orders by this column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Automatically populate created_at for existing profiles if they are null
UPDATE public.profiles SET created_at = NOW() WHERE created_at IS NULL;

-- 2. Force a schema cache reload to ensure PostgREST registers the relationship and the new column
notify pgrst, 'reload schema';
