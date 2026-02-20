-- Ensure valid data by clearing any mock string bookings ('1', '2', 'Meja Rasson')
-- This is necessary to safely cast the text column to a uuid column without syntax errors.
delete from public.bookings;

-- 1. Alter table_id type to UUID
alter table public.bookings
  alter column table_id type uuid using table_id::uuid;

-- 2. Add foreign key constraint to link bookings -> tables
alter table public.bookings
  add constraint bookings_table_id_fkey
  foreign key (table_id)
  references public.tables (id)
  on delete set null;

-- Reload PGRST Schema Cache to apply foreign key relation immediately
notify pgrst, 'reload schema';
