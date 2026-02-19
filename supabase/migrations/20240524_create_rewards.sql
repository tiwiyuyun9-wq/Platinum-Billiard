-- Create User Points Table (Current Balance)
create table if not exists user_points (
  user_id uuid references auth.users primary key,
  current_points int default 0,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table user_points enable row level security;

-- Policy: Users can view their own points
create policy "Users can view own points"
  on user_points for select
  using ( auth.uid() = user_id );

-- Create Point History Table (Transactions)
create table if not exists point_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  amount int not null, -- positive for earn, negative for spend
  description text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table point_history enable row level security;

-- Policy: Users can view their own history
create policy "Users can view own point history"
  on point_history for select
  using ( auth.uid() = user_id );

-- Function to update current_points on insert to history
create or replace function update_user_points()
returns trigger as $$
begin
  insert into user_points (user_id, current_points)
  values (new.user_id, new.amount)
  on conflict (user_id) do update
  set current_points = user_points.current_points + new.amount,
      updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update balance
drop trigger if exists on_point_history_insert on point_history;
create trigger on_point_history_insert
  after insert on point_history
  for each row execute function update_user_points();
