// Types para o banco de dados
export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  notes?: string
  is_company: boolean
  company_name?: string
  cnpj?: string
  order_count: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category: string
  base_price: number
  sale_price: number
  production_time_minutes: number
  is_customizable: boolean
  is_active: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  name: string
  description?: string
  category: string
  unit: string
  unit_cost: number
  quantity: number
  minimum_quantity: number
  supplier?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  client_id?: string
  client_name: string
  client_email: string
  status: string
  priority: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  payment_method?: string
  is_paid: boolean
  paid_at?: string
  delivery_address?: string
  tracking_code?: string
  shipped_at?: string
  delivered_at?: string
  due_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  description?: string
  quantity: number
  unit_price: number
  total_price: number
  produced_quantity: number
  customization?: Record<string, unknown>
  created_at: string
}

export interface Quote {
  id: string
  client_id?: string
  client_name: string
  client_email: string
  status: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  valid_until?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  product_id?: string
  product_name: string
  description?: string
  quantity: number
  unit_price: number
  total_price: number
  customization?: Record<string, unknown>
  created_at: string
}

export interface ProductionQueueItem {
  id: string
  order_id: string
  order_item_id: string
  order_number: string
  product_name: string
  quantity_total: number
  quantity_produced: number
  status: string
  block_reason?: string
  priority: number
  due_date?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface FinancialTransaction {
  id: string
  type: string
  category: string
  description: string
  amount: number
  order_id?: string
  date: string
  created_at: string
}
