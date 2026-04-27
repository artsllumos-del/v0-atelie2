'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Loader2, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useQuotes } from '@/lib/hooks/useQuotes'

export default function OrcamentosPage() {
  const { quotes, isLoading, updateStatus, deleteQuote } = useQuotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredQuotes = quotes.filter((q) => {
    const matchSearch =
      q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.client_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || q.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
      const success = await deleteQuote(id)
      if (success) {
        toast.success('Orçamento deletado com sucesso')
      } else {
        toast.error('Erro ao deletar orçamento')
      }
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateStatus(id, status)
    if (result) {
      toast.success('Status atualizado com sucesso')
    } else {
      toast.error('Erro ao atualizar status')
    }
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    rascunho: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
    enviado: { label: 'Enviado', color: 'bg-blue-100 text-blue-800' },
    aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
    recusado: { label: 'Recusado', color: 'bg-red-100 text-red-800' },
    expirado: { label: 'Expirado', color: 'bg-yellow-100 text-yellow-800' },
  }

  const totalQuotes = quotes.length
  const approvedQuotes = quotes.filter((q) => q.status === 'aprovado').length
  const sentQuotes = quotes.filter((q) => q.status === 'enviado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus orçamentos</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuotes}</div>
            <p className="text-xs text-muted-foreground">criados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{sentQuotes}</div>
            <p className="text-xs text-muted-foreground">para análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedQuotes}</div>
            <p className="text-xs text-muted-foreground">confirmados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Orçamentos</CardTitle>
              <CardDescription>Lista de todos os orçamentos</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="recusado">Recusado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhum orçamento encontrado</div>
          ) : (
            <div className="space-y-2">
              {filteredQuotes.map((quote) => {
                const statusInfo = statusConfig[quote.status as keyof typeof statusConfig]
                return (
                  <div
                    key={quote.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{quote.client_name}</h3>
                      <p className="text-sm text-muted-foreground">{quote.client_email}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className={`rounded px-2 py-1 ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                        <span className="text-gray-600">R$ {quote.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Select value={quote.status} onValueChange={(s) => handleStatusChange(quote.id, s)}>
                        <SelectTrigger className="h-9 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="recusado">Recusado</SelectItem>
                          <SelectItem value="expirado">Expirado</SelectItem>
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9 px-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(quote.id)}
                        className="h-9 w-9 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
