import { NextRequest, NextResponse } from 'next/server'
import type { Transacao } from '@/lib/types'

let transactions: Map<string, Transacao> = new Map()
let transactionCounter = 1

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo')
  const categoria = req.nextUrl.searchParams.get('categoria')
  const summary = req.nextUrl.searchParams.get('summary')

  let data = Array.from(transactions.values())
  
  if (tipo) {
    data = data.filter(t => t.tipo === tipo)
  }
  
  if (categoria) {
    data = data.filter(t => t.categoria === categoria)
  }

  if (summary === 'true') {
    const receitas = data.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0)
    const despesas = data.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0)
    return NextResponse.json({
      receitas,
      despesas,
      lucro: receitas - despesas,
      transacoes: data.length,
    })
  }
  
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const id = `fin-${String(transactionCounter++).padStart(5, '0')}`
    const transacao: Transacao = {
      id,
      tipo: body.tipo,
      categoria: body.categoria,
      descricao: body.descricao,
      valor: parseFloat(body.valor),
      pedidoId: body.pedidoId,
      data: new Date(body.data || new Date()),
      criadoEm: new Date(),
    }
    
    transactions.set(id, transacao)
    return NextResponse.json(transacao, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id || !transactions.has(id)) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
    }

    const transacao = transactions.get(id)!
    const updated: Transacao = {
      ...transacao,
      ...updates,
    }

    transactions.set(id, updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar transação' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id || !transactions.has(id)) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  }

  transactions.delete(id)
  return NextResponse.json({ success: true })
}
