-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, service_role;

-- 1. Create Profiles Table (Publicly readable, User can update own)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  address text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  brand text not null check (brand in ('iPhone', 'Samsung')), 
  model text not null, -- e.g. iPhone 15, Galaxy S24
  base_price numeric not null,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Only admin can insert/update/delete products"
  on products for all
  using ( auth.uid() in (select id from auth.users where email = 'admin@neshtech.com') ); -- Placeholder for admin check


-- 3. Create Product Variants Table
create table product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  color_name text not null, -- 'Dark Mode', 'Light Mode', 'ZeroOne'
  sku text,
  stock_quantity integer default 0,
  price_modifier numeric default 0,
  
  unique(product_id, color_name)
);

alter table product_variants enable row level security;

create policy "Variants are viewable by everyone."
  on product_variants for select
  using ( true );

create policy "Only admin can manage variants"
  on product_variants for all
  using ( auth.uid() in (select id from auth.users where email = 'admin@neshtech.com') );


-- 4. Create Product Images Table
create table product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  display_order integer default 0,
  is_primary boolean default false
);

alter table product_images enable row level security;

create policy "Images are viewable by everyone."
  on product_images for select
  using ( true );

create policy "Only admin can manage images"
  on product_images for all
  using ( auth.uid() in (select id from auth.users where email = 'admin@neshtech.com') );


-- 5. Create Orders Table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, -- Nullable for guest checkout
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  total_amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = user_id );

create policy "Anyone can create an order."
  on orders for insert
  with check ( true );

create policy "Only admin can update orders."
  on orders for update
  using ( auth.uid() in (select id from auth.users where email = 'admin@neshtech.com') );


-- 6. Create Order Items Table
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_variant_id uuid references product_variants(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric not null
);

alter table order_items enable row level security;

create policy "Users can view their own order items."
  on order_items for select
  using ( exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() ) );

create policy "Anyone can create order items."
  on order_items for insert
  with check ( true );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SEED DATA
-- Insert iPhone 15 Pro Product
DO $$
DECLARE
  p_iphone_id uuid;
  p_samsung_id uuid;
BEGIN
  -- Create iPhone 15 Pro
  INSERT INTO products (name, description, brand, model, base_price, is_featured)
  VALUES ('Spigen ZeroOne Case', 'Teardown aesthetic case with Mil-grade protection.', 'iPhone', 'iPhone 15 Pro', 2500, true)
  RETURNING id INTO p_iphone_id;

  INSERT INTO product_variants (product_id, color_name, sku, stock_quantity)
  VALUES 
    (p_iphone_id, 'Dark Mode', 'SP-I15P-ZO-DM', 50),
    (p_iphone_id, 'Light Mode', 'SP-I15P-ZO-LM', 30);

  -- Create Samsung S24 Ultra
  INSERT INTO products (name, description, brand, model, base_price, is_featured)
  VALUES ('Spigen ZeroOne Case', 'Teardown aesthetic case for Galaxy S24 Ultra.', 'Samsung', 'Galaxy S24 Ultra', 2600, true)
  RETURNING id INTO p_samsung_id;

  INSERT INTO product_variants (product_id, color_name, sku, stock_quantity)
  VALUES 
    (p_samsung_id, 'Dark Mode', 'SP-S24U-ZO-DM', 40);

END $$;
