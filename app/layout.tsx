import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'docsscan',
  description: 'Escanea documentos fácilmente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body>{children}</body>
    </html>
  )
}
