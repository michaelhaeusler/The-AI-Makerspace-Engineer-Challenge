import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Engineer Challenge - Groovy Chat',
  description: 'A retro 70s-style AI chat application for the AI Engineer Challenge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen psychedelic-bg">
        {children}
      </body>
    </html>
  )
}
