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
 payment_token text,payment_url text,midtrans_transaction_id text,
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
create policy "profile owner reads own" on public.profiles for select using (auth.uid()=id);
create policy "customer reads own orders" on public.orders for select using (auth.uid()=user_id);
create policy "admin reads all orders" on public.orders for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email) values(new.id,new.email); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
-- Setelah akun admin dibuat di Authentication, jalankan:
-- update public.profiles set role='admin' where email='EMAIL_ADMIN_KAMU';
