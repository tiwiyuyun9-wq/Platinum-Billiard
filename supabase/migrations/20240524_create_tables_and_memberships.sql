create table if not exists public.tables (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    type text not null default 'biasa',
    status text not null default 'available',
    created_at timestamptz default now()
);

-- Seed some initial tables
insert into public.tables (name, type, status)
values
    ('Meja Rasson 01', 'rasson', 'available'),
    ('Meja Rasson 02', 'rasson', 'occupied'),
    ('Meja Rasson 03', 'rasson', 'booked'),
    ('Meja Rasson 04', 'rasson', 'available'),
    ('Meja Biasa 01', 'biasa', 'available'),
    ('Meja Biasa 02', 'biasa', 'available'),
    ('Meja Biasa 03', 'biasa', 'occupied'),
    ('Meja Biasa 04', 'biasa', 'available');

do $$
begin
    if not exists (select 1 from pg_type where typname = 'membership_tier') then
        create type membership_tier as enum ('silver', 'gold', 'platinum');
    end if;
end
$$;

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tier membership_tier not null,
  start_date date default current_date,
  end_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
