/*
  # Create employees table

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, unique)
      - `document` (text)
      - `position` (text)
      - `department` (text)
      - `phone` (text)
      - `address` (text)
      - `salary` (numeric, default 0)
      - `hire_date` (timestamptz)
      - `status` (text, check constraint for valid values)
      - `productivity` (numeric, default 0)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `employees` table
    - Add policies for authenticated users to manage their own employees
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  document text,
  position text,
  department text,
  phone text,
  address text,
  salary numeric DEFAULT 0,
  hire_date timestamptz,
  status text DEFAULT 'Ativo'::text CHECK (status = ANY (ARRAY['Ativo'::text, 'Inativo'::text, 'Férias'::text, 'Licença'::text])),
  productivity numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);
CREATE INDEX IF NOT EXISTS employees_email_idx ON employees(email);
CREATE INDEX IF NOT EXISTS employees_document_idx ON employees(document);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can create their own employees'
  ) THEN
    CREATE POLICY "Users can create their own employees"
      ON employees
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can view their own employees'
  ) THEN
    CREATE POLICY "Users can view their own employees"
      ON employees
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can update their own employees'
  ) THEN
    CREATE POLICY "Users can update their own employees"
      ON employees
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can delete their own employees'
  ) THEN
    CREATE POLICY "Users can delete their own employees"
      ON employees
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();