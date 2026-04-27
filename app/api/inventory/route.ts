import { NextRequest, NextResponse } from 'next/server'

// Storage em memória (em produção seria um banco de dados)
let materiaisStorage: any[] = []

// Materiais padrão iniciais
const materiaisDefault = [
  {
    id: 'mat-001',
    nome: 'Contas de Cristal 6mm - Transparente',
    categoria: 'contas',
    unidadeCompra: 'gramas',
    unidadeUso: 'unidade',
    pesoCompra: 80,
    quantidadeEstimada: 60,
    relacaoConversao: 0.75,
    quantidadeDisponivel: 450,
    estoqueMinimo: 100,
    precoCompra: 25.0,
    custoUnitario: 0.42,
    fornecedor: 'Cristais Silva',
  },
]

export async function GET() {
  try {
    // Se storage vazio, inicializar com padrão
    if (materiaisStorage.length === 0) {
      materiaisStorage = materiaisDefault
    }
    return NextResponse.json(materiaisStorage)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar materiais' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const novoMaterial = {
      id: `mat-${Date.now()}`,
      ...body,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
    
    // Calcular relacaoConversao se não fornecida
    if (body.pesoCompra && body.quantidadeEstimada && !body.relacaoConversao) {
      novoMaterial.relacaoConversao = body.quantidadeEstimada / body.pesoCompra
    }
    
    // Calcular custoUnitario
    if (body.precoCompra && novoMaterial.relacaoConversao) {
      novoMaterial.custoUnitario = body.precoCompra / (body.quantidadeEstimada || 1)
    }
    
    materiaisStorage.push(novoMaterial)
    
    return NextResponse.json(novoMaterial, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar material' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    
    const index = materiaisStorage.findIndex((m) => m.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      )
    }
    
    const materialAtualizado = {
      ...materiaisStorage[index],
      ...body,
      atualizadoEm: new Date(),
    }
    
    // Recalcular custos se necessário
    if (body.pesoCompra || body.quantidadeEstimada) {
      const peso = body.pesoCompra || materiaisStorage[index].pesoCompra
      const quantidade = body.quantidadeEstimada || materiaisStorage[index].quantidadeEstimada
      if (peso && quantidade) {
        materialAtualizado.relacaoConversao = quantidade / peso
      }
    }
    
    if (body.precoCompra || materialAtualizado.relacaoConversao) {
      const preco = body.precoCompra || materiaisStorage[index].precoCompra
      const quantidade = materialAtualizado.quantidadeEstimada || materiaisStorage[index].quantidadeEstimada
      if (preco && quantidade) {
        materialAtualizado.custoUnitario = preco / quantidade
      }
    }
    
    materiaisStorage[index] = materialAtualizado
    
    return NextResponse.json(materialAtualizado)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar material' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    const index = materiaisStorage.findIndex((m) => m.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      )
    }
    
    const removido = materiaisStorage.splice(index, 1)[0]
    
    return NextResponse.json({ sucesso: true, removido })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar material' },
      { status: 500 }
    )
  }
}
