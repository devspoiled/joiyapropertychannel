import type { Agent } from '@frontend/types/api'
import Image from 'next/image'

function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

export function AgentsSection({ agents: allAgents }: { agents: Agent[] }) {
  const agents = allAgents.filter((a) => !a.is_founder)
  if (agents.length === 0) return null

  const verifiedCount = agents.filter((a) => a.is_verified).length
  const totalListings = agents.reduce((sum, a) => sum + (a.listing_count || 0), 0)

  return (
    <section id="agents" className="border-t border-[#E2E8DE] px-6 py-20 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-[620px] text-center">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[.16em] text-[#4E9E5C]">
            Our agent
          </div>
          <h2 className="mt-2.5 font-sans text-[34px] font-extrabold tracking-[-.015em] text-[#1E241E] md:text-[42px]">
            Professional Agent
          </h2>
          <p className="mx-auto mt-3.5 text-[15px] leading-[1.65] text-[#6B756A]">
            Verified, local experts who know every block, plot, and price in their patch.
          </p>

          <div className="mx-auto mt-8 flex w-fit items-center gap-8 rounded-full border border-[#E2E8DE] bg-white px-8 py-3.5 shadow-[0_8px_24px_-16px_rgba(30,36,30,.3)]">
            <div className="text-center">
              <div className="font-sans text-[20px] font-extrabold text-[#1E241E]">{verifiedCount}</div>
              <div className="font-mono text-[10px] uppercase tracking-[.08em] text-[#8A948A]">Verified</div>
            </div>
            <div className="h-7 w-px bg-[#E2E8DE]" />
            <div className="text-center">
              <div className="font-sans text-[20px] font-extrabold text-[#1E241E]">{totalListings}</div>
              <div className="font-mono text-[10px] uppercase tracking-[.08em] text-[#8A948A]">
                Active listings
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group relative rounded-[22px] bg-[#EDF1EA] pt-5 transition-transform duration-300 ease-[cubic-bezier(.22,.8,.3,1)] hover:-translate-y-1.5"
            >
              <div className="relative mx-auto aspect-[3/4] w-[88%] overflow-hidden rounded-[16px] bg-[#DCE4D8] shadow-[0_18px_32px_-18px_rgba(30,36,30,.35)]">
                {agent.photo_url ? (
                  <Image
                    src={agent.photo_url}
                    alt={agent.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(.22,.8,.3,1)] group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-serif text-[44px] text-[#A9B5A5]">
                    {agent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                )}

                {agent.is_verified && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/[.95] px-2.5 py-1 text-[10px] font-bold text-[#2F6B3A] shadow-[0_4px_12px_-6px_rgba(30,36,30,.4)]">
                    <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="currentColor">
                      <path d="M10 1.5 12.2 5l4.1.6-3 2.9.7 4.1L10 10.7 6.2 12.6l.7-4.1-3-2.9L8 5z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              {/* Name pill straddling the photo/card seam */}
              <div className="relative z-10 -mt-6 px-5">
                <div className="rounded-[14px] bg-white px-4 py-3 text-center shadow-[0_10px_24px_-14px_rgba(30,36,30,.35)]">
                  <div className="font-serif text-[18px] leading-tight text-[#1E241E]">{agent.name}</div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 text-center">
                {agent.designation && (
                  <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.1em] text-[#2F6B3A]">
                    {agent.designation}
                  </div>
                )}
                <div className="mt-1.5 flex items-center justify-center gap-2 text-[12px] text-[#6B756A]">
                  {agent.brokerage && <span className="truncate">{agent.brokerage}</span>}
                  {agent.brokerage && agent.listing_count > 0 && <span>·</span>}
                  {agent.listing_count > 0 && <span>{agent.listing_count} active</span>}
                </div>

                {agent.phone && (
                  <a
                    href={telHref(agent.phone)}
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#1E241E] text-[13px] font-semibold text-[#F3F6F1] transition-colors hover:bg-[#2F6B3A]"
                  >
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 3h2.8l1.2 3.4-1.7 1.3a9 9 0 0 0 4.5 4.5l1.3-1.7 3.4 1.2v2.8a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3z"
                      />
                    </svg>
                    {agent.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
