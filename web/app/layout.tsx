import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/jua'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'

export const metadata: Metadata = {
  title: 'docsscan',
  description: 'Digitaliza Documentos Fácilmente',
  metadataBase: new URL('http://192.168.8.2:3000'),
  openGraph: {
    url: 'https://docsscan.luisruiz.dev',
    siteName: 'DOCSSCAN',
    images: [
      {
        url: 'http://192.168.8.2:3000/og.jpg',
        width: 960,
        height: 720
      }
    ],
    locale: 'es-MX',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body>
        <div className='absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
        <Header />
        {children}
        <Footer />
        <Toast />
      </body>
    </html>
  )
}
