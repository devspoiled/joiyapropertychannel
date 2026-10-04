import type { Agent } from '@frontend/types/api'
import Image from 'next/image'

export function FounderSection({ founder }: { founder: Agent }) {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-2 md:items-center md:gap-20">
        <div className="order-2 md:order-1">
          <h2 className="font-sans text-[36px] font-extrabold tracking-[-.015em] text-[#1E241E] md:text-[44px]">
            {founder.designation || 'Founder & Owner'}
          </h2>
          {founder.bio && (
            <p className="mt-5 max-w-[480px] text-[15.5px] leading-[1.7] text-[#6B756A]">
              {founder.bio}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
            {founder.phone
              ?.split(',')
              .map((number) => number.trim())
              .filter(Boolean)
              .map((number) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-2.5 text-[15px] font-semibold text-[#1E241E] hover:text-[#2F6B3A]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDF1EA] text-[#2F6B3A]">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 3h2.8l1.2 3.4-1.7 1.3a9 9 0 0 0 4.5 4.5l1.3-1.7 3.4 1.2v2.8a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3z"
                      />
                    </svg>
                  </span>
                  {number}
                </a>
              ))}
            {founder.email && (
              <a
                href={`mailto:${founder.email}`}
                className="flex items-center gap-2.5 text-[15px] font-semibold text-[#1E241E] hover:text-[#2F6B3A]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDF1EA] text-[#2F6B3A]">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5.5h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3 6 7 5 7-5" />
                  </svg>
                </span>
                {founder.email}
              </a>
            )}
          </div>

          {founder.experience_highlights.length > 0 && (
            <>
              <div className="mt-9 border-t border-[#E2E8DE] pt-9">
                <h3 className="font-sans text-[26px] font-extrabold tracking-[-.01em] text-[#1E241E] md:text-[30px]">
                  {founder.name} Experience
                </h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {founder.experience_highlights.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F6B3A] text-white">
                        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" />
                        </svg>
                      </span>
                      <span className="text-[14.5px] leading-[1.6] text-[#3D473C]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="order-1 relative mx-auto w-full max-w-[420px] md:order-2">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4E9E5C] to-[#1E3B24] pb-[88px]">
            <div className="relative aspect-[4/5] w-full">
              {founder.photo_url && (
                <Image
                  src={founder.photo_url}
                  alt={founder.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div className="absolute inset-x-6 bottom-6 rounded-[16px] bg-white px-5 py-4 text-center shadow-[0_14px_30px_-16px_rgba(30,36,30,.4)]">
            <div className="font-serif text-[20px] text-[#1E241E]">{founder.name}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
