'use client'

import { contactAction } from '@/actions/contact-action'
import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = new FormData(e.currentTarget)
    const ok = await contactAction({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      message: String(form.get('message') || '')
    })

    if (ok) {
      setStatus('sent')
      e.currentTarget.reset()
    } else {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-[18px] border border-[#D9E6D4] bg-[#EEF5EC] px-6 py-8 text-center">
        <div className="text-[16px] font-semibold text-[#1E241E]">Message sent</div>
        <p className="mt-2 text-[14px] text-[#4A5B47]">We&apos;ll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      {status === 'error' && (
        <div className="rounded-[10px] bg-[#FDEEEE] px-3.5 py-2.5 text-[13.5px] text-[#A3312B]">
          Something went wrong — please try again.
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="h-11 rounded-[10px] border border-[#D3DBD0] bg-white px-3.5 text-[14px] outline-none focus:border-[#2F6B3A]"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          className="h-11 rounded-[10px] border border-[#D3DBD0] bg-white px-3.5 text-[14px] outline-none focus:border-[#2F6B3A]"
        />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className="h-11 rounded-[10px] border border-[#D3DBD0] bg-white px-3.5 text-[14px] outline-none focus:border-[#2F6B3A]"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="How can we help?"
        className="resize-none rounded-[10px] border border-[#D3DBD0] bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-[#2F6B3A]"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 rounded-full bg-[#1E241E] px-6 py-3 text-[14.5px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A] disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
