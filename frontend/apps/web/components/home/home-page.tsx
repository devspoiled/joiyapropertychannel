'use client'

import type { Neighborhood, PropertyCard } from '@frontend/types/api'
import { money } from '@/lib/property'
import { PropertyCardItem } from '@/components/properties/property-card-item'
import { toggleSavedPropertyAction } from '@/actions/toggle-saved-property-action'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { authClient } from '@/lib/auth-client'
import { useAuthModal } from '@/providers/auth-modal-provider'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ContactForm } from './contact-form'
import { HeroSearch } from './hero-search'

const NAV = ['Home', 'Search', 'Saved', 'Profile']

export function HomePage({
  properties,
  neighborhoods
}: {
  properties: PropertyCard[]
  neighborhoods: Neighborhood[]
}) {
  const [favs, setFavs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(properties.map((p) => [p.id, !!p.is_saved]))
  )
  const { data: session } = authClient.useSession()
  const { open: openAuthModal } = useAuthModal()
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

  const toggleFav = (id: string) => {
    if (!session) {
      openAuthModal(() => toggleFav(id))
      return
    }

    const nextSaved = !favs[id]
    setFavs((prev) => ({ ...prev, [id]: nextSaved }))

    toggleSavedPropertyAction(id, nextSaved).then((ok) => {
      if (!ok) {
        setFavs((prev) => ({ ...prev, [id]: !nextSaved }))
      }
    })
  }

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
        <SiteHeader favCount={favCount} />

        {/* Hero — Zillow-style: full-bleed photo background, bold short headline, one search bar */}
        <section className="relative isolate flex min-h-[480px] flex-col justify-center px-6 py-16 md:min-h-[600px] md:px-12">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover object-top"
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
                return (
                  <Link
                    key={h.id}
                    href={`/listings?neighborhood=${h.slug}`}
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
                        <span>{h.listing_count} listed</span>
                        {h.median_price_lac != null && (
                          <>
                            <span>·</span>
                            <span>Median {money(h.median_price_lac)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
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

        {/* Contact */}
        <section id="contact" className="border-t border-[#E2E8DE] px-6 py-16 md:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-sans text-[30px] font-extrabold tracking-[-.01em] text-[#1E241E]">
                Get in touch
              </h2>
              <p className="mt-2.5 max-w-[420px] text-[14.5px] leading-[1.6] text-[#6B756A]">
                Questions about a listing, or want help finding the right plot or house? Send us a
                message and we&apos;ll get back to you.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-[14.5px] text-[#3D473C]">
                <a href="tel:03333030124" className="flex items-center gap-2.5 hover:text-[#1E241E]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF1EA] text-[#2F6B3A]">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 3h2.8l1.2 3.4-1.7 1.3a9 9 0 0 0 4.5 4.5l1.3-1.7 3.4 1.2v2.8a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3z"
                      />
                    </svg>
                  </span>
                  0333 3030124
                </a>
                <a
                  href="https://wa.me/923067864121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#1E241E]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF1EA] text-[#2F6B3A]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.48 1.34 4.997L2 22l5.114-1.341a9.96 9.96 0 0 0 4.89 1.248h.004c5.513 0 9.996-4.483 9.996-9.997 0-2.67-1.04-5.18-2.928-7.07a9.935 9.935 0 0 0-7.072-2.837zm0 18.187h-.003a8.2 8.2 0 0 1-4.178-1.144l-.3-.178-3.035.796.81-2.959-.195-.304a8.18 8.18 0 0 1-1.254-4.401c0-4.52 3.68-8.198 8.2-8.198a8.15 8.15 0 0 1 5.798 2.402 8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.186-8.243 8.186z" />
                    </svg>
                  </span>
                  0306 7864121
                </a>
                <a
                  href="mailto:M.asifkhan3030143@gmail.com"
                  className="flex items-center gap-2.5 hover:text-[#1E241E]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF1EA] text-[#2F6B3A]">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5.5h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3 6 7 5 7-5" />
                    </svg>
                  </span>
                  M.asifkhan3030143@gmail.com
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>

        <SiteFooter />
      </div>

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
