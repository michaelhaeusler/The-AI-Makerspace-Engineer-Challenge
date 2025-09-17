import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend
    const backendResponse = await fetch('http://127.0.0.1:8000/api/health', {
      method: 'GET',
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`)
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in health check API route:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}