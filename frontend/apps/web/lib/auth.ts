import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'
import { Pool } from 'pg'

async function bridgeDjangoRefreshToken(email: string, name: string): Promise<string> {
  const [firstName, ...rest] = name.trim().split(' ')

  const res = await fetch(`${process.env.API_URL}/api/auth/social/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.INTERNAL_AUTH_SECRET,
      email,
      first_name: firstName ?? '',
      last_name: rest.join(' ')
    })
  })

  if (!res.ok) {
    throw new Error(`Failed to bridge Django session for ${email}: ${res.status}`)
  }

  const { refresh } = await res.json()
  return refresh
}

export const auth = betterAuth({
  database: new Pool({
    host: process.env.DATABASE_HOST || 'db',
    port: 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'db'
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }
  },
  session: {
    additionalFields: {
      djangoRefresh: { type: 'string', required: false, input: false }
    }
  },
  // Every sign-in (password or Google) creates a session here — Better Auth
  // owns credentials/OAuth, but Django stays the source of truth for user
  // data, so each new session is bridged into a Django JWT pair up front.
  databaseHooks: {
    session: {
      create: {
        before: async (session, ctx) => {
          if (!ctx) return

          const user = await ctx.context.internalAdapter.findUserById(session.userId)
          if (!user?.email) return

          const djangoRefresh = await bridgeDjangoRefreshToken(user.email, user.name ?? '')

          return { data: { ...session, djangoRefresh } }
        }
      }
    }
  },
  plugins: [nextCookies()]
})

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}
