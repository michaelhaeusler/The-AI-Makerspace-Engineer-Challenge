import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
    const backendResponse = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`)
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { error: 'Backend server is not running' },
      { status: 503 }
    )
  }
}
