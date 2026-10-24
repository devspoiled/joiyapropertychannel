'use client'

import { authClient } from '@/lib/auth-client'
import { useAuthModal } from '@/providers/auth-modal-provider'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Plots', href: '/listings?type=plot' },
  { label: 'Homes', href: '/listings?type=house&status=for_sale' },
  { label: 'Rent', href: '/listings?status=for_rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Agents', href: '/agents' },
  { label: 'Explore', href: '/#explore' }
]

const DRAWER_LINKS = [
  { label: 'Buy', href: '/listings?status=for_sale', meta: '' },
  { label: 'Rent', href: '/listings?status=for_rent', meta: '' },
  { label: 'Sell your home', href: '/sell', meta: '' },
  { label: 'Agents', href: '/agents', meta: '' },
  { label: 'Saved homes', href: '/#saved', meta: '' }
]

export function SiteHeader({ favCount = 0 }: { favCount?: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const { open: openAuthModal } = useAuthModal()

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-[#E2E8DE] bg-[#F3F6F1]/[.82] px-6 py-3.5 backdrop-blur-md md:px-12">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo-mark.png" alt="Joiya Property Channel" width={1284} height={790} className="h-[46px] w-auto" unoptimized />
          </Link>
          <nav className="hidden items-center gap-8 text-[14.5px] font-medium text-[#3D473C] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#1E241E]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="/#saved"
              className="hidden items-center gap-[7px] rounded-[9px] px-3 py-2 text-sm font-medium text-[#3D473C] hover:bg-[#E8EDE5] sm:flex"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#A8E6AE] shadow-[0_0_0_3px_rgba(168,230,174,0.3)]" />
              Saved <span className="font-mono text-xs text-[#5B6659]">{favCount}</span>
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => authClient.signOut()}
                className="rounded-full border border-[#D3DBD0] px-4 py-2.5 text-sm font-medium text-[#1E241E] hover:border-[#1E241E]"
              >
                {session.user.name || session.user.email} · Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="rounded-full border border-[#D3DBD0] px-4 py-2.5 text-sm font-medium text-[#1E241E] hover:border-[#1E241E]"
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setDrawerOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-[11px] border border-[#D9E0D5] bg-white lg:hidden"
            >
              <span className="block h-[1.5px] w-[15px] bg-[#1E241E]" />
              <span className="block h-[1.5px] w-[15px] bg-[#1E241E]" />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-[#1E241E]/[.44] backdrop-blur-[2px] lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <nav className="fixed inset-x-3 top-[68px] z-40 rounded-[22px] bg-white p-2.5 shadow-[0_30px_60px_-24px_rgba(30,36,30,.5)] lg:hidden">
            {DRAWER_LINKS.map((d) => (
              <Link
                key={d.label}
                href={d.href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between rounded-[14px] px-3.5 py-[15px] text-base font-semibold text-[#1E241E] hover:bg-[#F1F5EF]"
              >
                {d.label}
                <span className="font-mono text-xs text-[#6B756A]">{d.meta}</span>
              </Link>
            ))}
            {!session && (
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false)
                  openAuthModal()
                }}
                className="flex w-full items-center justify-between rounded-[14px] px-3.5 py-[15px] text-base font-semibold text-[#1E241E] hover:bg-[#F1F5EF]"
              >
                Sign in
              </button>
            )}
          </nav>
        </>
      )}
    </>
  )
}
