import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supbase/server'
import Sidebar from '@/components/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('name, email, is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        isAdmin={true}
        userName={profile?.name || user.user_metadata?.full_name}
        userEmail={profile?.email || user.email}
      />
      <main style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--color-background)',
        padding: '32px',
      }}>
        {children}
      </main>
    </div>
  )
}
