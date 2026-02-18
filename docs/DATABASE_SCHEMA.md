# Database Schema Design

## ER Diagram (Text Representation)

### `profiles` (Public Profile linked to Auth)
- `id` (uuid, pk, fk: auth.users)
- `full_name` (text)
- `role` (enum: 'member', 'staff', 'owner')
- `loyalty_points` (int)
- `tier` (enum: 'bronze', 'silver', 'gold')
- `avatar_url` (text)

### `tables` (Billiard Tables)
- `id` (uuid, pk)
- `name` (text) - e.g., "Meja 01 (VVIP)"
- `status` (enum: 'available', 'occupied', 'reserved', 'maintenance')
- `price_per_hour` (numeric)
- `metadata` (jsonb) - e.g., { "brand": "Gabriels", "size": "9ft" }

### `bookings` (Transactions)
- `id` (uuid, pk)
- `user_id` (uuid, fk: profiles)
- `table_id` (uuid, fk: tables)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `total_price` (numeric)
- `status` (enum: 'pending', 'waiting_confirmation', 'confirmed', 'cancelled', 'completed')
- `payment_proof_url` (text)
- `created_at` (timestamptz)

### `audit_logs` (Security & Tracking)
- `id` (uuid, pk)
- `actor_id` (uuid, fk: auth.users)
- `action` (text) - e.g., "approve_booking", "change_table_status"
- `target_id` (uuid)
- `timestamp` (timestamptz)
### `memberships` (Loyalty System)
- `id` (uuid, pk)
- `user_id` (uuid, fk: auth.users)
- `tier` (enum: 'silver', 'gold', 'platinum')
- `start_date` (date)
- `end_date` (date)
- `is_active` (boolean)

```sql
-- Run this in Supabase SQL Editor
create type membership_tier as enum ('silver', 'gold', 'platinum');

create table memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  tier membership_tier not null,
  start_date date default current_date,
  end_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table memberships enable row level security;
create policy "Users can view own membership" on memberships for select using (auth.uid() = user_id);
```

### `bookings` (Reservation System)
- `id` (uuid, pk)
- `user_id` (uuid, fk: auth.users)
- `table_id` (text)
- `start_time` (timestamptz)
- `duration_hours` (int)
- `total_price` (numeric)
- `status` (enum: pending_payment, waiting_confirmation, confirmed, ...)

```sql
-- Run this in Supabase SQL Editor
create type booking_status as enum ('pending_payment', 'waiting_confirmation', 'confirmed', 'completed', 'cancelled', 'rejected');

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  table_id text not null,
  start_time timestamptz not null,
  duration_hours int not null,
  end_time timestamptz not null,
  total_price numeric not null,
  status booking_status default 'pending_payment',
  created_at timestamptz default now()
);
alter table bookings enable row level security;
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
```
