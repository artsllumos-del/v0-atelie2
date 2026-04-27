import { NextRequest, NextResponse } from 'next/server'
import type { Cliente } from '@/lib/types'

let customers: Map<string, Cliente> = new Map()
let customerCounter = 1

export async function GET() {
  const data = Array.from(customers.values())
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const id = `cli-${String(customerCounter++).padStart(4, '0')}`
    const cliente: Cliente = {
      id,
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      cpfCnpj: body.cpfCnpj,
      endereco: body.endereco,
      totalPedidos: 0,
      totalGasto: 0,
      observacoes: body.observacoes,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
    
    customers.set(id, cliente)
    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id || !customers.has(id)) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const cliente = customers.get(id)!
    const updated = {
      ...cliente,
      ...updates,
      atualizadoEm: new Date(),
    }

    customers.set(id, updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id || !customers.has(id)) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  customers.delete(id)
  return NextResponse.json({ success: true })
}
