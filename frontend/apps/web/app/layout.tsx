import { AuthProvider } from '@/providers/auth-provider'
import type { Metadata } from 'next'

import '@frontend/ui/styles/globals.css'

export const metadata: Metadata = {
  title: 'Joiya Property Channel'
}

export default function RootLayout({
  children
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
