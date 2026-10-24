import { SellRequestForm } from '@/components/sell/sell-request-form'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

export const metadata: Metadata = {
  title: 'Sell Your Property - Joiya Property Channel'
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

export default function SellPage() {
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

      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[640px]">
          <div className="text-center">
            <h1 className="font-sans text-[32px] font-extrabold tracking-[-.015em] text-[#1E241E] md:text-[40px]">
              Tell us about your property
            </h1>
            <p className="mx-auto mt-3.5 max-w-[480px] text-[15px] leading-[1.65] text-[#6B756A]">
              Share the details below and one of our verified agents will review your listing and
              reach out to help you sell.
            </p>
          </div>

          <div className="mt-10 rounded-[20px] border border-[#E2E8DE] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(30,36,30,.2)] md:p-8">
            <SellRequestForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
