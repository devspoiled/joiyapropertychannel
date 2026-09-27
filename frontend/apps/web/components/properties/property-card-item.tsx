'use client'

import type { PropertyCard } from '@frontend/types/api'
import { StatusEnum } from '@frontend/types/api'
import { formatArea, money, STATUS_COLORS, STATUS_LABELS } from '@/lib/property'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function PropertyCardItem({
  property: p,
  faved,
  onToggleFav
}: {
  property: PropertyCard
  faved: boolean
  onToggleFav: (id: string) => void
}) {
  const status = p.status ?? StatusEnum.FOR_SALE
  const [statusBg, statusFg] = STATUS_COLORS[status]
  const isPlot = p.beds == null || p.baths == null || p.sqft == null

  const photos = p.image_urls?.length ? p.image_urls : p.cover_image_url ? [p.cover_image_url] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  const hasMultiple = photos.length > 1

  function step(delta: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((i) => (i + delta + photos.length) % photos.length)
  }

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-[18px] border border-[#E4EAE0] bg-white shadow-[0_12px_28px_-22px_rgba(30,36,30,.3)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,.8,.3,1)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-22px_rgba(30,36,30,.34)]"
    >
      <div className="relative h-[168px] overflow-hidden bg-[#EDF1EA]">
        {photos.length > 0 ? (
          <Image
            key={photoIndex}
            src={photos[photoIndex]}
            alt={p.address}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #E4EBE1 0px, #E4EBE1 9px, #DAE3D6 9px, #DAE3D6 18px)'
            }}
          />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className="rounded-[7px] px-[10px] py-[5px] text-[11.5px] font-bold tracking-[.02em]"
            style={{ background: statusBg, color: statusFg }}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onToggleFav(p.id)
          }}
          aria-label={(faved ? 'Remove ' : 'Save ') + p.address}
          className="absolute right-2.5 top-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[.92] shadow-[0_4px_12px_-6px_rgba(30,36,30,.5)] transition-transform hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px] transition-colors"
            fill={faved ? '#2F6B3A' : 'none'}
            stroke={faved ? '#2F6B3A' : '#8A948A'}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 3.5 8 2.8 10.3 4 12 6.3 13.7 4 16 2.8 18.5 3.5 22 4.5 23.5 8 22 11.3c-2.5 4.6-10 9.2-10 9.2z"
            />
          </svg>
        </button>
        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => step(-1, e)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/0 text-white opacity-0 transition-opacity group-hover:bg-white/[.85] group-hover:text-[#1E241E] group-hover:opacity-100"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5 7.5 10l5 5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => step(1, e)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/0 text-white opacity-0 transition-opacity group-hover:bg-white/[.85] group-hover:text-[#1E241E] group-hover:opacity-100"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
              </svg>
            </button>
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-[5px] w-[5px] rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        {!!p.image_count && (
          <div className="absolute bottom-2.5 right-2.5 rounded-[7px] bg-[#1E241E]/[.72] px-[9px] py-1 font-mono text-[11px] text-[#F3F6F1] transition-opacity group-hover:opacity-0">
            {p.image_count} photos
          </div>
        )}
      </div>
      <div className="px-[17px] pb-[15px] pt-3.5">
        <div className="text-[21px] font-bold tracking-[-.01em]">{money(p.price_lac)}</div>
        <div className="mt-[7px] truncate whitespace-nowrap text-[13.5px] text-[#6B756A]">
          {p.address}, {p.neighborhood.city}
        </div>
        <div className="mt-[13px] flex gap-3.5 border-t border-[#EDF1EA] pt-[13px] text-[13px] text-[#3D473C]">
          {!isPlot ? (
            <>
              <span>
                <strong className="font-bold">{p.beds}</strong> bd
              </span>
              <span>
                <strong className="font-bold">{p.baths}</strong> ba
              </span>
              <span>{formatArea(p.sqft)}</span>
            </>
          ) : (
            <span>
              <strong className="font-bold">{p.plot_size}</strong> plot
            </span>
          )}
        </div>
        <div className="mt-3 truncate whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[.04em] text-[#8A948A]">
          Listed by: {p.agent.brokerage || p.agent.name}
        </div>
      </div>
    </Link>
  )
}
