import { NextRequest, NextResponse } from 'next/server'
import type { Produto } from '@/lib/types'

// Store in memory (escalável para DB)
let products: Map<string, Produto> = new Map()
let productCounter = 1

export async function GET() {
  const data = Array.from(products.values())
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const id = `prod-${String(productCounter++).padStart(3, '0')}`
    const produto: Produto = {
      id,
      nome: body.nome,
      descricao: body.descricao,
      categoria: body.categoria,
      componentes: body.componentes || [],
      custoMateriais: parseFloat(body.custoMateriais) || 0,
      custoMaoDeObra: parseFloat(body.custoMaoDeObra) || 0,
      custosIndiretos: parseFloat(body.custosIndiretos) || 0,
      custoTotal: parseFloat(body.custoTotal) || 0,
      margemLucro: parseFloat(body.margemLucro) || 50,
      precoSugerido: parseFloat(body.precoSugerido) || 0,
      precoVenda: parseFloat(body.precoVenda) || 0,
      precoOverride: body.precoOverride || false,
      tempoProducaoMinutos: parseInt(body.tempoProducaoMinutos) || 30,
      ativo: body.ativo !== false,
      imagemUrl: body.imagemUrl,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
    
    products.set(id, produto)
    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id || !products.has(id)) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const produto = products.get(id)!
    const updated = {
      ...produto,
      ...updates,
      atualizadoEm: new Date(),
    }

    products.set(id, updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id || !products.has(id)) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

  products.delete(id)
  return NextResponse.json({ success: true })
}
