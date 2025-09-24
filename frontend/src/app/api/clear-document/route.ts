import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const isProd = process.env.NODE_ENV === 'production'
    const backendBase = isProd ? '' : 'http://127.0.0.1:8000'
    const backendPath = isProd ? '/backend/clear-document' : '/api/clear-document'

    const backendResponse = await fetch(`${backendBase}${backendPath}`, {
      method: 'POST',
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      throw new Error(`Backend responded with status: ${backendResponse.status}, detail: ${errorData.detail || 'Unknown error'}`)
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error: unknown) {
    console.error('Error clearing document:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
