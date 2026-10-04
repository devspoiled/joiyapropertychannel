'use client'

import { GoogleIcon } from '@/components/auth/google-icon'
import { loginFormSchema } from '@/lib/validation'
import { FormFooter } from '@frontend/ui/forms/form-footer'
import { FormHeader } from '@frontend/ui/forms/form-header'
import { SubmitField } from '@frontend/ui/forms/submit-field'
import { TextField } from '@frontend/ui/forms/text-field'
import { ErrorMessage } from '@frontend/ui/messages/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type LoginFormSchema = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string>()

  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmitHandler = handleSubmit(async (data) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  })

  return (
    <>
      <FormHeader
        title="Welcome back"
        description="Sign in to save properties and contact agents"
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

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

      <form method="post" onSubmit={onSubmitHandler}>
        <TextField
          type="text"
          register={register('email')}
          formState={formState}
          label="Email"
          placeholder="you@example.com"
        />

        <TextField
          type="password"
          register={register('password', { required: true })}
          formState={formState}
          label="Password"
          placeholder="Enter your password"
        />

        <SubmitField>Sign in</SubmitField>
      </form>

      <FormFooter
        cta="Don't have an account?"
        link="/register"
        title="Sign up"
      />
    </>
  )
}
