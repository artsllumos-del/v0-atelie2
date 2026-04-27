import { createClient } from './client'
import type { Client } from '../types'

export async function getClients(): Promise<Client[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar clientes:', err)
    return []
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar cliente:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao buscar cliente:', err)
    return null
  }
}

export async function createClientRecord(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar cliente:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao criar cliente:', err)
    return null
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar cliente:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err)
    return null
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar cliente:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Erro ao deletar cliente:', err)
    return false
  }
}
