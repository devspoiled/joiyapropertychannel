'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const PROPERTY_TYPES = [
  { value: '', label: 'Any type' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' }
]

const PRICE_CAPS = [
  { value: '', label: 'Any price' },
  { value: '50', label: 'Under 50 Lac' },
  { value: '100', label: 'Under 1 Cr' },
  { value: '250', label: 'Under 2.5 Cr' },
  { value: '500', label: 'Under 5 Cr' }
]

const BED_MINS = [
  { value: '', label: 'Any beds' },
  { value: '1', label: '1+ bed' },
  { value: '2', label: '2+ beds' },
  { value: '3', label: '3+ beds' },
  { value: '4', label: '4+ beds' }
]

function FilterDropdown({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const active = value !== ''
  const current = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold transition-colors ${
          active
            ? 'border-[#1E241E] bg-[#1E241E] text-[#F3F6F1]'
            : 'border-[#D9E0D5] bg-white text-[#2C352C] hover:border-[#1E241E]'
        }`}
      >
        {current.label}
        <svg
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${
            active ? 'text-[#A8E6AE]' : 'text-[#6B756A]'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[180px] overflow-hidden rounded-[14px] border border-[#E4EAE0] bg-white py-1.5 shadow-[0_18px_40px_-14px_rgba(30,36,30,.32)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13.5px] ${
                o.value === value
                  ? 'bg-[#EDF1EA] font-semibold text-[#1E241E]'
                  : 'text-[#3D473C] hover:bg-[#F3F6F1]'
              }`}
            >
              {o.label}
              {o.value === value && (
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#2F6B3A]" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4 10.5 4 4 8-9" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ListingsFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('city') ?? '')

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/listings${params.toString() ? `?${params}` : ''}`)
  }

  const activeCount = ['type', 'price_max', 'beds'].filter((k) => searchParams.get(k)).length

  return (
    <div className="border-b border-[#E2E8DE] bg-[#F3F6F1]/[.92] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-5 px-4 py-3 lg:px-6">
        <a href="/" className="flex shrink-0 items-center">
          <Image src="/logo-mark.png" alt="Joiya Property Channel" width={1284} height={790} className="h-[40px] w-auto" unoptimized />
        </a>

        <div className="hidden h-8 w-px bg-[#DCE3D8] lg:block" />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setParam('city', q)
          }}
          className="flex h-10 min-w-0 max-w-[280px] flex-1 items-center gap-2 rounded-full border border-[#D9E0D5] bg-white px-4 focus-within:border-[#1E241E]"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#6B756A]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="6" />
            <path strokeLinecap="round" d="m17 17-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="City or neighborhood"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#1E241E] outline-none placeholder:text-[#8A948A]"
          />
        </form>

        <div className="hidden items-center gap-2.5 lg:flex">
          <FilterDropdown
            label="Property type"
            value={searchParams.get('type') ?? ''}
            options={PROPERTY_TYPES}
            onChange={(v) => setParam('type', v)}
          />
          <FilterDropdown
            label="Price"
            value={searchParams.get('price_max') ?? ''}
            options={PRICE_CAPS}
            onChange={(v) => setParam('price_max', v)}
          />
          <FilterDropdown
            label="Beds & baths"
            value={searchParams.get('beds') ?? ''}
            options={BED_MINS}
            onChange={(v) => setParam('beds', v)}
          />
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => router.push('/listings')}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#6B756A] hover:text-[#1E241E]"
            >
              Clear filters
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E4EBE1] px-1 font-mono text-[10.5px] text-[#3D473C]">
                {activeCount}
              </span>
            </button>
          )}
        </div>

        <div className="ml-auto shrink-0">
          <button
            type="button"
            className="rounded-full border border-[#1E241E] bg-[#1E241E] px-5 py-2.5 text-[13.5px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A] hover:border-[#2F6B3A]"
          >
            Save search
          </button>
        </div>
      </div>
    </div>
  )
}
