'use client'

import { GoogleIcon } from '@/components/auth/google-icon'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

export function AuthModal({
  onClose,
  onAuthenticated
}: {
  onClose: () => void
  onAuthenticated: () => void
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setIsLoading(true)

    const { error } =
      mode === 'signup'
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password })

    setIsLoading(false)

    if (error) {
      setError(error.message)
    } else {
      onAuthenticated()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14181490] p-4 backdrop-blur-sm"
      style={{ animation: 'joiya-fade .18s ease-out' }}
      onClick={onClose}
    >
      <style>{`
        @keyframes joiya-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes joiya-pop { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      <div
        className="w-full max-w-[380px] rounded-[28px] bg-[#F3F6F1] p-8 shadow-[0_32px_80px_-24px_rgba(20,24,20,.45)]"
        style={{ animation: 'joiya-pop .22s cubic-bezier(.22,.8,.3,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <h2 className="font-sans text-[22px] font-extrabold tracking-[-.01em] text-[#1E241E]">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 -mt-1 flex h-7 w-7 items-center justify-center rounded-full text-[#8A948A] transition-colors hover:bg-[#F0F3EE] hover:text-[#1E241E]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <p className="mb-5 text-[13.5px] leading-snug text-[#6B756A]">
          {mode === 'signup'
            ? 'Sign up to save properties and contact agents.'
            : 'Sign in to continue to your account.'}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-[#FDEEEE] px-3.5 py-2.5 text-[13px] text-[#A3312B]">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/' })}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-[#E2E8DE] bg-white text-[14px] font-semibold text-[#1E241E] shadow-[0_1px_2px_rgba(20,24,20,.06)] transition-all hover:border-[#C7D0C2] hover:shadow-[0_4px_14px_-4px_rgba(20,24,20,.18)]"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E9EEE6]" />
          <span className="font-mono text-[10.5px] uppercase tracking-[.12em] text-[#9BA898]">or</span>
          <div className="h-px flex-1 bg-[#E9EEE6]" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border border-[#E2E8DE] bg-[#FAFBF9] px-4 text-[14px] text-[#1E241E] outline-none transition-colors placeholder:text-[#9BA898] focus:border-[#2F6B3A] focus:bg-white"
            />
          )}
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-[#E2E8DE] bg-[#FAFBF9] px-4 text-[14px] text-[#1E241E] outline-none transition-colors placeholder:text-[#9BA898] focus:border-[#2F6B3A] focus:bg-white"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border border-[#E2E8DE] bg-[#FAFBF9] px-4 text-[14px] text-[#1E241E] outline-none transition-colors placeholder:text-[#9BA898] focus:border-[#2F6B3A] focus:bg-white"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1.5 h-11 rounded-full bg-[#1E241E] text-[14px] font-semibold text-[#F3F6F1] shadow-[0_8px_20px_-8px_rgba(20,24,20,.5)] transition-colors hover:bg-[#2F6B3A] disabled:opacity-60"
          >
            {isLoading ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
          className="mt-5 w-full text-center text-[13.5px] text-[#3D473C]"
        >
          {mode === 'signup' ? (
            <>
              Already have an account? <span className="font-semibold text-[#1E241E] underline underline-offset-2">Sign in</span>
            </>
          ) : (
            <>
              Don&apos;t have an account? <span className="font-semibold text-[#1E241E] underline underline-offset-2">Sign up</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
