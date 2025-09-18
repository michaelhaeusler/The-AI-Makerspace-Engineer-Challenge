import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const apiKey = formData.get('apiKey') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key provided' }, { status: 400 })
    }

    // Forward the request to the backend
    const backendUrl = process.env.NODE_ENV === 'production'
      ? '' // Use relative URL in production (same Vercel project)
      : 'http://127.0.0.1:8000' // Use localhost in development

    // Create new FormData for backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('api_key', apiKey)

    const backendResponse = await fetch(`${backendUrl}/api/upload-pdf`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      throw new Error(`Backend responded with status: ${backendResponse.status}, detail: ${errorData.detail || 'Unknown error'}`)
    }

    const uploadResult = await backendResponse.json()
    return NextResponse.json(uploadResult)

  } catch (error: unknown) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
