import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/jua'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'

export const metadata: Metadata = {
  title: 'docsscan',
  description: 'Digitaliza Documentos Fácilmente',
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
