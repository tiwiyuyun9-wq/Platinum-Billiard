-- Add 'standard' to membership_tier enum if it doesn't exist
-- Note: PostgreSQL doesn't support IF NOT EXISTS for ALTER TYPE ADD VALUE directly in a simple way without a block, 
-- but we can just run it. If it exists, it will error, which is fine for idempotent migrations if handled, 
-- but better to wrap in a block.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid WHERE typname = 'membership_tier' AND enumlabel = 'standard') THEN
        ALTER TYPE membership_tier ADD VALUE 'standard';
    END IF;
END$$;
