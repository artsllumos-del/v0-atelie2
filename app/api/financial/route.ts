import { NextRequest, NextResponse } from 'next/server'
import { getFinancialTransactions, createFinancialTransaction, getFinancialSummary } from '@/lib/supabase/financial'

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type')
    const category = req.nextUrl.searchParams.get('category')
    const startDate = req.nextUrl.searchParams.get('startDate')
    const endDate = req.nextUrl.searchParams.get('endDate')
    const summary = req.nextUrl.searchParams.get('summary')

    if (summary === 'true') {
      const financialSummary = await getFinancialSummary()
      return NextResponse.json(financialSummary)
    }

    const transactions = await getFinancialTransactions({ type, category, startDate, endDate })
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transaction = await createFinancialTransaction(body)
    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
