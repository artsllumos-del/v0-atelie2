import { NextRequest, NextResponse } from 'next/server'
import { createOrderItem, createOrder, getOrdersByStatus } from '@/lib/supabase/orders'
import { validateRequest, validationSchemas } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar entrada
    const validation = await validateRequest(validationSchemas.order, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const order = await createOrder(validation.data)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', code: 'ORDER_CREATE_FAILED' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    
    // Validar status se fornecido
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status parameter', code: 'INVALID_STATUS' },
        { status: 400 }
      )
    }

    if (status) {
      const orders = await getOrdersByStatus(status)
      return NextResponse.json(orders)
    }
    
    return NextResponse.json([])
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', code: 'ORDER_FETCH_FAILED' },
      { status: 500 }
    )
  }
}

