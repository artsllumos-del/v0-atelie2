import { NextResponse } from 'next/server'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    )
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'Invalid JSON', code: 'INVALID_JSON' },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message, code: 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal Server Error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await fn()
    return NextResponse.json(result)
  } catch (error) {
    return handleAPIError(error)
  }
}
