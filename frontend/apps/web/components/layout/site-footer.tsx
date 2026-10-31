const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M13.5 9.2h1.3V7h-1.3c-1.4 0-2.5 1.1-2.5 2.5v1.3H9.7v2.1H11V17h2.1v-4.1h1.5l.4-2.1h-1.9V9.7c0-.28.22-.5.5-.5z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
      </svg>
    )
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="7.7" cy="8" r="1" fill="currentColor" />
        <path d="M7.7 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M11.5 17v-3.8c0-1.2.9-2.2 2.1-2.2s2.1 1 2.1 2.2V17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M11.5 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M14 4v9.8a2.8 2.8 0 1 1-2.2-2.73M14 4c.3 2 1.7 3.4 3.7 3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1E241E] px-6 pb-9 pt-11 text-[#D6DED3] md:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:justify-between sm:gap-16">
        <div className="max-w-[320px]">
          <div className="font-serif text-[26px] text-[#F3F6F1]">Joiya Property Channel</div>
          <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[#9BA898]">
            Discover places worth calling home. Lahore — verified listings, real agents.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3D473C] text-[#D6DED3] hover:border-[#4E9E5C] hover:text-[#A8E6AE]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-12 text-[13.5px] sm:gap-16">
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Discover</div>
            <a href="/#buy" className="text-[#D6DED3]">Buy</a>
            <a href="/#rent" className="text-[#D6DED3]">Rent</a>
            <a href="/#new" className="text-[#D6DED3]">New construction</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Sell</div>
            <a href="/agents" className="text-[#D6DED3]">Find an agent</a>
            <a href="/#pricing" className="text-[#D6DED3]">Pricing tool</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Company</div>
            <a href="/#about" className="text-[#D6DED3]">About</a>
            <a href="/#contact" className="text-[#D6DED3]">Contact</a>
            <a href="/#careers" className="text-[#D6DED3]">Careers</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-[#9BA898]">Get in touch</div>
            <a href="tel:03333030124" className="text-[#D6DED3]">0333 3030124</a>
            <a href="tel:03067864121" className="text-[#D6DED3]">0306 7864121</a>
            <a href="mailto:M.asifkhan3030143@gmail.com" className="text-[#D6DED3]">M.asifkhan3030143@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
