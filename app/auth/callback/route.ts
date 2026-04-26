import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supbase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Sync user to users table
        const { data: existing } = await supabase
          .from('users')
          .select('id, is_admin')
          .eq('id', user.id)
          .single()

        if (!existing) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            is_admin: false,
            total_points: 0,
          })
        }

        const isAdmin = existing?.is_admin ?? false
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const dest = isAdmin ? '/admin' : '/dashboard'

        const base = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin
        return NextResponse.redirect(`${base}${dest}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}