'use client'

import type {
  DeleteAccountFormSchema,
  deleteAccountAction
} from '@/actions/delete-account-action'
import { deleteAccountFormSchema } from '@/lib/validation'
import { FormHeader } from '@frontend/ui/forms/form-header'
import { SubmitField } from '@frontend/ui/forms/submit-field'
import { TextField } from '@frontend/ui/forms/text-field'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export function DeleteAccountForm({
  onSubmitHandler
}: { onSubmitHandler: typeof deleteAccountAction }) {
  const session = authClient.useSession()

  const { formState, handleSubmit, register, reset, setValue } =
    useForm<DeleteAccountFormSchema>({
      resolver: zodResolver(deleteAccountFormSchema)
    })

  useEffect(() => {
    if (session.data?.user.email) {
      setValue('usernameCurrent', session.data?.user.email)
    }
  }, [setValue, session.data?.user.email])

  return (
    <>
      <FormHeader
        title="Delete your account"
        description="After this action all data will be lost"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res) {
            reset()
            await authClient.signOut()
          }
        })}
      >
        <TextField
          type="text"
          register={register('username')}
          label="Email"
          formState={formState}
        />

        <SubmitField>Delete account</SubmitField>
      </form>
    </>
  )
}
