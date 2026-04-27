'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useProducts } from '@/lib/hooks/useProducts'
import type { Product } from '@/lib/types'

export default function ProdutosPage() {
  const { products, isLoading, deleteProduct, refetch } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [showForm, setShowForm] = useState(false)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      const success = await deleteProduct(id)
      if (success) {
        toast.success('Produto deletado com sucesso')
      } else {
        toast.error('Erro ao deletar produto')
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData(product)
    setShowForm(true)
  }

  const handleNewProduct = () => {
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      category: 'terco',
      base_price: 0,
      sale_price: 0,
      production_time_minutes: 60,
      is_customizable: true,
      is_active: true,
    })
    setShowForm(true)
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.is_active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu catálogo de terços</p>
        </div>
        <Button onClick={handleNewProduct} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>Lista de todos os produtos cadastrados</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhum produto encontrado</div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="text-gray-600">R$ {product.sale_price.toFixed(2)}</span>
                      {!product.is_active && <span className="rounded bg-red-100 px-2 py-1 text-red-800">Inativo</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="h-9 w-9 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
