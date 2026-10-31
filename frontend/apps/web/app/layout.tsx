import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { AuthModalProvider } from '@/providers/auth-modal-provider'
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
        <AuthModalProvider>{children}</AuthModalProvider>
        <WhatsAppButton />
      </body>
    </html>
  )
}
