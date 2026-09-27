'use client'

import type { Hospital, Property, PropertyCard, School } from '@frontend/types/api'
import { EventEnum, StatusEnum } from '@frontend/types/api'
import { formatArea, money, STATUS_COLORS, STATUS_LABELS } from '@/lib/property'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ContactAgentModal } from './contact-agent-modal'
import { PropertyMap } from './property-map'

const EVENT_LABELS: Record<EventEnum, string> = {
  [EventEnum.LISTED]: 'Listed',
  [EventEnum.PRICE_CHANGE]: 'Price change',
  [EventEnum.SOLD]: 'Sold',
  [EventEnum.PENDING]: 'Pending'
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-[17px] w-[17px] transition-colors"
    fill={filled ? '#2F6B3A' : 'none'}
    stroke={filled ? '#2F6B3A' : '#8A948A'}
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 3.5 8 2.8 10.3 4 12 6.3 13.7 4 16 2.8 18.5 3.5 22 4.5 23.5 8 22 11.3c-2.5 4.6-10 9.2-10 9.2z"
    />
  </svg>
)

const SchoolIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="#2F6B3A" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 2 8l10 5 10-5-10-5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 8v6" />
  </svg>
)

const HospitalIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="#C0463E" strokeWidth="1.8">
    <rect x="4" y="6" width="16" height="15" rx="1.5" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6M9 13h6" />
  </svg>
)

const NAV_SECTIONS = [
  'Overview',
  'Facts & Features',
  'Tax History',
  'Price History',
  'Nearby Schools',
  'Nearby Hospitals',
  'Payment Calculator',
  'Neighbourhood'
] as const
type Section = (typeof NAV_SECTIONS)[number]

export function PropertyDetail({
  property,
  similar,
  nearbySchools,
  nearbyHospitals
}: {
  property: Property
  similar: PropertyCard[]
  nearbySchools: School[]
  nearbyHospitals: Hospital[]
}) {
  const [saved, setSaved] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('Overview')

  const sectionRefs = useRef<Partial<Record<Section, HTMLElement | null>>>({})
  const isClickScrolling = useRef(false)

  // Scroll-spy: highlight whichever section's heading is nearest the top of
  // the viewport, and skip fighting with an in-progress click-triggered scroll.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        const section = (topMost.target as HTMLElement).dataset.section as Section | undefined
        if (section) setActiveSection(section)
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 }
    )
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (section: Section) => {
    const el = sectionRefs.current[section]
    if (!el) return
    isClickScrolling.current = true
    setActiveSection(section)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      isClickScrolling.current = false
    }, 700)
  }

  const gallery =
    property.images.length > 0
      ? property.images
      : property.cover_image_url
        ? [{ id: 0, url: property.cover_image_url, order: 0 }]
        : []

  const status = property.status ?? StatusEnum.FOR_SALE
  const [statusBg, statusFg] = STATUS_COLORS[status]
  const isPlot = property.beds == null || property.baths == null || property.sqft == null
  const agentInitials = property.agent.name
    .split(' ')
    .map((w) => w[0])
    .join('')
  const perSqft =
    property.sqft && property.sqft > 0
      ? Math.round((property.price_lac * 100000) / property.sqft)
      : null

  const lat = property.latitude ? Number(property.latitude) : null
  const lng = property.longitude ? Number(property.longitude) : null

  const daysListed = useMemo(() => {
    const listedAt = new Date(property.created_at)
    const diffMs = Date.now() - listedAt.getTime()
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  }, [property.created_at])

  // Most recent price change vs. the original listed price, if any — shown
  // as a "Price cut" style badge the way Zillow surfaces it.
  const priceCut = useMemo(() => {
    const listed = property.price_history.find((h) => h.event === EventEnum.LISTED)
    if (!listed || listed.price_lac <= property.price_lac) return null
    return listed.price_lac - property.price_lac
  }, [property.price_history, property.price_lac])

  // Simple mortgage estimate: 20% down, 8% annual rate, 20-year term —
  // clearly a rough calculator like Zillow's, not a lending product.
  const monthly = useMemo(() => {
    const principal = property.price_lac * 100000 * 0.8
    const rate = 0.08 / 12
    const n = 20 * 12
    const pi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
    const taxes = (property.price_lac * 100000 * 0.01) / 12
    const insurance = (property.price_lac * 100000 * 0.003) / 12
    return { pi: Math.round(pi), taxes: Math.round(taxes), insurance: Math.round(insurance) }
  }, [property.price_lac])
  const estMonthly = monthly.pi + monthly.taxes + monthly.insurance

  const registerSection = (section: Section) => (el: HTMLElement | null) => {
    sectionRefs.current[section] = el
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
        .joiya-root .maplibregl-ctrl-attrib { font-size: 10px; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#E2E8DE] bg-[#F3F6F1] px-6 py-4 md:px-12">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#3D473C] hover:text-[#1E241E]"
          >
            ← Back to search
          </Link>
          <Link href="/" className="flex items-center">
            <Image src="/logo-mark.png" alt="Joiya Property Channel" width={1284} height={790} className="h-[36px] w-auto" unoptimized />
          </Link>
          <div className="flex items-center gap-5 text-[14px] font-semibold text-[#3D473C]">
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              className="inline-flex items-center gap-1.5 hover:text-[#1E241E]"
            >
              <HeartIcon filled={saved} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button type="button" className="hidden items-center gap-1.5 hover:text-[#1E241E] sm:inline-flex">
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Photo grid */}
      <div className="mx-auto max-w-[1440px] px-6 pt-5 md:px-12">
        {gallery.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative h-[280px] overflow-hidden rounded-[14px] bg-[#EDF1EA] sm:h-[420px]">
              <Image src={gallery[0].url} alt={property.address} fill unoptimized priority className="object-cover" />
              <span
                className="absolute left-3 top-3 rounded-[7px] px-3 py-1.5 text-[12.5px] font-bold tracking-[.02em]"
                style={{ background: statusBg, color: statusFg }}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {gallery.slice(1, 5).map((img, i) => (
                <div key={img.id} className="relative h-[135px] overflow-hidden rounded-[12px] bg-[#EDF1EA] sm:h-[206px]">
                  <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                  {i === 3 && gallery.length > 5 && (
                    <Link
                      href={`/properties/${property.id}/photos`}
                      className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-[8px] bg-white px-3 py-2 text-[13px] font-semibold text-[#1E241E] shadow-[0_4px_12px_-4px_rgba(30,36,30,.4)]"
                    >
                      See all {gallery.length} photos
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price / address bar */}
      <div className="mx-auto max-w-[1440px] px-6 pt-6 md:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {priceCut != null && (
              <div className="mb-2 inline-block rounded-[6px] bg-[#F3EDDC] px-2.5 py-1 text-[13px] font-bold text-[#7A6320]">
                Price cut: {money(priceCut)}
              </div>
            )}
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <div className="font-serif text-[36px] font-bold leading-none md:text-[42px]">
                {money(property.price_lac)}
              </div>
              <div className="flex gap-6 pb-1">
                {!isPlot ? (
                  <>
                    <div>
                      <span className="text-[19px] font-bold">{property.beds}</span>
                      <span className="ml-1 text-[15px] text-[#6B756A]">beds</span>
                    </div>
                    <div>
                      <span className="text-[19px] font-bold">{property.baths}</span>
                      <span className="ml-1 text-[15px] text-[#6B756A]">baths</span>
                    </div>
                    <div className="text-[19px] font-bold">{formatArea(property.sqft)}</div>
                  </>
                ) : (
                  <div>
                    <span className="text-[19px] font-bold">{property.plot_size}</span>
                    <span className="ml-1 text-[15px] text-[#6B756A]">plot</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-1.5 text-[16px] font-medium text-[#2C352C]">{property.address}</div>
            <div className="text-[14.5px] text-[#6B756A]">{property.neighborhood.city}</div>

            <div className="mt-4 inline-flex items-center gap-3 rounded-[10px] bg-[#ECF1E8] px-4 py-2.5 text-[14px]">
              <span className="font-bold">Est.: Rs {estMonthly.toLocaleString('en-US')}/mo</span>
              <span className="text-[#6B756A]">·</span>
              <span className="font-semibold text-[#2F6B3A]">based on a simple estimate</span>
            </div>

            {/* Key facts row */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-[10px] bg-[#F1F5EF] px-4 py-3">
                <div className="text-[13.5px] font-semibold capitalize">{property.type}</div>
                <div className="text-[12px] text-[#6B756A]">Property type</div>
              </div>
              {property.year_built && (
                <div className="rounded-[10px] bg-[#F1F5EF] px-4 py-3">
                  <div className="text-[13.5px] font-semibold">Built in {property.year_built}</div>
                  <div className="text-[12px] text-[#6B756A]">Year built</div>
                </div>
              )}
              {property.lot_size_sqft && (
                <div className="rounded-[10px] bg-[#F1F5EF] px-4 py-3">
                  <div className="text-[13.5px] font-semibold">{formatArea(property.lot_size_sqft)}</div>
                  <div className="text-[12px] text-[#6B756A]">Lot size</div>
                </div>
              )}
              {perSqft && (
                <div className="rounded-[10px] bg-[#F1F5EF] px-4 py-3">
                  <div className="text-[13.5px] font-semibold">Rs {perSqft.toLocaleString('en-US')}/sqft</div>
                  <div className="text-[12px] text-[#6B756A]">Price per sqft</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: contact agent */}
          <div>
            <div className="rounded-[16px] border border-[#E4EAE0] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(30,36,30,.4)] lg:sticky lg:top-6">
              <button
                type="button"
                className="w-full rounded-full bg-[#1E241E] px-5 py-3.5 text-[15px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A]"
              >
                Request a tour
              </button>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="mt-2.5 w-full rounded-full border border-[#D3DBD0] px-5 py-3.5 text-[15px] font-semibold text-[#1E241E] hover:border-[#1E241E]"
              >
                Contact agent
              </button>

              <div className="mt-5 flex items-center gap-3 border-t border-[#EDF1EA] pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4EBE1] text-[14px] font-bold text-[#4A544A]">
                  {agentInitials}
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold">{property.agent.name}</div>
                  <div className="text-[13px] text-[#6B756A]">{property.agent.brokerage}</div>
                </div>
              </div>
              {property.agent.is_verified && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#ECF6EC] px-3 py-1 text-[12px] font-semibold text-[#2F6B3A]">
                  Verified agent
                </div>
              )}
              {property.agent.phone && (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="mt-3 block text-center text-[14px] font-semibold text-[#2F6B3A] hover:text-[#1E241E]"
                >
                  Call {property.agent.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-spy nav */}
      <div className="sticky top-0 z-20 mt-8 border-b border-[#E4EAE0] bg-[#F3F6F1]/[.96] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] gap-7 overflow-x-auto px-6 md:px-12">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => scrollToSection(s)}
              className="whitespace-nowrap border-b-2 py-4 text-[15px] font-semibold"
              style={{
                borderColor: activeSection === s ? '#1E241E' : 'transparent',
                color: activeSection === s ? '#1E241E' : '#6B756A'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <div className="flex min-w-0 flex-col gap-14">
            {/* Overview */}
            <section ref={registerSection('Overview')} data-section="Overview">
              <h2 className="font-serif text-[24px] font-bold">About this {property.type}</h2>
              {property.description ? (
                <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.65] text-[#3D473C]">
                  {property.description}
                </p>
              ) : (
                <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.65] text-[#6B756A]">
                  {property.address} is a {property.type} in {property.neighborhood.name},{' '}
                  {property.neighborhood.city}, listed by {property.agent.name} of{' '}
                  {property.agent.brokerage}.
                </p>
              )}
              <div className="mt-4 text-[13.5px] font-semibold text-[#6B756A]">
                {daysListed} {daysListed === 1 ? 'day' : 'days'} listed
              </div>
            </section>

            {/* Facts & Features */}
            <section ref={registerSection('Facts & Features')} data-section="Facts & Features">
              <h2 className="font-serif text-[22px] font-bold">Facts and Features</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {(
                  [
                    ['Property type', property.type],
                    ['Status', STATUS_LABELS[status]],
                    ['Address', property.address],
                    ['Neighbourhood', property.neighborhood.name],
                    ['City', property.neighborhood.city],
                    property.year_built ? ['Year built', String(property.year_built)] : null,
                    property.lot_size_sqft ? ['Lot size', formatArea(property.lot_size_sqft)] : null,
                    isPlot
                      ? ['Plot size', property.plot_size]
                      : ['Covered area', formatArea(property.sqft)]
                  ].filter(Boolean) as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-[#EDF1EA] py-2.5 text-[14px]">
                    <dt className="text-[#6B756A]">{label}</dt>
                    <dd className="font-semibold text-[#1E241E]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Tax History */}
            <section ref={registerSection('Tax History')} data-section="Tax History">
              <h2 className="font-serif text-[22px] font-bold">Tax History</h2>
              {property.tax_history.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-[14px] border border-[#E4EAE0]">
                  <table className="w-full text-left text-[14px]">
                    <thead>
                      <tr className="bg-[#F1F5EF] font-mono text-[11px] uppercase tracking-[.1em] text-[#6B756A]">
                        <th className="px-4 py-3 font-medium">Year</th>
                        <th className="px-4 py-3 text-right font-medium">Tax paid</th>
                        <th className="px-4 py-3 text-right font-medium">Assessed value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.tax_history.map((h) => (
                        <tr key={h.id} className="border-t border-[#EDF1EA]">
                          <td className="px-4 py-3 text-[#3D473C]">{h.year}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#1E241E]">
                            Rs {Number(h.tax_paid_lac).toLocaleString('en-US')} Lac
                          </td>
                          <td className="px-4 py-3 text-right text-[#3D473C]">
                            {h.assessed_value_lac != null ? money(h.assessed_value_lac) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-[14px] text-[#6B756A]">No tax history recorded yet.</p>
              )}
            </section>

            {/* Price History */}
            <section ref={registerSection('Price History')} data-section="Price History">
              <h2 className="font-serif text-[22px] font-bold">Price History</h2>
              <p className="mt-2 max-w-[60ch] text-[14px] text-[#6B756A]">
                Every listed price and price change we've tracked for this {property.type}.
              </p>
              {property.price_history.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-[14px] border border-[#E4EAE0]">
                  <table className="w-full text-left text-[14px]">
                    <thead>
                      <tr className="bg-[#F1F5EF] font-mono text-[11px] uppercase tracking-[.1em] text-[#6B756A]">
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Event</th>
                        <th className="px-4 py-3 text-right font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.price_history.map((h) => (
                        <tr key={h.id} className="border-t border-[#EDF1EA]">
                          <td className="px-4 py-3 text-[#3D473C]">
                            {new Date(h.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1E241E]">
                            {EVENT_LABELS[h.event]}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-[#1E241E]">
                            {money(h.price_lac)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-[14px] text-[#6B756A]">No price history recorded yet.</p>
              )}
            </section>

            {/* Nearby Schools */}
            <section ref={registerSection('Nearby Schools')} data-section="Nearby Schools">
              <h2 className="font-serif text-[22px] font-bold">Nearby Schools</h2>
              {nearbySchools.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {nearbySchools.map((school) => {
                    const Card = school.website ? 'a' : 'div'
                    return (
                      <Card
                        key={school.id}
                        {...(school.website
                          ? { href: school.website, target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-start gap-3 rounded-[14px] border border-[#E4EAE0] bg-white p-4 transition-shadow hover:shadow-[0_12px_28px_-18px_rgba(30,36,30,.35)]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ECF6EC]">
                          <SchoolIcon />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-semibold group-hover:text-[#2F6B3A]">
                            {school.name}
                          </div>
                          <div className="mt-1 text-[12.5px] text-[#6B756A]">
                            Grades {school.grade_levels}
                            {school.distance_km != null && <> · {school.distance_km} km</>}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-4 text-[14px] text-[#6B756A]">No nearby schools on record.</p>
              )}
            </section>

            {/* Nearby Hospitals */}
            <section ref={registerSection('Nearby Hospitals')} data-section="Nearby Hospitals">
              <h2 className="font-serif text-[22px] font-bold">Nearby Hospitals</h2>
              {nearbyHospitals.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {nearbyHospitals.map((hospital) => {
                    const Card = hospital.website ? 'a' : 'div'
                    return (
                      <Card
                        key={hospital.id}
                        {...(hospital.website
                          ? { href: hospital.website, target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-start gap-3 rounded-[14px] border border-[#E4EAE0] bg-white p-4 transition-shadow hover:shadow-[0_12px_28px_-18px_rgba(30,36,30,.35)]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEBE9]">
                          <HospitalIcon />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-semibold group-hover:text-[#C0463E]">
                            {hospital.name}
                          </div>
                          <div className="mt-1 text-[12.5px] text-[#6B756A]">
                            {hospital.specialty}
                            {hospital.distance_km != null && <> · {hospital.distance_km} km</>}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-4 text-[14px] text-[#6B756A]">No nearby hospitals on record.</p>
              )}
            </section>

            {/* Payment Calculator */}
            <section ref={registerSection('Payment Calculator')} data-section="Payment Calculator">
              <h2 className="font-serif text-[22px] font-bold">Payment Breakdown</h2>
              <p className="mt-2 max-w-[60ch] text-[14px] text-[#6B756A]">
                A rough estimate assuming 20% down, an 8% annual rate, over 20 years.
              </p>
              <div className="mt-4 overflow-hidden rounded-[14px] border border-[#E4EAE0] bg-white">
                {[
                  ['Principal & interest', `Rs ${monthly.pi.toLocaleString('en-US')}`],
                  ['Property taxes (est.)', `Rs ${monthly.taxes.toLocaleString('en-US')}`],
                  ['Home insurance (est.)', `Rs ${monthly.insurance.toLocaleString('en-US')}`]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-[#EDF1EA] px-5 py-4 text-[14.5px] last:border-b-0"
                  >
                    <span>{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-[#F1F5EF] px-5 py-4 text-[15px] font-bold">
                  <span>Estimated monthly total</span>
                  <span>Rs {estMonthly.toLocaleString('en-US')}</span>
                </div>
              </div>
              <p className="mt-4 text-[12.5px] text-[#8A948A]">
                This is a simple estimate for informational purposes only. Actual amounts may vary
                — contact the agent or a lender for a real quote.
              </p>
            </section>

            {/* Neighbourhood */}
            <section ref={registerSection('Neighbourhood')} data-section="Neighbourhood">
              <h2 className="font-serif text-[22px] font-bold">
                Neighborhood: {property.neighborhood.name}
              </h2>
              {lat != null && lng != null && (
                <PropertyMap
                  latitude={lat}
                  longitude={lng}
                  label={property.address}
                  className="mt-4 h-[420px] w-full overflow-hidden rounded-[16px] border border-[#E4EAE0]"
                />
              )}
            </section>
          </div>
          <div className="hidden lg:block" />
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="font-serif text-[26px] font-bold">Nearby Homes</h2>
            <div className="mt-5 grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
              {similar.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="group block overflow-hidden rounded-[18px] border border-[#E4EAE0] bg-white shadow-[0_12px_28px_-22px_rgba(30,36,30,.3)] transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative h-[160px] overflow-hidden bg-[#EDF1EA]">
                    {p.cover_image_url && (
                      <Image
                        src={p.cover_image_url}
                        alt={p.address}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    )}
                  </div>
                  <div className="px-4 py-3.5">
                    <div className="text-[17px] font-bold">{money(p.price_lac)}</div>
                    <div className="mt-1 text-[13.5px] font-medium text-[#2C352C]">{p.address}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ContactAgentModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        address={property.address}
        agentName={property.agent.name}
      />
    </div>
  )
}
