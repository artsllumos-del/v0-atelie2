'use client'

import { useState, useEffect } from 'react'
import type { Order } from '../types'
import * as orderApi from '@/lib/supabase/orders'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await orderApi.getOrders()
      setOrders(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos'
      setError(errorMessage)
      console.error('Erro ao carregar pedidos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newOrder = await orderApi.createOrder(order)
      if (newOrder) {
        setOrders([newOrder, ...orders])
        return newOrder
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido'
      setError(errorMessage)
      console.error('Erro ao criar pedido:', err)
    }
    return null
  }

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const updated = await orderApi.updateOrder(id, updates)
      if (updated) {
        setOrders(orders.map(o => (o.id === id ? updated : o)))
        return updated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pedido'
      setError(errorMessage)
      console.error('Erro ao atualizar pedido:', err)
    }
    return null
  }

  const updateStatus = async (id: string, status: string) => {
    return updateOrder(id, { status } as Partial<Order>)
  }

  const deleteOrder = async (id: string) => {
    try {
      const success = await orderApi.deleteOrder(id)
      if (success) {
        setOrders(orders.filter(o => o.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pedido'
      setError(errorMessage)
      console.error('Erro ao deletar pedido:', err)
    }
    return false
  }

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    updateStatus,
    deleteOrder,
    refetch: loadOrders,
  }
}
