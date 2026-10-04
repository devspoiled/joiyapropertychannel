import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (session === null) {
    return redirect('/')
  }

  return (
    <div className="flex-grow h-screen flex items-center justify-center -my-12 w-full">
      <div className="w-96">{children}</div>
    </div>
  )
}
