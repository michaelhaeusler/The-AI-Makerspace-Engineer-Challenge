import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const backendUrl = process.env.NODE_ENV === 'production'
      ? '' // Use relative URL in production (same Vercel project)
      : 'http://127.0.0.1:8000' // Use localhost in development

    const backendResponse = await fetch(`${backendUrl}/api/clear-document`, {
      method: 'POST',
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      throw new Error(`Backend responded with status: ${backendResponse.status}, detail: ${errorData.detail || 'Unknown error'}`)
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Error clearing document:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
