import { NextRequest, NextResponse } from 'next/server'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/supabase/cart'
import { validateRequest, validationSchemas } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter', code: 'MISSING_USERID' },
        { status: 400 }
      )
    }
    
    const cart = await getCart(userId)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart', code: 'CART_FETCH_FAILED' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar entrada
    const validation = await validateRequest(validationSchemas.cartItem, {
      product_id: body.productId,
      quantity: body.quantity,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'Missing userId', code: 'MISSING_USERID' },
        { status: 400 }
      )
    }

    const item = await addToCart(
      body.userId,
      validation.data.product_id,
      validation.data.quantity,
      body.customization
    )
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart', code: 'CART_ADD_FAILED' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar quantidade
    if (body.updates?.quantity !== undefined) {
      const validation = await validateRequest(
        validationSchemas.cartItem.pick({ quantity: true }),
        { quantity: body.updates.quantity }
      )

      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error, code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
    }

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing item id', code: 'MISSING_ID' },
        { status: 400 }
      )
    }

    const item = await updateCartItem(body.id, body.updates)
    return NextResponse.json(item)
  } catch (error) {
    console.error('Cart PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart', code: 'CART_UPDATE_FAILED' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter', code: 'MISSING_ID' },
        { status: 400 }
      )
    }
    
    await removeFromCart(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart', code: 'CART_DELETE_FAILED' },
      { status: 500 }
    )
  }
}
