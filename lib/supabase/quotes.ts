import { createClient } from './client'
import type { Quote, QuoteItem } from '../types'

export async function getQuotes(): Promise<Quote[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar orçamentos:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar orçamentos:', err)
    return []
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar orçamento:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao buscar orçamento:', err)
    return null
  }
}

export async function createQuote(quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<Quote | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quotes')
      .insert([quote])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar orçamento:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao criar orçamento:', err)
    return null
  }
}

export async function updateQuote(id: string, updates: Partial<Quote>): Promise<Quote | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar orçamento:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar orçamento:', err)
    return null
  }
}

export async function deleteQuote(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar orçamento:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Erro ao deletar orçamento:', err)
    return false
  }
}

export async function getQuotesByStatus(status: string): Promise<Quote[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar orçamentos por status:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar orçamentos por status:', err)
    return []
  }
}

export async function getQuoteItems(quoteId: string): Promise<QuoteItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', quoteId)

    if (error) {
      console.error('Erro ao buscar itens do orçamento:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar itens do orçamento:', err)
    return []
  }
}

export async function updateQuoteStatus(id: string, status: string): Promise<Quote | null> {
  return updateQuote(id, { status, updated_at: new Date().toISOString() } as Partial<Quote>)
}
