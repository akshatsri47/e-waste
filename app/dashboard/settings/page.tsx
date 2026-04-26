import { createClient } from '@/utils/supbase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single()

  return (
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-neutral-900)' }}>Settings</h1>
      <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)', marginBottom: '28px' }}>Manage your account details</p>

      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-neutral-100)',
        overflow: 'hidden',
      }}>
        {/* Avatar */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
          padding: '32px 28px', display: 'flex', alignItems: 'center', gap: '20px',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: 'white', fontWeight: 700,
            border: '3px solid rgba(255,255,255,0.4)',
          }}>
            {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
              {profile?.name || 'User'}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{profile?.email}</div>
          </div>
        </div>

        {/* Fields */}
        <div style={{ padding: '24px 28px' }}>
          {[
            { label: 'Full Name', value: profile?.name || '—' },
            { label: 'Email', value: profile?.email || '—' },
            { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
            { label: 'Total Points', value: String(profile?.total_points || 0) },
          ].map(f => (
            <div key={f.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderBottom: '1px solid var(--color-neutral-100)',
              fontSize: '14px',
            }}>
              <span style={{ color: 'var(--color-neutral-500)', fontWeight: 500 }}>{f.label}</span>
              <span style={{ color: 'var(--color-neutral-900)', fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '4px 28px 24px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', fontStyle: 'italic' }}>
            Profile info synced from Google. To update your name, change it on your Google account.
          </p>
        </div>
      </div>
    </div>
  )
}
