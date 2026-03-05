-- Create new enum for membership status
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'rejected', 'expired');

-- Alter the memberships table
ALTER TABLE memberships
ADD COLUMN status membership_status DEFAULT 'pending',
ADD COLUMN payment_proof_url text;

-- Since end_date is currently NOT NULL, and new pending requests might not have an end_date yet until verified,
-- we should make it nullable. We can calculate it upon approval.
ALTER TABLE memberships ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE memberships ALTER COLUMN start_date DROP DEFAULT;

-- Update existing records to 'active' status if they were active
UPDATE memberships
SET status = 'active'
WHERE is_active = true;

-- We can drop the is_active column eventually or use the view, but let's keep it for backwards compatibility for now.
-- Or better, we can sync `is_active` to `status = 'active'`.

-- Update policies 
-- We allow users to insert their own pending memberships
CREATE POLICY "Users can insert own pending memberships"
  ON memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Users can update their own pending memberships to add proof if needed
CREATE POLICY "Users can update own pending memberships"
  ON memberships FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admin policies (assuming admin role or bypassing via service_role)
-- For now, if admin relies on RLS, we can add it, but server actions bypass RLS anyway.
