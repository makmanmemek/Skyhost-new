create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  plan text not null check (plan in ('Starter','Business','Pro')),
  amount integer not null check (amount > 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  service_status text not null default 'pending' check (service_status in ('pending','active','suspended')),
  payment_token text,
  payment_url text,
  midtrans_transaction_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

create policy "profile owner reads own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "customer reads own orders"
  on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "admin reads all orders"
  on public.orders for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "customer creates own orders"
  on public.orders for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "admin updates orders"
  on public.orders for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant usage on schema public to authenticated, service_role;
grant select, insert, update on public.orders to authenticated;
grant select on public.profiles to authenticated;
grant all on public.profiles, public.orders to service_role;

-- Setelah membuat akun admin di Supabase Authentication, jalankan:
-- update public.profiles set role = 'admin' where email = 'EMAIL_ADMIN_KAMU';
