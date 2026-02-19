-- Create Tables Enum
create type table_status as enum ('available', 'occupied', 'booked', 'maintenance');
create type table_type as enum ('rasson', 'standard');

-- Create Tables Table
create table if not exists tables (
  id text primary key, -- '1', '2', etc.
  name text not null,
  type table_type not null default 'standard',
  status table_status not null default 'available',
  current_booking_id uuid references bookings(id),
  position_x int default 0, -- X coordinate as percentage (0-100) or pixel
  position_y int default 0, -- Y coordinate as percentage (0-100) or pixel
  rotation int default 0,   -- Rotation in degrees
  created_at timestamptz default now()
);

-- Enable RLS
alter table tables enable row level security;

-- Policy: Public Read
create policy "Public Read Tables"
  on tables for select
  using ( true );

-- Policy: Admin Update (TODO: Restrict to admin role later)
create policy "Admin Update Tables"
  on tables for update
  using ( true )
  with check ( true );

-- Enable Realtime for tables
alter publication supabase_realtime add table tables;

-- Seed Initial Data
insert into tables (id, name, type, status, position_x, position_y, rotation) values
('1', 'Meja Rasson 01', 'rasson', 'available', 20, 20, 0),
('2', 'Meja Rasson 02', 'rasson', 'occupied', 50, 20, 0),
('3', 'Meja Rasson 03', 'rasson', 'booked', 80, 20, 0),
('4', 'Meja Rasson 04', 'rasson', 'available', 20, 50, 0),
('5', 'Meja Biasa 01', 'standard', 'available', 50, 50, 90),
('6', 'Meja Biasa 02', 'standard', 'available', 80, 50, 90),
('7', 'Meja Biasa 03', 'standard', 'occupied', 20, 80, 0),
('8', 'Meja Biasa 04', 'standard', 'maintenance', 50, 80, 0)
on conflict (id) do nothing;
