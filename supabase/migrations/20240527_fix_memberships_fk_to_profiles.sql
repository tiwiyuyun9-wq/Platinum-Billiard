-- 1. Identify and automatically create missing profiles for any orphaned memberships
-- Postgres must have a matching Profile ID for every Membership ID before attaching a Foreign Key
INSERT INTO public.profiles (id, full_name, role)
SELECT DISTINCT m.user_id, 'Orphaned User ' || left(m.user_id::text, 8), 'user'
FROM public.memberships m
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = m.user_id
)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop the existing foreign key constraint that references auth.users
ALTER TABLE public.memberships DROP CONSTRAINT IF EXISTS memberships_user_id_fkey;

-- 3. Add a new foreign key constraint that references public.profiles(id)
ALTER TABLE public.memberships 
ADD CONSTRAINT memberships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Ensure Admins can read memberships
CREATE POLICY "Admins can view all memberships"
  ON public.memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Reload schema caches
notify pgrst, 'reload schema';
