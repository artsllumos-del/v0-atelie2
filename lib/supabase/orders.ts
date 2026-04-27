import { createClient } from './client'
import type { Order, OrderItem } from '../types'

export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar pedidos:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar pedido:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao buscar pedido:', err)
    return null
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar pedido:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao criar pedido:', err)
    return null
  }
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar pedido:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err)
    return null
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar pedido:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Erro ao deletar pedido:', err)
    return false
  }
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (error) {
      console.error('Erro ao buscar itens do pedido:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar itens do pedido:', err)
    return []
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  return updateOrder(id, { status, updated_at: new Date().toISOString() } as Partial<Order>)
}

export async function getOrdersByStatus(status: string): Promise<Order[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar pedidos por status:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar pedidos por status:', err)
    return []
  }
}
