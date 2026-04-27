'use client'

import { useState, useEffect } from 'react'
import type { Client } from '../types'
import * as clientApi from '@/lib/supabase/clients'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadClients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await clientApi.getClients()
      setClients(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar clientes'
      setError(errorMessage)
      console.error('Erro ao carregar clientes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newClient = await clientApi.createClientRecord(client)
      if (newClient) {
        setClients([newClient, ...clients])
        return newClient
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente'
      setError(errorMessage)
      console.error('Erro ao criar cliente:', err)
    }
    return null
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updated = await clientApi.updateClient(id, updates)
      if (updated) {
        setClients(clients.map(c => (c.id === id ? updated : c)))
        return updated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente'
      setError(errorMessage)
      console.error('Erro ao atualizar cliente:', err)
    }
    return null
  }

  const deleteClient = async (id: string) => {
    try {
      const success = await clientApi.deleteClient(id)
      if (success) {
        setClients(clients.filter(c => c.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar cliente'
      setError(errorMessage)
      console.error('Erro ao deletar cliente:', err)
    }
    return false
  }

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: loadClients,
  }
}
