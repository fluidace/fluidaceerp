-- Create products table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sku text unique not null,
  category text not null,
  description text,
  quantity integer not null default 0,
  min_quantity integer not null default 0,
  price decimal(10,2) not null default 0,
  status text not null default 'normal',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade
);

-- Create indexes
create index products_user_id_idx on public.products(user_id);
create index products_name_idx on public.products(name);
create index products_sku_idx on public.products(sku);
create index products_category_idx on public.products(category);
create index products_status_idx on public.status(status);

-- Create updated_at trigger
create trigger update_products_updated_at 
  before update on public.products 
  for each row 
  execute function update_updated_at_column();

-- RLS Policies
alter table public.products enable row level security;

create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);
