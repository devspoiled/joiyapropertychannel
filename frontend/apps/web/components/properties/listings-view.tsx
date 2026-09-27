'use client'

import type { PropertyCard } from '@frontend/types/api'
import { PropertyCardItem } from '@/components/properties/property-card-item'
import { ListingsMap } from '@/components/properties/listings-map'
import { ListingsFilterBar } from '@/components/properties/listings-filter-bar'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function useFavorites() {
  const [favs, setFavs] = useState<Record<string, boolean>>({})
  const toggleFav = (id: string) => setFavs((f) => ({ ...f, [id]: !f[id] }))
  return { favs, toggleFav }
}

function pageHref(page: number) {
  return page <= 1 ? '/listings' : `/listings?page=${page}`
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter()
  if (totalPages <= 1) return null

  // ponytail: simple window of up to 5 page numbers around current — no
  // ellipsis/first-last-pinning logic, add if listings grow past a few hundred pages.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => router.push(pageHref(page - 1))}
        className="flex h-9 min-w-9 items-center justify-center rounded-full border border-[#E4EAE0] px-3 text-[13.5px] font-semibold text-[#2C352C] disabled:opacity-35 hover:not-disabled:bg-[#EDF1EA]"
      >
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => router.push(pageHref(p))}
          className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13.5px] font-semibold ${
            p === page ? 'bg-[#1E241E] text-[#F3F6F1]' : 'text-[#2C352C] hover:bg-[#EDF1EA]'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => router.push(pageHref(page + 1))}
        className="flex h-9 min-w-9 items-center justify-center rounded-full border border-[#E4EAE0] px-3 text-[13.5px] font-semibold text-[#2C352C] disabled:opacity-35 hover:not-disabled:bg-[#EDF1EA]"
      >
        Next →
      </button>
    </div>
  )
}

export function ListingsView({
  properties,
  totalCount,
  page,
  totalPages
}: {
  properties: PropertyCard[]
  totalCount: number
  page: number
  totalPages: number
}) {
  const { favs, toggleFav } = useFavorites()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="joiya-root flex h-screen flex-col">
      <ListingsFilterBar />

      <div className="mx-auto flex w-full max-w-[1600px] items-baseline justify-between gap-4 px-4 py-4 lg:px-6">
        <h1 className="text-[19px] font-bold text-[#1E241E]">
          {totalCount.toLocaleString('en-US')} results
        </h1>
        <span className="font-mono text-[12.5px] text-[#6B756A]">
          Page {page} of {totalPages}
        </span>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-5 px-4 pb-4 lg:px-6">
        <div className="hidden w-[55%] shrink-0 overflow-hidden rounded-[18px] border border-[#E4EAE0] lg:block">
          <ListingsMap
            properties={properties}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={(id) => router.push(`/properties/${id}`)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {properties.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId((h) => (h === p.id ? null : h))}
              >
                <PropertyCardItem property={p} faved={!!favs[p.id]} onToggleFav={toggleFav} />
              </div>
            ))}
          </div>
          {properties.length === 0 && (
            <div className="py-16 text-center text-[14.5px] text-[#6B756A]">
              No listings found.
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}
