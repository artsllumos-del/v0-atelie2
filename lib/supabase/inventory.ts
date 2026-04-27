import { createClient } from './client'
import type { InventoryItem } from '../types'

export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar estoque:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar estoque:', err)
    return []
  }
}

export async function getInventoryById(id: string): Promise<InventoryItem | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar item de estoque:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao buscar item de estoque:', err)
    return null
  }
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .lte('quantity', 'minimum_quantity')
      .order('quantity', { ascending: true })

    if (error) {
      console.error('Erro ao buscar estoque baixo:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar estoque baixo:', err)
    return []
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar item de estoque:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao criar item de estoque:', err)
    return null
  }
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar item de estoque:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar item de estoque:', err)
    return null
  }
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar item de estoque:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Erro ao deletar item de estoque:', err)
    return false
  }
}

export async function updateInventoryQuantity(id: string, newQuantity: number): Promise<InventoryItem | null> {
  return updateInventoryItem(id, { quantity: newQuantity, updated_at: new Date().toISOString() } as Partial<InventoryItem>)
}
