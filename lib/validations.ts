import { z } from 'zod'

// Schemas de validação para todas as APIs
export const validationSchemas = {
  // Cart & Produtos
  cartItem: z.object({
    product_id: z.string().uuid('ID do produto inválido'),
    quantity: z.number().int().min(1, 'Quantidade mínima: 1').max(99, 'Quantidade máxima: 99'),
  }),

  // Pedidos
  order: z.object({
    customer_email: z.string().email('Email inválido'),
    customer_name: z.string().min(3, 'Nome muito curto'),
    customer_phone: z.string().min(10, 'Telefone inválido'),
    items: z.array(z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().min(1),
    })).min(1, 'Pelo menos 1 item'),
    shipping_address: z.object({
      street: z.string().min(5),
      number: z.string(),
      complement: z.string().optional(),
      city: z.string().min(3),
      state: z.string().length(2),
      zip: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    }),
    shipping_method: z.enum(['normal', 'express', 'sedex']),
    payment_method: z.enum(['pix', 'cartao', 'boleto']),
  }),

  // Produtos (Admin)
  product: z.object({
    nome: z.string().min(3, 'Nome muito curto').max(100),
    descricao: z.string().min(10).max(500),
    basePrice: z.number().positive('Preço deve ser positivo'),
    precoVenda: z.number().positive(),
    tempoProdWin: z.number().int().positive(),
    customizavel: z.boolean().optional(),
    ativo: z.boolean().default(true),
  }),

  // Clientes (Admin)
  client: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
    empresa: z.boolean().optional(),
    nomeEmpresa: z.string().optional(),
    cnpj: z.string().optional(),
  }),

  // Orçamentos
  quote: z.object({
    client_id: z.string().uuid(),
    items: z.array(z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().min(1),
      unit_price: z.number().positive(),
    })),
    notes: z.string().optional(),
    expires_at: z.string().datetime().optional(),
  }),

  // Financeiro
  transaction: z.object({
    type: z.enum(['income', 'expense']),
    category: z.string().min(3),
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.string().datetime(),
    order_id: z.string().uuid().optional(),
  }),
}

// Helper para validar e retornar erro ou dados
export async function validateRequest<T>(schema: z.ZodSchema, data: unknown): Promise<{ success: false; error: string } | { success: true; data: T }> {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated as T }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || 'Erro de validação'
      return { success: false, error: message }
    }
    return { success: false, error: 'Erro desconhecido' }
  }
}
