import { createClient } from '@/utils/supbase/server'

const ITEM_COLORS: Record<string, string> = {
  tv: '#006036', laptop: '#1a7a4a', phone: '#316944', tablet: '#5ede90',
  appliance: '#80d9a0', cables: '#b3f1c2', other: '#e4e2e2',
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const { data: pickups } = await supabase
    .from('pickups')
    .select('*, pickup_items(item_type, quantity, co2_saved_kg)')
    .order('created_at', { ascending: false })

  const allItems = pickups?.flatMap(p => p.pickup_items) || []

  // Aggregate stats
  const totalVolume = allItems.reduce((acc, item: any) => acc + (item.quantity || 1), 0)
  const totalCO2 = allItems.reduce((acc, item: any) => acc + (item.co2_saved_kg || 0), 0)

  // Categories Donut Chart data
  const byType: Record<string, number> = {}
  allItems.forEach((i: any) => {
    byType[i.item_type] = (byType[i.item_type] || 0) + (i.quantity || 1)
  })
  const topCategories = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 4)

  const recentPickups = pickups?.slice(0, 5) || []

  return (
    <div style={{ flex: 1, padding: '48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%', boxSizing: 'border-box' }}>

      {/* Page Header */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Corporate Dashboard</p>
            <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', letterSpacing: '-0.02em' }}>Evolve Analytics</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#f5f3f3', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#6f7a70', fontSize: '20px' }}>calendar_month</span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1b1c1c' }}>All Time</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>

        {/* Main KPI: Total Recycled */}
        <div style={{ flex: '2 1 500px', background: 'linear-gradient(135deg, #f5f3f3, #efeded)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
            <div>
              <p style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Recycled Volume</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: '#006036', lineHeight: 1, letterSpacing: '-0.02em' }}>{totalVolume}</span>
                <span style={{ fontSize: '20px', fontWeight: 500, color: '#6f7a70' }}>units</span>
              </div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#006036' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>trending_up</span>
              <span style={{ fontWeight: 500 }}>+12.4% vs last month</span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '-32px', bottom: '-32px', fontSize: '192px', color: 'rgba(111, 122, 112, 0.1)', pointerEvents: 'none' }}>recycling</span>
        </div>

        {/* Secondary KPI: CO2 Offset */}
        <div style={{ flex: '1 1 250px', backgroundColor: '#e4e2e2', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>CO2 Offset</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#1b1c1c', lineHeight: 1 }}>{totalCO2.toFixed(1)}</span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#6f7a70' }}>kg</span>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '8px', backgroundColor: '#f5f3f3', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#006036', width: '75%', borderRadius: '999px' }}></div>
            </div>
            <span style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70' }}>75% Target</span>
          </div>
        </div>
      </section>

      {/* Charts & Data Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>

        {/* Main Chart Area (Simulated) */}
        <div style={{ flex: '2 1 500px', backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>Waste vs CO2 Offset</h3>
            <button style={{ background: 'transparent', border: 'none', color: '#6f7a70', cursor: 'pointer' }}>
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'flex-end', gap: '8px', position: 'relative', paddingBottom: '32px' }}>
            {/* Simulated Chart Bars (Waste) */}
            {[40, 60, 50, 80, 95, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === 5 ? 'rgba(0, 96, 54, 0.2)' : '#efeded', height: `${h}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '4px 4px 0 0', position: 'relative' }}></div>
            ))}

            {/* Simulated Line Graph (CO2) */}
            <div style={{ position: 'absolute', inset: 0, paddingBottom: '32px', pointerEvents: 'none' }}>
              <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', paddingTop: '10px' }}>
                <path d="M 40,60 L 125,40 L 210,50 L 295,20 L 380,5 L 465,30" fill="none" stroke="#006036" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {[
                  { x: 40, y: 60 }, { x: 125, y: 40 }, { x: 210, y: 50 },
                  { x: 295, y: 20 }, { x: 380, y: 5 }, { x: 465, y: 30 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#fbf9f8" stroke="#006036" strokeWidth="2" />
                ))}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70' }}>
              <span style={{ flex: 1, textAlign: 'center' }}>Nov</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Dec</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Jan</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Feb</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Mar</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Apr</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(190, 201, 190, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#efeded' }}></div>
              <span>Waste Volume</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500 }}>
              <div style={{ width: '16px', height: '2px', backgroundColor: '#006036' }}></div>
              <span>CO2 Offset</span>
            </div>
          </div>
        </div>

        {/* Donut Chart Area (Simulated) */}
        <div style={{ flex: '1 1 250px', backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c', alignSelf: 'flex-start', marginBottom: '32px' }}>Waste Categories</h3>

          <div style={{ position: 'relative', width: '192px', height: '192px' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              {topCategories.map(([type, count], index) => {
                const total = totalVolume || 1
                const pct = (count / total) * 100
                const dasharray = 251.2
                const offset = index === 0 ? 0 : index === 1 ? 113 : 188 // Simulated offsets
                const color = ITEM_COLORS[type] || '#006036'
                return (
                  <circle key={type} cx="50" cy="50" fill="transparent" r="40" stroke={color} strokeDasharray={dasharray} strokeDashoffset={offset} strokeWidth="16" opacity={1 - (index * 0.2)}></circle>
                )
              })}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', color: '#1b1c1c' }}>{topCategories.length}</span>
              <span style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streams</span>
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCategories.map(([type, count], index) => {
              const color = ITEM_COLORS[type] || '#006036'
              const pct = totalVolume > 0 ? Math.round((count / totalVolume) * 100) : 0
              return (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, opacity: 1 - (index * 0.2) }}></div>
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                  </div>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', color: '#6f7a70' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

      </section>

      {/* Data Table */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 16px 32px -16px rgba(27,28,28,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>Recent Pickups</h3>
          <button style={{ fontSize: '14px', fontWeight: 500, color: '#006036', background: 'transparent', border: 'none', cursor: 'pointer' }}>View All</button>
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>
                <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Pickup ID</th>
                <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Date</th>
                <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Items</th>
                <th style={{ paddingBottom: '12px', fontWeight: 500, textAlign: 'right' }}>CO2 Offset</th>
                <th style={{ paddingBottom: '12px', fontWeight: 500, textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {recentPickups.map((p) => {
                const pItems = p.pickup_items as any[]
                const pCO2 = pItems?.reduce((acc, i) => acc + (i.co2_saved_kg || 0), 0) || 0
                return (
                  <tr key={p.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid rgba(190, 201, 190, 0.05)' }}>
                    <td style={{ padding: '16px 0', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70' }}>#EVL-{p.id.split('-')[0].toUpperCase()}</td>
                    <td style={{ padding: '16px 0' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ backgroundColor: 'rgba(0, 96, 54, 0.1)', color: '#006036', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize' }}>
                        {pItems && pItems.length > 0 ? pItems[0].item_type : 'Mixed'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', fontFamily: '"Roboto Mono", monospace', textAlign: 'right' }}>{pCO2.toFixed(1)} kg</td>
                    <td style={{ padding: '16px 0', textAlign: 'right' }}>
                      {p.status === 'completed' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#059669' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span> Processed
                        </span>
                      ) : p.status === 'scheduled' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#6f7a70' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> In Transit
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#ba1a1a' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span> Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {recentPickups.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px 0', textAlign: 'center', color: '#6f7a70' }}>No pickups found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
