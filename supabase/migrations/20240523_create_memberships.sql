-- Create Membership Tier Enum
create type membership_tier as enum ('silver', 'gold', 'platinum');

-- Create Memberships Table
create table memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  tier membership_tier not null,
  start_date date default current_date,
  end_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table memberships enable row level security;

-- Policy: Users can view their own membership
create policy "Users can view own membership"
  on memberships for select
  using (auth.uid() = user_id);

-- Policy: Only admins/service_role can insert/update (for now)
-- (We'll rely on service_role for backend logic or manual insertion)
