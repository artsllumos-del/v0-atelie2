import { createClient } from './client'
import type { FinancialTransaction, ProductionQueueItem } from '../types'

export async function getFinancialTransactions(): Promise<FinancialTransaction[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Erro ao buscar transações:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar transações:', err)
    return []
  }
}

export async function createFinancialTransaction(transaction: Omit<FinancialTransaction, 'id' | 'created_at'>): Promise<FinancialTransaction | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar transação:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao criar transação:', err)
    return null
  }
}

export async function updateFinancialTransaction(id: string, updates: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar transação:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar transação:', err)
    return null
  }
}

export async function deleteFinancialTransaction(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar transação:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Erro ao deletar transação:', err)
    return false
  }
}

export async function getFinancialSummary() {
  try {
    const supabase = createClient()
    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select('*')

    if (error) {
      console.error('Erro ao buscar resumo financeiro:', error)
      return { receitas: 0, despesas: 0, lucro: 0 }
    }

    if (!transactions) return { receitas: 0, despesas: 0, lucro: 0 }

    const receitas = transactions
      .filter((t: any) => t.type === 'receita')
      .reduce((acc: number, t: any) => acc + (t.amount || 0), 0)

    const despesas = transactions
      .filter((t: any) => t.type === 'despesa')
      .reduce((acc: number, t: any) => acc + (t.amount || 0), 0)

    return { receitas, despesas, lucro: receitas - despesas }
  } catch (err) {
    console.error('Erro ao buscar resumo financeiro:', err)
    return { receitas: 0, despesas: 0, lucro: 0 }
  }
}

// Production Queue functions
export async function getProductionQueue(): Promise<ProductionQueueItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('production_queue')
      .select('*')
      .order('priority', { ascending: true })
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Erro ao buscar fila de produção:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Erro ao buscar fila de produção:', err)
    return []
  }
}

export async function updateProductionStatus(id: string, status: string, quantityProduced?: number): Promise<ProductionQueueItem | null> {
  try {
    const supabase = createClient()
    const updates: Partial<ProductionQueueItem> = { status, updated_at: new Date().toISOString() } as Partial<ProductionQueueItem>
    if (quantityProduced !== undefined) {
      updates.quantity_produced = quantityProduced
    }
    if (status === 'concluido') {
      updates.completed_at = new Date().toISOString()
    }
    if (status === 'em_andamento') {
      updates.started_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('production_queue')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar status de produção:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao atualizar status de produção:', err)
    return null
  }
}

export async function blockProductionItem(id: string, reason: string): Promise<ProductionQueueItem | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('production_queue')
      .update({ status: 'bloqueado', block_reason: reason })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao bloquear item:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Erro ao bloquear item:', err)
    return null
  }
}
