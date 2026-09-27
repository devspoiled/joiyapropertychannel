'use client'

import type { Neighborhood, PropertyCard } from '@frontend/types/api'
import { money } from '@/lib/property'
import { PropertyCardItem } from '@/components/properties/property-card-item'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { HeroSearch } from './hero-search'

const NAV = ['Home', 'Search', 'Saved', 'Profile']

const DRAWER_LINKS = [
  { label: 'Buy', meta: '12,400' },
  { label: 'Rent', meta: '3,180' },
  { label: 'Sell your home', meta: '' },
  { label: 'New construction', meta: '96' },
  { label: 'Saved homes', meta: '' },
  { label: 'Sign in', meta: '' }
]

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', className: 'h-4 w-4' } as const

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M13.5 9.2h1.3V7h-1.3c-1.4 0-2.5 1.1-2.5 2.5v1.3H9.7v2.1H11V17h2.1v-4.1h1.5l.4-2.1h-1.9V9.7c0-.28.22-.5.5-.5z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
      </svg>
    )
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="7.7" cy="8" r="1" fill="currentColor" />
        <path d="M7.7 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M11.5 17v-3.8c0-1.2.9-2.2 2.1-2.2s2.1 1 2.1 2.2V17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M11.5 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M5 5l14 14M19 5L5 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
]

export function HomePage({
  properties,
  neighborhoods
}: {
  properties: PropertyCard[]
  neighborhoods: Neighborhood[]
}) {
  const [favs, setFavs] = useState<Record<string, boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navActive, setNavActive] = useState('Home')
  const [atEnd, setAtEnd] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)
  const [neighborhoodsAtEnd, setNeighborhoodsAtEnd] = useState(false)
  const neighborhoodsRailRef = useRef<HTMLDivElement>(null)

  const favCount = useMemo(() => Object.values(favs).filter(Boolean).length, [favs])

  function scrollRailRef(ref: React.RefObject<HTMLDivElement | null>, direction: 1 | -1) {
    const rail = ref.current
    if (!rail) return
    const card = rail.firstElementChild as HTMLElement | null
    const step = (card?.offsetWidth ?? 320) + 22
    rail.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  function makeAtEndHandler(ref: React.RefObject<HTMLDivElement | null>, setter: (v: boolean) => void) {
    return () => {
      const rail = ref.current
      if (!rail) return
      setter(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8)
    }
  }

  const scrollRail = (direction: 1 | -1) => scrollRailRef(railRef, direction)
  const updateAtEnd = makeAtEndHandler(railRef, setAtEnd)
  const scrollNeighborhoodsRail = (direction: 1 | -1) => scrollRailRef(neighborhoodsRailRef, direction)
  const updateNeighborhoodsAtEnd = makeAtEndHandler(neighborhoodsRailRef, setNeighborhoodsAtEnd)

  const toggleFav = (id: string) => setFavs((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div
      className="joiya-root"
      style={{ background: '#F3F6F1', color: '#1E241E', fontFamily: 'var(--font-sans-family, system-ui), sans-serif' }}
    >
      <style>{`
        .joiya-root .font-serif { font-family: var(--font-sans-family, sans-serif), sans-serif; }
        .joiya-root .font-mono { font-family: var(--font-mono-family, monospace), monospace; }
        .joiya-root .font-sans { font-family: var(--font-sans-family, sans-serif), sans-serif; }
      `}</style>
      <div>
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-[#E2E8DE] bg-[#F3F6F1]/[.82] px-6 py-3.5 backdrop-blur-md md:px-12">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo-mark.png" alt="Joiya Property Channel" width={1284} height={790} className="h-[46px] w-auto" unoptimized />
          </Link>
          <nav className="hidden items-center gap-8 text-[14.5px] font-medium text-[#3D473C] lg:flex">
            <a href="#plots" className="hover:text-[#1E241E]">Plots</a>
            <a href="#buy" className="hover:text-[#1E241E]">Homes</a>
            <a href="#rent" className="hover:text-[#1E241E]">Rent</a>
            <a href="#sell" className="hover:text-[#1E241E]">Sell</a>
            <a href="#explore" className="hover:text-[#1E241E]">Explore</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="hidden items-center gap-[7px] rounded-[9px] px-3 py-2 text-sm font-medium text-[#3D473C] hover:bg-[#E8EDE5] sm:flex"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#A8E6AE] shadow-[0_0_0_3px_rgba(168,230,174,0.3)]" />
              Saved <span className="font-mono text-xs text-[#5B6659]">{favCount}</span>
            </button>
            <button
              type="button"
              className="rounded-full border border-[#D3DBD0] px-4 py-2.5 text-sm font-medium text-[#1E241E] hover:border-[#1E241E]"
            >
              Sign in
            </button>
            <button
              type="button"
              className="rounded-full border border-[#1E241E] bg-[#1E241E] px-[18px] py-[11px] text-sm font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A] hover:border-[#2F6B3A]"
            >
              List a property
            </button>
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

        {/* Hero — Zillow-style: full-bleed photo background, bold short headline, one search bar */}
        <section className="relative isolate flex min-h-[480px] flex-col justify-center px-6 py-16 md:min-h-[600px] md:px-12">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(90deg, rgba(20,24,20,.75) 0%, rgba(20,24,20,.5) 32%, rgba(20,24,20,.15) 58%, rgba(20,24,20,0) 75%)'
            }}
          />

          <div className="relative mx-auto w-full max-w-[1440px]">
            <h1 className="font-sans text-[38px] font-extrabold leading-[1.05] tracking-[-.02em] text-[#F3F6F1] text-balance md:text-[58px] md:leading-[1.03]">
              Find your next plot,<br className="hidden md:block" /> backed by a verified agent.
            </h1>

            <HeroSearch />
          </div>
        </section>

        {/* Curated listings */}
        <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-12">
          <div className="my-8 flex items-end justify-between gap-8">
            <h2 className="font-sans text-[24px] font-semibold leading-[1.05] tracking-[-.02em] md:text-[32px]">
              Featured listings in Lahore
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Previous properties"
                onClick={() => scrollRail(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E0D5] text-[#1E241E] hover:border-[#1E241E]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5 7.5 10l5 5" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="More properties"
                disabled={atEnd}
                onClick={() => scrollRail(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E0D5] text-[#1E241E] disabled:opacity-30 hover:not-disabled:border-[#1E241E]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            onScroll={updateAtEnd}
            className="flex snap-x snap-mandatory gap-[22px] overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {properties.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="w-[calc((100%-3*22px)/4)] shrink-0 snap-start max-sm:w-[85%] sm:w-[calc((100%-22px)/2)] lg:w-[calc((100%-3*22px)/4)]"
              >
                <PropertyCardItem property={p} faved={!!favs[p.id]} onToggleFav={toggleFav} />
              </div>
            ))}
            {properties.length > 8 && (
              <div className="flex w-[calc((100%-3*22px)/4)] shrink-0 snap-start items-center justify-center max-sm:w-[85%] sm:w-[calc((100%-22px)/2)] lg:w-[calc((100%-3*22px)/4)]">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#1E241E] bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#2F6B3A] hover:bg-[#EDF1EA]"
                >
                  See more →
                </Link>
              </div>
            )}
          </div>

          {/* Neighbourhoods */}
          <div className="mt-11">
            <div className="flex items-end justify-between gap-8">
              <h2 className="font-sans text-[24px] font-semibold leading-[1.05] tracking-[-.02em] md:text-[32px]">
                Explore Lahore, block by block
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous neighbourhoods"
                  onClick={() => scrollNeighborhoodsRail(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E0D5] text-[#1E241E] hover:border-[#1E241E]"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5 7.5 10l5 5" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="More neighbourhoods"
                  disabled={neighborhoodsAtEnd}
                  onClick={() => scrollNeighborhoodsRail(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E0D5] text-[#1E241E] disabled:opacity-30 hover:not-disabled:border-[#1E241E]"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={neighborhoodsRailRef}
              onScroll={updateNeighborhoodsAtEnd}
              className="mt-6 flex snap-x snap-mandatory gap-[22px] overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {neighborhoods.slice(0, 8).map((h) => {
                const listingCount = properties.filter((p) => p.neighborhood.id === h.id).length
                return (
                  <a
                    key={h.id}
                    href="#neighbourhoods"
                    className="group relative block h-[230px] w-[calc((100%-2*22px)/3)] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[#E4EAE0] bg-[#EDF1EA] text-[#1E241E] transition-transform duration-300 ease-[cubic-bezier(.22,.8,.3,1)] hover:-translate-y-1.5 max-sm:w-[85%] sm:w-[calc((100%-22px)/2)] lg:w-[calc((100%-2*22px)/3)]"
                  >
                    {h.cover_image_url ? (
                      <Image
                        src={h.cover_image_url}
                        alt={h.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(.22,.8,.3,1)] group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.22,.8,.3,1)] group-hover:scale-[1.06]"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(115deg, #E6EDE3 0px, #E6EDE3 11px, #D9E2D5 11px, #D9E2D5 22px)'
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, rgba(30,36,30,0) 40%, rgba(30,36,30,.78) 100%)' }}
                    />
                    <div className="absolute bottom-[15px] left-4 right-4 text-[#F3F6F1]">
                      <div className="font-serif text-[26px] leading-[1.1]">{h.name}</div>
                      <div className="mt-1.5 flex gap-3 text-[12.5px] text-[#CFDCCC]">
                        <span>{listingCount} listed</span>
                        {h.median_price_lac != null && (
                          <>
                            <span>·</span>
                            <span>Median {money(h.median_price_lac)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                )
              })}
              {neighborhoods.length > 8 && (
                <div className="flex w-[calc((100%-2*22px)/3)] shrink-0 snap-start items-center justify-center max-sm:w-[85%] sm:w-[calc((100%-22px)/2)] lg:w-[calc((100%-2*22px)/3)]">
                  <a
                    href="#neighbourhoods"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#1E241E] bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#2F6B3A] hover:bg-[#EDF1EA]"
                  >
                    See more →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1E241E] px-6 pb-9 pt-11 text-[#D6DED3] md:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:justify-between sm:gap-16">
            <div className="max-w-[320px]">
              <div className="font-serif text-[26px] text-[#F3F6F1]">Joiya Property Channel</div>
              <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[#9BA898]">
                Discover places worth calling home. Lahore — verified listings, real agents.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3D473C] text-[#D6DED3] hover:border-[#4E9E5C] hover:text-[#A8E6AE]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-12 text-[13.5px] sm:gap-16">
              <div className="flex flex-col gap-2.5">
                <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Discover</div>
                <a href="#buy" className="text-[#D6DED3]">Buy</a>
                <a href="#rent" className="text-[#D6DED3]">Rent</a>
                <a href="#new" className="text-[#D6DED3]">New construction</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Sell</div>
                <a href="#list" className="text-[#D6DED3]">List a property</a>
                <a href="#agent" className="text-[#D6DED3]">Find an agent</a>
                <a href="#pricing" className="text-[#D6DED3]">Pricing tool</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Company</div>
                <a href="#about" className="text-[#D6DED3]">About</a>
                <a href="#contact" className="text-[#D6DED3]">Contact</a>
                <a href="#careers" className="text-[#D6DED3]">Careers</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-[#1E241E]/[.44] backdrop-blur-[2px] lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <nav className="fixed inset-x-3 bottom-6 z-40 rounded-[22px] bg-white p-2.5 shadow-[0_30px_60px_-24px_rgba(30,36,30,.5)] lg:hidden">
            {DRAWER_LINKS.map((d) => (
              <a
                key={d.label}
                href="#menu"
                className="flex items-center justify-between rounded-[14px] px-3.5 py-[15px] text-base font-semibold text-[#1E241E] hover:bg-[#F1F5EF]"
              >
                {d.label}
                <span className="font-mono text-xs text-[#6B756A]">{d.meta}</span>
              </a>
            ))}
          </nav>
        </>
      )}

      {/* Mobile bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[#E4EAE0] bg-white/[.94] px-3 pb-[22px] pt-2.5 backdrop-blur-md lg:hidden">
        {NAV.map((label) => {
          const on = label === navActive
          return (
            <button
              key={label}
              type="button"
              onClick={() => setNavActive(label)}
              className="flex min-h-[48px] flex-1 flex-col items-center gap-[5px]"
              style={{ color: on ? '#2F6B3A' : '#6B756A' }}
            >
              <span
                className="h-5 w-5 rounded-md border-2"
                style={{ borderColor: on ? '#2F6B3A' : '#6B756A', background: on ? '#A8E6AE' : 'transparent' }}
              />
              <span className="text-[11px] font-semibold">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
