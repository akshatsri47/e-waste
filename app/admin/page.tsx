import { createClient } from '@/utils/supbase/server'

const ITEM_ICONS: Record<string, string> = {
  phone: '📱', laptop: '💻', tablet: '📟', tv: '📺',
  appliance: '🧹', cables: '🔌', other: '♻️',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // --- Core pickups data ---
  const { data: pickups } = await supabase
    .from('pickups')
    .select('id, status, created_at, pickup_type')
    .order('created_at', { ascending: false })

  const recentPickups = pickups?.slice(0, 5) || []

  const total = pickups?.length || 0
  const scheduled = pickups?.filter(p => p.status === 'scheduled').length || 0
  const completed = pickups?.filter(p => p.status === 'completed').length || 0
  const cancelled = pickups?.filter(p => p.status === 'cancelled').length || 0

  // --- Users ---
  const { data: allUsers } = await supabase.from('users').select('id, name, total_points').order('total_points', { ascending: false })
  const totalUsers = allUsers?.length || 0
  const topUsers = allUsers?.slice(0, 5) || []

  // --- Items (impact) ---
  const { data: items } = await supabase
    .from('pickup_items')
    .select('co2_saved_kg, points_awarded, item_type, quantity')

  const totalCO2 = items?.reduce((s, i) => s + (i.co2_saved_kg || 0), 0) || 0
  const totalPoints = items?.reduce((s, i) => s + (i.points_awarded || 0), 0) || 0
  const totalDevices = items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0

  // Device type breakdown
  const byType: Record<string, number> = {}
  items?.forEach(i => { byType[i.item_type] = (byType[i.item_type] || 0) + (i.quantity || 1) })
  const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{ flex: 1, padding: '40px 48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%', boxSizing: 'border-box', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1b1c1c', marginBottom: '8px', letterSpacing: '-0.02em' }}>Operations Dashboard</h2>
          <p style={{ fontSize: '15px', color: '#3f4941' }}>Command center for logistics, assignments, and environmental impact.</p>
        </div>
      </div>

      {/* Alert Banner */}
      {scheduled > 0 && (
        <div style={{ marginBottom: '32px', padding: '16px 20px', backgroundColor: '#ffdad6', color: '#93000a', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ color: '#ba1a1a', fontSize: '20px' }}>warning</span>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{scheduled} pickups pending assignment</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Total Pickups */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(190, 201, 190, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pickups</span>
            <div style={{ padding: '8px', backgroundColor: '#fbf9f8', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#006036' }}>local_shipping</span>
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 600, fontFamily: '"Roboto Mono", monospace', color: '#1a7a4a' }}>{total}</div>
        </div>

        {/* Pending Assignment */}
        <div style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(190, 201, 190, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</span>
            <div style={{ padding: '8px', backgroundColor: '#fbf9f8', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#3f4941' }}>pending_actions</span>
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 600, fontFamily: '"Roboto Mono", monospace', color: '#1b1c1c' }}>{scheduled}</div>
        </div>

        {/* Total CO2 Saved */}
        <div style={{ backgroundColor: '#e4e2e2', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(190, 201, 190, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total CO₂ Saved</span>
            <div style={{ padding: '8px', backgroundColor: '#fbf9f8', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#006036' }}>eco</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '36px', fontWeight: 600, fontFamily: '"Roboto Mono", monospace', color: '#1b1c1c' }}>{totalCO2.toFixed(1)}</span>
            <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>kg</span>
          </div>
        </div>

        {/* Eco Points */}
        <div style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(190, 201, 190, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eco Points Awarded</span>
            <div style={{ padding: '8px', backgroundColor: '#fbf9f8', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#007b44' }}>stars</span>
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 600, fontFamily: '"Roboto Mono", monospace', color: '#1b1c1c' }}>{totalPoints.toLocaleString()}</div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(190, 201, 190, 0.2)', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1b1c1c' }}>Recent Pickup Requests</h3>
          <span style={{ fontSize: '14px', color: '#006036', fontWeight: 600, cursor: 'pointer' }}>View All</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: '12px', color: '#6f7a70', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ paddingBottom: '16px', fontWeight: 700 }}>Booking ID</th>
                <th style={{ paddingBottom: '16px', fontWeight: 700 }}>Date</th>
                <th style={{ paddingBottom: '16px', fontWeight: 700 }}>Type</th>
                <th style={{ paddingBottom: '16px', fontWeight: 700 }}>Status</th>
                <th style={{ paddingBottom: '16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {recentPickups.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(190, 201, 190, 0.2)' }}>
                  <td style={{ padding: '16px 8px 16px 0' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', backgroundColor: '#efeded', padding: '6px 10px', borderRadius: '6px', color: '#1b1c1c' }}>
                      {p.id.split('-')[0].toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px', color: '#3f4941', fontWeight: 500 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 8px', color: '#3f4941', textTransform: 'capitalize', fontWeight: 500 }}>{p.pickup_type || 'Pickup'}</td>
                  <td style={{ padding: '16px 8px' }}>
                    {p.status === 'scheduled' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, backgroundColor: '#f5f3f3', color: '#3f4941' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3f4941' }}></span> Unassigned
                      </span>
                    ) : p.status === 'completed' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, backgroundColor: '#abffc6', color: '#00522e' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#006036' }}></span> Completed
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, backgroundColor: '#ffdad6', color: '#93000a' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ba1a1a' }}></span> Cancelled
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#006036', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
              {recentPickups.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 0', textAlign: 'center', color: '#6f7a70' }}>No recent requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        
        {/* Device Type Breakdown */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '32px', border: '1px solid rgba(190, 201, 190, 0.4)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1b1c1c', marginBottom: '32px' }}>Top Device Types</h2>
          {topTypes.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#6f7a70' }}>No items yet</p>
          ) : topTypes.map(([type, count]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '28px', backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>{ITEM_ICONS[type] || '♻️'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#3f4941', textTransform: 'capitalize' }}>{type}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1b1c1c' }}>{count}</span>
                </div>
                <div style={{ height: '8px', background: '#e4e2e2', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0}%`, background: '#006036', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Eco Champions */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(190, 201, 190, 0.2)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1b1c1c', marginBottom: '32px' }}>Top Eco Champions</h2>
          {topUsers.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#6f7a70' }}>No users yet</p>
          ) : topUsers.map((u, i) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i < topUsers.length - 1 ? '1px solid rgba(190, 201, 190, 0.2)' : 'none' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i === 0 ? '#b3f1c2' : '#f5f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, flexShrink: 0 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1b1c1c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name || 'Anonymous'}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#006036', background: '#abffc6', padding: '6px 16px', borderRadius: '999px', flexShrink: 0 }}>
                {u.total_points || 0} pts
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
