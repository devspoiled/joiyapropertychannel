import { RegisterForm } from '@/components/forms/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create account - Joiya Property Channel'
}

export default function Register() {
  return <RegisterForm />
}
