import { AgentsSection } from '@/components/home/agents-section'
import { FounderSection } from '@/components/home/founder-section'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { getApiClient } from '@/lib/api'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Agents - Joiya Property Channel'
}

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans'
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
})

export default async function AgentsPage() {
  const apiClient = await getApiClient()
  const agentsPage = await apiClient.agents.agentsList()
  const agents = agentsPage.results ?? []
  const founder = agents.find((a) => a.is_founder)

  return (
    <div
      className={twMerge(sans.variable, mono.variable)}
      style={
        {
          '--font-sans-family': sans.style.fontFamily,
          '--font-mono-family': mono.style.fontFamily,
          background: '#F3F6F1',
          color: '#1E241E',
          fontFamily: 'var(--font-sans-family, system-ui), sans-serif'
        } as React.CSSProperties
      }
    >
      <SiteHeader />
      {founder && <FounderSection founder={founder} />}
      <AgentsSection agents={agents} />
      <SiteFooter />
    </div>
  )
}
