'use client'

import { useState, useEffect } from 'react'
import type { Product } from '../types'
import * as productApi from '@/lib/supabase/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productApi.getProducts()
      setProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos'
      setError(errorMessage)
      console.error('Erro ao carregar produtos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct = await productApi.createProduct(product)
      if (newProduct) {
        setProducts([newProduct, ...products])
        return newProduct
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto'
      setError(errorMessage)
      console.error('Erro ao criar produto:', err)
    }
    return null
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await productApi.updateProduct(id, updates)
      if (updated) {
        setProducts(products.map(p => (p.id === id ? updated : p)))
        return updated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto'
      setError(errorMessage)
      console.error('Erro ao atualizar produto:', err)
    }
    return null
  }

  const deleteProduct = async (id: string) => {
    try {
      const success = await productApi.deleteProduct(id)
      if (success) {
        setProducts(products.filter(p => p.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto'
      setError(errorMessage)
      console.error('Erro ao deletar produto:', err)
    }
    return false
  }

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: loadProducts,
  }
}
