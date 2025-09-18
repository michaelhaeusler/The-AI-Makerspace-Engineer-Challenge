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

    const backendResponse = await fetch(`${backendUrl}/api/upload-pdf?api_key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      throw new Error(`Backend responded with status: ${backendResponse.status}, detail: ${errorData.detail || 'Unknown error'}`)
    }

    const uploadResult = await backendResponse.json()

    // Now generate the document summary
    const summaryResponse = await fetch(`${backendUrl}/api/summarize-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_message: 'Generate document summary',
        user_message: 'Please summarize this document',
        model: 'gpt-4o-mini',
        api_key: apiKey
      }),
    })

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json().catch(() => ({}))
      throw new Error(`Summary generation failed: ${errorData.detail || 'Unknown error'}`)
    }

    const summaryResult = await summaryResponse.json()

    return NextResponse.json({
      ...uploadResult,
      summary: summaryResult.summary
    })

  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
