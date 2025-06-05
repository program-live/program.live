import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PROGRAM',
  description: 'PROGRAM',
  generator: 'program.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
