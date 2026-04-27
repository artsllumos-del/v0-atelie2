import { NextRequest, NextResponse } from 'next/server'
import type { Pedido } from '@/lib/types'

let orders: Map<string, Pedido> = new Map()
let orderCounter = 1

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status')
  let data = Array.from(orders.values())
  
  if (status) {
    data = data.filter(o => o.status === status)
  }
  
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const numero = String(orderCounter++).padStart(5, '0')
    const id = `ped-${numero}`
    const pedido: Pedido = {
      id,
      numero,
      clienteId: body.clienteId,
      itens: body.itens || [],
      subtotal: parseFloat(body.subtotal) || 0,
      desconto: parseFloat(body.desconto) || 0,
      taxaEntrega: parseFloat(body.taxaEntrega) || 0,
      total: parseFloat(body.total) || 0,
      status: 'aguardando_pagamento',
      prioridade: body.prioridade || 'normal',
      pago: false,
      observacoes: body.observacoes,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
    
    orders.set(id, pedido)
    return NextResponse.json(pedido, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, ...updates } = body

    if (!id || !orders.has(id)) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const pedido = orders.get(id)!
    const updated: Pedido = {
      ...pedido,
      ...updates,
      status: status || pedido.status,
      atualizadoEm: new Date(),
    }

    orders.set(id, updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id || !orders.has(id)) {
    return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  }

  orders.delete(id)
  return NextResponse.json({ success: true })
}

