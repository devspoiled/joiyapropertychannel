import { Inter } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({
  children
}: { children: React.ReactNode }) {
  return (
    <div
      className={twMerge(
        'bg-gray-50 text-sm text-gray-700 antialiased',
        inter.className
      )}
    >
      <div className="px-6">
        <div className="container mx-auto my-12 max-w-6xl">{children}</div>
      </div>
    </div>
  )
}
