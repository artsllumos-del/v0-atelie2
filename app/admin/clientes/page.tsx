'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useClients } from '@/lib/hooks/useClients'
import type { Client } from '@/lib/types'

export default function ClientesPage() {
  const { clients, isLoading, deleteClient, refetch } = useClients()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      const success = await deleteClient(id)
      if (success) {
        toast.success('Cliente deletado com sucesso')
      } else {
        toast.error('Erro ao deletar cliente')
      }
    }
  }

  const totalClients = clients.length
  const totalSpent = clients.reduce((acc, c) => acc + c.total_spent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">em todas as compras</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Lista de todos os clientes cadastrados</CardDescription>
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
          ) : filteredClients.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhum cliente encontrado</div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="text-gray-600">{client.phone}</span>
                      <span className="text-gray-600">{client.order_count} pedidos</span>
                      <span className="text-gray-600">R$ {client.total_spent.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
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
