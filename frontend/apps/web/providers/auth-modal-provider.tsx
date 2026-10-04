'use client'

import { AuthModal } from '@/components/auth/auth-modal'
import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

type AuthModalContextValue = {
  open: (onSuccess?: () => void) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const onSuccessRef = useRef<(() => void) | undefined>(undefined)

  function open(onSuccess?: () => void) {
    onSuccessRef.current = onSuccess
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <AuthModalContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <AuthModal
          onClose={close}
          onAuthenticated={() => {
            close()
            onSuccessRef.current?.()
          }}
        />
      )}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return ctx
}
