'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Suggestion = {
  id: string
  address: string
  city: string
  neighborhood: string
}

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const boxRef = useRef<HTMLDivElement>(null)

  // ponytail: plain debounce + fetch, add react-query if this screen grows
  // more async state than one search box.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Suggestion[]) => {
          setSuggestions(data)
          setOpen(true)
          setActiveIndex(-1)
        })
        .catch(() => {})
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function goToProperty(s: Suggestion) {
    setOpen(false)
    setQuery(s.address)
    router.push(`/properties/${s.id}`)
  }

  function goToListings() {
    const q = query.trim()
    setOpen(false)
    if (!q) return
    router.push(`/listings?city=${encodeURIComponent(q)}`)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') goToListings()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0) goToProperty(suggestions[activeIndex])
      else goToListings()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative mt-8 w-full max-w-[640px] md:mt-11">
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B756A]"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Enter a city, neighbourhood or address"
          aria-label="Enter a city, neighbourhood or address"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          className="h-16 w-full rounded-2xl border border-[#D3DBD0] bg-white pl-14 pr-32 text-[16px] font-medium text-[#1E241E] shadow-[0_20px_40px_-20px_rgba(30,36,30,.35)] outline-none placeholder:text-[#8A948A] focus:border-[#2F6B3A] md:text-[17px]"
        />
        <button
          type="button"
          onClick={goToListings}
          className="absolute right-2.5 top-1/2 h-11 -translate-y-1/2 rounded-xl bg-[#1E241E] px-5 text-[14px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A]"
        >
          Search
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 max-h-[210px] animate-[suggestFadeIn_.16s_ease-out] overflow-y-auto rounded-2xl border border-[#E2E8DE] bg-white p-2 text-left shadow-[0_24px_48px_-20px_rgba(30,36,30,.4)]">
          <style>{`
            @keyframes suggestFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          {suggestions.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                ref={(el) => {
                  if (i === activeIndex) el?.scrollIntoView({ block: 'nearest' })
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToProperty(s)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === activeIndex ? 'bg-[#EDF1EA]' : 'hover:bg-[#F3F6F1]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    i === activeIndex ? 'bg-[#1E241E] text-[#A8E6AE]' : 'bg-[#EDF1EA] text-[#6B756A]'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 1 1 13 0c0 5.3-6.5 11-6.5 11Z"
                    />
                    <circle cx="12" cy="10" r="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold text-[#1E241E]">{s.address}</span>
                  <span className="block truncate text-[12.5px] text-[#6B756A]">
                    {s.neighborhood}, {s.city}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
