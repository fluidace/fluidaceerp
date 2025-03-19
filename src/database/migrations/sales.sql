-- Criar tabela de vendas (sales)
create table public.sales (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.clients(id) on delete restrict,
    seller_id uuid references public.employees(id) on delete restrict,
    total decimal(10,2) not null default 0,
    discount decimal(10,2) not null default 0,
    payment_method varchar(50) not null,
    payment_terms varchar(100),
    status varchar(20) not null check (status in ('Pendente', 'Em andamento', 'Concluída', 'Cancelada')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Criar tabela de itens da venda (sale_items)
create table public.sale_items (
    id uuid default gen_random_uuid() primary key,
    sale_id uuid references public.sales(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete restrict not null,
    quantity integer not null check (quantity > 0),
    unit_price decimal(10,2) not null check (unit_price >= 0),
    subtotal decimal(10,2) not null check (subtotal >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices para melhor performance
create index sales_client_id_idx on public.sales(client_id);
create index sales_seller_id_idx on public.sales(seller_id);
create index sales_status_idx on public.sales(status);
create index sales_created_at_idx on public.sales(created_at);
create index sales_user_id_idx on public.sales(user_id);
create index sale_items_sale_id_idx on public.sale_items(sale_id);
create index sale_items_product_id_idx on public.sale_items(product_id);

-- Trigger para atualizar o updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Aplicar trigger nas tabelas
create trigger update_sales_updated_at
    before update on public.sales
    for each row
    execute function public.update_updated_at_column();

create trigger update_sale_items_updated_at
    before update on public.sale_items
    for each row
    execute function public.update_updated_at_column();

-- Criar RLS (Row Level Security)
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

-- Políticas de segurança para vendas
create policy "Users can view their own sales"
    on public.sales for select
    using (auth.uid() = user_id);

create policy "Users can insert their own sales"
    on public.sales for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own sales"
    on public.sales for update
    using (auth.uid() = user_id);

-- Políticas de segurança para itens de venda
create policy "Users can view their sale items"
    on public.sale_items for select
    using (
        exists (
            select 1 from public.sales
            where sales.id = sale_items.sale_id
            and sales.user_id = auth.uid()
        )
    );

create policy "Users can insert their sale items"
    on public.sale_items for insert
    with check (
        exists (
            select 1 from public.sales
            where sales.id = sale_items.sale_id
            and sales.user_id = auth.uid()
        )
    );

create policy "Users can update their sale items"
    on public.sale_items for update
    using (
        exists (
            select 1 from public.sales
            where sales.id = sale_items.sale_id
            and sales.user_id = auth.uid()
        )
    );
