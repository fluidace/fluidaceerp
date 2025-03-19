-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state CHAR(2),
    postal_code VARCHAR(10),
    type VARCHAR(10) CHECK (type IN ('Física', 'Jurídica')),
    status VARCHAR(10) CHECK (status IN ('Ativo', 'Inativo', 'VIP')) DEFAULT 'Ativo',
    notes TEXT,
    total_purchases DECIMAL(10,2) DEFAULT 0,
    last_purchase TIMESTAMP WITH TIME ZONE,
    has_pending_payments BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL
);

-- Create indexes for common searches
CREATE INDEX idx_customers_document ON customers(document);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_customers_city ON customers(city);
CREATE INDEX idx_customers_total_purchases ON customers(total_purchases);
CREATE INDEX idx_customers_last_purchase ON customers(last_purchase);
CREATE INDEX idx_customers_user_id ON customers(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update total_purchases and last_purchase
CREATE OR REPLACE FUNCTION update_customer_purchase_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer's total purchases and last purchase date
    UPDATE customers
    SET total_purchases = (
        SELECT COALESCE(SUM(total), 0)
        FROM sales
        WHERE customer_id = NEW.customer_id
    ),
    last_purchase = NEW.date
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update customer stats after sale
CREATE TRIGGER update_customer_stats_after_sale
    AFTER INSERT OR UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_purchase_stats();

-- Add foreign key constraint to sales table
ALTER TABLE sales
ADD CONSTRAINT fk_sales_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE RESTRICT; -- Prevent deletion of customers with associated sales

-- Create index for the foreign key
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
