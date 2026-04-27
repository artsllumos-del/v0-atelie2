'use client'

import { useState, useEffect } from 'react'
import type { Quote } from '../types'
import * as quoteApi from '@/lib/supabase/quotes'

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadQuotes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await quoteApi.getQuotes()
      setQuotes(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar orçamentos'
      setError(errorMessage)
      console.error('Erro ao carregar orçamentos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuotes()
  }, [])

  const createQuote = async (quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newQuote = await quoteApi.createQuote(quote)
      if (newQuote) {
        setQuotes([newQuote, ...quotes])
        return newQuote
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar orçamento'
      setError(errorMessage)
      console.error('Erro ao criar orçamento:', err)
    }
    return null
  }

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    try {
      const updated = await quoteApi.updateQuote(id, updates)
      if (updated) {
        setQuotes(quotes.map(q => (q.id === id ? updated : q)))
        return updated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      console.error('Erro ao atualizar orçamento:', err)
    }
    return null
  }

  const updateStatus = async (id: string, status: string) => {
    return updateQuote(id, { status } as Partial<Quote>)
  }

  const deleteQuote = async (id: string) => {
    try {
      const success = await quoteApi.deleteQuote(id)
      if (success) {
        setQuotes(quotes.filter(q => q.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar orçamento'
      setError(errorMessage)
      console.error('Erro ao deletar orçamento:', err)
    }
    return false
  }

  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    updateStatus,
    deleteQuote,
    refetch: loadQuotes,
  }
}
