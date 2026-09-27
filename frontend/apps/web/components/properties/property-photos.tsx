'use client'

import type { Property } from '@frontend/types/api'
import { formatArea, money } from '@/lib/property'
import Image from 'next/image'
import Link from 'next/link'

export function PropertyPhotos({ property }: { property: Property }) {
  const gallery =
    property.images.length > 0
      ? property.images
      : property.cover_image_url
        ? [{ id: 0, url: property.cover_image_url, order: 0 }]
        : []
  const isPlot = property.beds == null || property.baths == null || property.sqft == null

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

      {/* Header */}
      <header className="border-b border-[#E2E8DE] bg-[#F3F6F1] px-6 py-4 md:px-12">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6">
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#3D473C] hover:text-[#1E241E]"
          >
            ← Back to listing
          </Link>
          <Link href="/" className="flex items-center">
            <Image src="/logo-mark.png" alt="Joiya Property Channel" width={1284} height={790} className="h-[36px] w-auto" unoptimized />
          </Link>
          <div className="w-[110px]" />
        </div>
      </header>

      {/* Summary + gallery */}
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {gallery.map((img, i) => (
              <div
                key={img.id}
                className={`relative w-full overflow-hidden bg-[#EDF1EA] ${i === 0 ? 'h-[280px] rounded-[14px] sm:h-[460px]' : 'mt-3 h-[220px] rounded-[12px] sm:h-[400px]'}`}
              >
                <Image
                  src={img.url}
                  alt={`${property.address} — photo ${i + 1}`}
                  fill
                  unoptimized
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="flex h-[300px] items-center justify-center rounded-[14px] bg-[#EDF1EA] text-[14px] text-[#6B756A]">
                No photos available
              </div>
            )}
          </div>

          {/* Sidebar summary, persists while scrolling photos */}
          <div>
            <div className="lg:sticky lg:top-8">
              <div className="font-serif text-[28px] font-bold leading-none">
                {money(property.price_lac)}
              </div>
              <div className="mt-2 flex gap-4 text-[14px]">
                {!isPlot ? (
                  <>
                    <span>
                      <strong className="font-bold">{property.beds}</strong> bd
                    </span>
                    <span>
                      <strong className="font-bold">{property.baths}</strong> ba
                    </span>
                    <span>{formatArea(property.sqft)}</span>
                  </>
                ) : (
                  <span>
                    <strong className="font-bold">{property.plot_size}</strong> plot
                  </span>
                )}
              </div>
              <div className="mt-3 text-[15px] font-medium text-[#2C352C]">{property.address}</div>
              <div className="text-[14px] text-[#6B756A]">{property.neighborhood.city}</div>

              <button
                type="button"
                className="mt-5 w-full rounded-full bg-[#1E241E] px-5 py-3.5 text-[15px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A]"
              >
                Request a tour
              </button>
              <button
                type="button"
                className="mt-2.5 w-full rounded-full border border-[#D3DBD0] px-5 py-3.5 text-[15px] font-semibold text-[#1E241E] hover:border-[#1E241E]"
              >
                Contact agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
