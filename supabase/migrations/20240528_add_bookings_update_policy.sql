-- Add UPDATE policy for bookings
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Also ensure admins have full access to bookings
CREATE POLICY "Admins have full access to bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
