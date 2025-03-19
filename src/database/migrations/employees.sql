-- Create employees table
create table if not exists employees (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  email varchar(255),
  document varchar(14) not null unique,
  position varchar(100) not null,
  department varchar(100) not null,
  phone varchar(20),
  address text,
  salary numeric(10,2),
  hire_date date not null,
  status varchar(20) not null default 'Ativo',
  productivity numeric(5,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade
);

-- Create indexes for common queries
create index if not exists employees_user_id_idx on employees(user_id);
create index if not exists employees_document_idx on employees(document);
create index if not exists employees_name_idx on employees(name);
create index if not exists employees_department_idx on employees(department);
create index if not exists employees_status_idx on employees(status);

-- Add status constraint
alter table employees add constraint employees_status_check 
  check (status in ('Ativo', 'Inativo', 'Férias', 'Licença'));

-- Create trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger employees_updated_at
  before update on employees
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table employees enable row level security;

-- Create policy for authenticated users
create policy "Enable all actions for authenticated users" on employees
  for all
  to authenticated
  using (true)
  with check (true);
