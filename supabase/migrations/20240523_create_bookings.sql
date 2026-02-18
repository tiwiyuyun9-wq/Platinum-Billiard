-- Create Booking Status Enum (if it doesn't match the previous attempt, otherwise skipping if already created)
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending_payment', 'waiting_confirmation', 'confirmed', 'completed', 'cancelled', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Bookings Table (Simplified end_time)
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  table_id text not null,
  start_time timestamptz not null,
  duration_hours int not null,
  end_time timestamptz not null, -- Removed 'generated always as' to avoid immutable error
  total_price numeric not null,
  status booking_status default 'pending_payment',
  created_at timestamptz default now()
);

-- Enable RLS
alter table bookings enable row level security;

-- Policies
create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on bookings for insert
  with check (auth.uid() = user_id);
