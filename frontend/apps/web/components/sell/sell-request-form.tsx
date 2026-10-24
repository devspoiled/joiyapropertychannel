'use client'

import { sellRequestAction } from '@/actions/sell-request-action'
import { PropertyTypeEnum } from '@frontend/types/api'
import { useState } from 'react'

const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyTypeEnum.HOUSE, label: 'House' },
  { value: PropertyTypeEnum.APARTMENT, label: 'Apartment' },
  { value: PropertyTypeEnum.VILLA, label: 'Villa' },
  { value: PropertyTypeEnum.FARM_HOUSE, label: 'Farm House' },
  { value: PropertyTypeEnum.PLOT, label: 'Plot' }
]

const inputClass =
  'h-11 rounded-[10px] border border-[#D3DBD0] bg-white px-3.5 text-[14px] outline-none focus:border-[#2F6B3A]'

export function SellRequestForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({ lat: '', lng: '' })
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location detection.")
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        })
        setLocating(false)
      },
      () => {
        setLocationError("Couldn't get your location — enter it manually instead.")
        setLocating(false)
      }
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = new FormData(e.currentTarget)
    const ok = await sellRequestAction({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      property_type: form.get('property_type') as PropertyTypeEnum,
      address: String(form.get('address') || ''),
      city: String(form.get('city') || ''),
      demanding_price_lac: Number(form.get('demanding_price_lac') || 0),
      latitude: String(form.get('latitude') || '') || undefined,
      longitude: String(form.get('longitude') || '') || undefined
    })

    if (ok) {
      setStatus('sent')
      e.currentTarget.reset()
      setCoords({ lat: '', lng: '' })
    } else {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-[18px] border border-[#D9E6D4] bg-[#EEF5EC] px-6 py-10 text-center">
        <div className="text-[18px] font-semibold text-[#1E241E]">Request received</div>
        <p className="mt-2 text-[14.5px] text-[#4A5B47]">
          One of our agents will review your property and get in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      {status === 'error' && (
        <div className="rounded-[10px] bg-[#FDEEEE] px-3.5 py-2.5 text-[13.5px] text-[#A3312B]">
          Something went wrong — please check the form and try again.
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <input name="name" type="text" required placeholder="Your name" className={inputClass} />
        <input name="phone" type="tel" required placeholder="Phone number" className={inputClass} />
      </div>

      <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />

      <div className="grid gap-3.5 sm:grid-cols-2">
        <select name="property_type" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Property type
          </option>
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input name="city" type="text" required placeholder="City" className={inputClass} />
      </div>

      <input name="address" type="text" required placeholder="Full address" className={inputClass} />

      <input
        name="demanding_price_lac"
        type="number"
        min={1}
        required
        placeholder="Demanding price (in Lac PKR)"
        className={inputClass}
      />

      <div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <input
            name="latitude"
            type="text"
            placeholder="Latitude (optional)"
            value={coords.lat}
            onChange={(e) => setCoords((c) => ({ ...c, lat: e.target.value }))}
            className={inputClass}
          />
          <input
            name="longitude"
            type="text"
            placeholder="Longitude (optional)"
            value={coords.lng}
            onChange={(e) => setCoords((c) => ({ ...c, lng: e.target.value }))}
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="mt-2 text-[13px] font-semibold text-[#2F6B3A] hover:underline disabled:opacity-60"
        >
          {locating ? 'Detecting your location…' : "Don't know your coordinates? Use my current location"}
        </button>
        {locationError && <p className="mt-1 text-[12.5px] text-[#A3312B]">{locationError}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 rounded-full bg-[#1E241E] px-6 py-3 text-[14.5px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A] disabled:opacity-60"
      >
        {status === 'sending' ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  )
}
