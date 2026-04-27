import { NextRequest, NextResponse } from 'next/server'
import type { ItemProducao } from '@/lib/types'

let productionItems: Map<string, ItemProducao> = new Map()

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status')
  let data = Array.from(productionItems.values())
  
  if (status) {
    data = data.filter(item => item.status === status)
  }
  
  data.sort((a, b) => b.prioridade - a.prioridade)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const id = `prod-${Date.now()}`
    const item: ItemProducao = {
      pedidoId: body.pedidoId,
      itemIndex: body.itemIndex,
      quantidadeTotal: parseInt(body.quantidadeTotal),
      quantidadeProduzida: 0,
      status: 'pendente',
      prioridade: body.prioridade || 1,
      prazo: body.prazo ? new Date(body.prazo) : undefined,
    }
    
    productionItems.set(id, item)
    return NextResponse.json({ id, ...item }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar item de produção' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, quantidadeProduzida, motivoBloqueio } = body

    if (!id || !productionItems.has(id)) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    const item = productionItems.get(id)!
    const updated: ItemProducao = {
      ...item,
      status: status || item.status,
      quantidadeProduzida: quantidadeProduzida !== undefined ? quantidadeProduzida : item.quantidadeProduzida,
      motivoBloqueio,
    }

    productionItems.set(id, updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id || !productionItems.has(id)) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
  }

  productionItems.delete(id)
  return NextResponse.json({ success: true })
}
