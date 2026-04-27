import { createClient } from './client'
import type { Product } from '../types'

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar produtos:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Erro ao buscar produtos:', err)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar produto:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('Erro ao buscar produto:', err)
    return null
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar produto:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('Erro ao criar produto:', err)
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar produto:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar produto:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('Erro ao deletar produto:', err)
    return false
  }
}
