-- ============================================
-- SCHEMA COMPLETO ATELIÊ SAGRADO
-- ============================================

-- Limpar tabelas existentes (se necessário)
DROP TABLE IF EXISTS quote_items CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS production_queue CASCADE;
DROP TABLE IF EXISTS financial_transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- ============================================
-- TABELA: clients
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  is_company BOOLEAN DEFAULT FALSE,
  company_name TEXT,
  cnpj TEXT,
  order_count INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: products
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'terco',
  base_price NUMERIC(10,2) DEFAULT 0,
  sale_price NUMERIC(10,2) DEFAULT 0,
  production_time_minutes INTEGER DEFAULT 60,
  is_customizable BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: inventory (materiais/estoque)
-- ============================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'outros',
  unit TEXT DEFAULT 'unidade',
  unit_cost NUMERIC(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 10,
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: orders (pedidos)
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT,
  client_email TEXT,
  status TEXT DEFAULT 'aguardando_pagamento',
  priority TEXT DEFAULT 'normal',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  delivery_address TEXT,
  tracking_code TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: order_items
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) DEFAULT 0,
  produced_quantity INTEGER DEFAULT 0,
  customization JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: quotes (orçamentos)
-- ============================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT,
  client_email TEXT,
  status TEXT DEFAULT 'rascunho',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: quote_items
-- ============================================
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) DEFAULT 0,
  customization JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: production_queue (fila de produção)
-- ============================================
CREATE TABLE production_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  order_number TEXT,
  product_name TEXT,
  quantity_total INTEGER DEFAULT 1,
  quantity_produced INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  block_reason TEXT,
  priority INTEGER DEFAULT 5,
  due_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: financial_transactions
-- ============================================
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'receita' ou 'despesa'
  category TEXT DEFAULT 'outros',
  description TEXT NOT NULL,
  amount NUMERIC(10,2) DEFAULT 0,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNÇÃO: gerar número do pedido
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'PED-\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM orders
  WHERE order_number LIKE 'PED-' || year_prefix || '-%';
  
  NEW.order_number := 'PED-' || year_prefix || '-' || LPAD(next_number::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- FUNÇÃO: atualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_updated_at BEFORE UPDATE ON production_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HABILITAR RLS (Row Level Security) - desabilitado para admin
-- ============================================
-- Como este é um sistema admin, não aplicamos RLS restritivo
-- As tabelas estão acessíveis pelo service role
