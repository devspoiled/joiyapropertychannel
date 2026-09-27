'use client'

import { useState } from 'react'

export function ContactAgentModal({
  open,
  onClose,
  address,
  agentName
}: {
  open: boolean
  onClose: () => void
  address: string
  agentName: string
}) {
  const [wantsFinancing, setWantsFinancing] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1E241E]/[.44] p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_60px_-24px_rgba(30,36,30,.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EDF1EA] px-6 py-5">
          <h2 className="font-serif text-[20px] font-bold">Contact {agentName}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B756A] hover:bg-[#F1F5EF]"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="text-[16px] font-semibold text-[#1E241E]">Message sent</div>
            <p className="mt-2 text-[14px] text-[#6B756A]">
              {agentName} will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#1E241E] px-6 py-2.5 text-[14px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A]"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4 px-6 py-5"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <label className="block">
              <div className="mb-1.5 text-[13.5px] font-semibold">
                Name<span className="text-[#C0463E]">*</span>
              </div>
              <input
                required
                type="text"
                className="w-full rounded-[10px] border border-[#D3DBD0] px-3.5 py-2.5 text-[14px] outline-none focus:border-[#1E241E]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13.5px] font-semibold">
                Phone<span className="text-[#C0463E]">*</span>
              </div>
              <input
                required
                type="tel"
                className="w-full rounded-[10px] border border-[#D3DBD0] px-3.5 py-2.5 text-[14px] outline-none focus:border-[#1E241E]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13.5px] font-semibold">
                Email<span className="text-[#C0463E]">*</span>
              </div>
              <input
                required
                type="email"
                className="w-full rounded-[10px] border border-[#D3DBD0] px-3.5 py-2.5 text-[14px] outline-none focus:border-[#1E241E]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13.5px] font-semibold">Message</div>
              <textarea
                rows={3}
                defaultValue={`I am interested in ${address}.`}
                className="w-full resize-none rounded-[10px] border border-[#D3DBD0] px-3.5 py-2.5 text-[14px] outline-none focus:border-[#1E241E]"
              />
            </label>

            <button
              type="submit"
              className="mt-1 rounded-full bg-[#1E241E] px-5 py-3 text-[14.5px] font-semibold text-[#F3F6F1] hover:bg-[#2F6B3A]"
            >
              Send message
            </button>

            <label className="flex items-start gap-2.5 text-[13px] text-[#3D473C]">
              <input
                type="checkbox"
                checked={wantsFinancing}
                onChange={(e) => setWantsFinancing(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D3DBD0] accent-[#1E241E]"
              />
              I want financing information
            </label>

            <p className="text-[11.5px] leading-[1.5] text-[#8A948A]">
              By sending, you agree that Joiya Property Channel and this listing's agent may
              contact you about your inquiry, including by phone, text, or email. Message and
              data rates may apply.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
