import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the request to the backend
    const backendResponse = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text()
      throw new Error(`Backend responded with status: ${backendResponse.status}, data: ${errorData}`)
    }

    const reader = backendResponse.body?.getReader()
    if (!reader) throw new Error('No reader available from backend')

    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          return
        }
        controller.enqueue(value)
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}