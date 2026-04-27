'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  product_id: string
  nome: string
  descricao: string
  precoVenda: number
  quantity: number
  image?: string
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (product_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Carregar do localStorage na primeira renderização
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Salvar no localStorage quando items mudar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === item.product_id)
      if (existing) {
        return prev.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (product_id: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id))
  }

  const updateQuantity = (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(product_id)
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product_id === product_id ? { ...i, quantity } : i
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.precoVenda * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}
