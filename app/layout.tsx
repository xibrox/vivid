import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ToasterContext from './context/ToasterContext'
import ActiveStatus from './components/ActiveStatus'

import './globals.css'
import AuthContext from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vivid Chat',
  description: 'Vivid Chat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
