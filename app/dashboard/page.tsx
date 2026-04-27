import { createClient } from '@/utils/supbase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('name, total_points')
    .eq('id', user!.id)
    .single()

  const { data: pickups } = await supabase
    .from('pickups')
    .select('id, status, address, time_slot, created_at, pickup_items(item_type, quantity, co2_saved_kg, points_awarded)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const allPickups = pickups || []
  const completedPickups = allPickups.filter(p => p.status === 'completed')
  const totalCO2 = completedPickups.reduce((sum, p) => {
    const items = p.pickup_items as { co2_saved_kg: number }[]
    return sum + items.reduce((s, i) => s + (i.co2_saved_kg || 0), 0)
  }, 0)
  const totalItems = completedPickups.reduce((sum, p) => {
    const items = p.pickup_items as { quantity: number }[]
    return sum + items.reduce((s, i) => s + (i.quantity || 1), 0)
  }, 0)

  const firstName = (profile?.name || 'there').split(' ')[0]
  const greeting = getGreeting()
  const ecoPoints = profile?.total_points || 0
  const recentPickups = allPickups.slice(0, 5)

  return (
    <div style={{ flex: 1, padding: '48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', letterSpacing: '-0.02em' }}>
            {greeting}, {firstName} <span style={{ display: 'inline-block' }}>👋</span>
          </h1>
          <p style={{ marginTop: '4px', color: '#6f7a70', fontSize: '15px' }}>Here is what is happening with your activity today.</p>
        </div>
        {/* <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f4941', border: '1px solid #e4e2e2', position: 'relative', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">notifications</span>
          <span style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ba1a1a' }}></span>
        </button> */}
      </header>

      {/* Bento Grid Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        {/* Token Balance Card */}
        <div style={{ flex: '1 1 60%', minWidth: '340px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid #e4e2e2' }}>
          <div style={{ position: 'absolute', right: '-80px', bottom: '-80px', width: '256px', height: '256px', backgroundColor: 'rgba(26, 122, 74, 0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#1b1c1c', marginBottom: '24px' }}>Current Balance</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', color: '#1b1c1c', lineHeight: 1 }}>
                  {ecoPoints}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#3f4941' }}>Evolve Tokens</span>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6f7a70', fontFamily: '"Roboto Mono", monospace' }}>
                <span className="material-symbols-outlined" style={{ color: '#006036', fontSize: '18px' }}>trending_up</span>
                Lifetime earned: {ecoPoints} tokens
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '48px', flexWrap: 'wrap' }}>
              <Link href="/dashboard/new" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: '#006036', color: '#ffffff', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>package</span>
                  Schedule Pickup
                </div>
              </Link>
              <Link href="/dashboard/map" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e4e2e2', color: '#1b1c1c', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>map</span>
                  Find Nearby Centers
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Summary Card */}
        <div style={{ flex: '1 1 30%', minWidth: '300px', backgroundColor: '#006036', color: '#ffffff', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")', opacity: 0.1, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#80d9a0', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Impact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', marginBottom: '4px' }}>{totalCO2.toFixed(1)} kg</p>
                <p style={{ fontSize: '14px', color: '#80d9a0' }}>CO2 saved this month</p>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', marginBottom: '4px' }}>{totalItems} items</p>
                <p style={{ fontSize: '14px', color: '#80d9a0' }}>Successfully recycled</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 10, marginTop: '32px', backgroundColor: 'rgba(0, 109, 63, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', border: '1px solid rgba(155, 246, 186, 0.2)', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: '20px' }}>🌳</span>
            <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.4 }}>
              That's equivalent to planting <strong style={{ color: '#9bf6ba', fontWeight: 600 }}>{Math.max(1, Math.floor(totalCO2 / 10))} trees</strong> in the urban canopy project.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e4e2e2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c' }}>Recent Activity</h2>
          <Link href="/dashboard/pickups" style={{ textDecoration: 'none', color: '#006036', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Activity
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentPickups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#bec9be', marginBottom: '16px', display: 'block' }}>inbox</span>
              <p style={{ color: '#6f7a70', fontWeight: 500, fontSize: '16px' }}>No recent activity. Start your first pickup!</p>
            </div>
          ) : (
            recentPickups.map((pickup) => {
              const items = pickup.pickup_items as { item_type: string; quantity: number; points_awarded: number }[]
              const itemType = items[0]?.item_type || 'other'
              const numItems = items.reduce((s, i) => s + (i.quantity || 1), 0)
              const pts = items.reduce((s, i) => s + (i.points_awarded || 0), 0)

              let icon = 'local_shipping'
              if (itemType === 'phone') icon = 'smartphone'
              else if (itemType === 'laptop') icon = 'laptop_mac'
              else if (itemType === 'tv') icon = 'tv'
              else if (itemType === 'appliance') icon = 'kitchen'
              else if (itemType === 'cables') icon = 'cable'

              let statusBg = '#f5f3f3'
              let statusText = '#1b1c1c'
              let statusLabel = 'Scheduled'

              if (pickup.status === 'completed') {
                statusBg = '#abffc6'
                statusText = '#00522e'
                statusLabel = 'Completed'
              } else if (pickup.status === 'cancelled') {
                statusBg = '#ffdad6'
                statusText = '#93000a'
                statusLabel = 'Cancelled'
              } else if (pickup.status === 'in_progress') {
                statusBg = '#fff8e1'
                statusText = '#e65100'
                statusLabel = 'In Progress'
              }

              return (
                <Link key={pickup.id} href={`/dashboard/pickups/${pickup.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="hover-row" style={{ padding: '20px 24px', borderRadius: '14px', border: '1px solid #e4e2e2', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'border-color 0.2s, background-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006036' }}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '15px', color: '#1b1c1c', textTransform: 'capitalize', marginBottom: '4px' }}>{itemType} Pickup</p>
                        <p style={{ fontSize: '13px', color: '#6f7a70', fontFamily: '"Roboto Mono", monospace' }}>
                          ID: {pickup.id.substring(0, 8).toUpperCase()} • {numItems} Items
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: '#1b1c1c', marginBottom: '2px' }}>
                          {pickup.time_slot ? format(new Date(pickup.time_slot), 'MMM d, yyyy') : format(new Date(pickup.created_at), 'MMM d, yyyy')}
                        </p>
                        <p style={{ fontSize: '13px', color: '#006036', fontWeight: 600, fontFamily: '"Roboto Mono", monospace' }}>
                          {pts > 0 ? `+${pts} EVL` : 'Pending'}
                        </p>
                      </div>
                      <span style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: statusBg, color: statusText }}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
