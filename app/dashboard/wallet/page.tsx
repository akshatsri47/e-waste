import { createClient } from '@/utils/supbase/server'
import { format } from 'date-fns'
import Link from 'next/link'
import TransactionsTable from './TransactionsTable'

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('name, total_points')
    .eq('id', user!.id)
    .single()

  const { data: pickups } = await supabase
    .from('pickups')
    .select('id, status, created_at, pickup_items(item_type, quantity, co2_saved_kg, points_awarded)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

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

  const firstName = (profile?.name || 'User').split(' ')[0]
  const ecoPoints = profile?.total_points || 0

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', color: '#1b1c1c', backgroundColor: '#fbf9f8', minHeight: '100vh', fontFamily: 'sans-serif', padding: '48px', boxSizing: 'border-box' }}>

      {/* Header Section */}
      <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', letterSpacing: '-0.025em', margin: '0 0 8px 0' }}>
            Good Morning, {firstName}.
          </h1>
          <p style={{ color: '#3f4941', fontSize: '14px', margin: 0 }}>Here is your current impact overview.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '48px' }}>
        {/* Prominent Balance Card */}
        <div style={{ flex: '1 1 60%', background: 'linear-gradient(to bottom right, #006036, #1a7a4a)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', color: '#ffffff', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '256px', height: '256px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', left: '-40px', bottom: '-40px', width: '192px', height: '192px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px', display: 'block', fontFamily: 'sans-serif' }}>CURRENT BALANCE</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '56px', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1, letterSpacing: '-0.025em' }}>{ecoPoints}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px', display: 'block', opacity: 0.9 }}>EVOLVE TOKENS</span>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.025em', fontWeight: 600, marginBottom: '4px' }}>LIFETIME EARNINGS</span>
                <span style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>{ecoPoints}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Link href="/dashboard/redeem" style={{ textDecoration: 'none' }}>
                  <button style={{ backgroundColor: '#ffffff', color: '#006036', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>redeem</span>
                    <span>Redeem Tokens</span>
                  </button>
                </Link>
              </div>
              <Link href="/dashboard/impact" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>history</span>
                <span>View Analytics</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Summary Card */}
        <div style={{ flex: '1 1 30%', backgroundColor: '#f5f3f3', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#3f4941', textTransform: 'uppercase', marginBottom: '24px', fontFamily: 'sans-serif' }}>Impact Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#b3f1c2', color: '#37704a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined">recycling</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#1b1c1c' }}>{totalItems} items</div>
                  <div style={{ fontSize: '12px', color: '#3f4941' }}>Items Diverted</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#007b44', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined">co2</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#1b1c1c' }}>{totalCO2.toFixed(1)} kg</div>
                  <div style={{ fontSize: '12px', color: '#3f4941' }}>CO2 Offset</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(190, 201, 190, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ color: '#3f4941' }}>Global Rank</span>
              <span style={{ fontWeight: 700, color: '#006036' }}>Top 15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <TransactionsTable allPickups={allPickups} />
    </div>
  )
}
