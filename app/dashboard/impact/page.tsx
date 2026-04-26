import { createClient } from '@/utils/supbase/server'
import { redirect } from 'next/navigation'

const POINTS_ESTIMATE: Record<string, { points: number; co2: number, label: string, color: string }> = {
  phone:     { points: 50,  co2: 0.5, label: 'Smartphones', color: '#006036' },
  laptop:    { points: 120, co2: 1.8, label: 'Laptops', color: '#1a7a4a' },
  tablet:    { points: 80,  co2: 1.2, label: 'Tablets', color: '#b3f1c2' },
  tv:        { points: 150, co2: 2.5, label: 'Monitors', color: '#007b44' },
  appliance: { points: 100, co2: 2.0, label: 'Appliances', color: '#80d9a0' },
  cables:    { points: 20,  co2: 0.2, label: 'Cables', color: '#5ede90' },
  other:     { points: 30,  co2: 0.3, label: 'Other', color: '#9bf6ba' },
}

export default async function ImpactDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pickups } = await supabase
    .from('pickups')
    .select(`
      id, created_at, status,
      pickup_items ( item_type, quantity )
    `)
    .eq('user_id', user.id)

  let totalCO2 = 0
  let totalItems = 0
  const itemCounts: Record<string, number> = {}
  
  const now = new Date()
  const monthsData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      monthStr: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      co2: 0
    }
  })

  pickups?.forEach(pickup => {
    if (pickup.status === 'cancelled') return

    const d = new Date(pickup.created_at)
    const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())

    let pickupCO2 = 0
    pickup.pickup_items?.forEach((item: any) => {
      const type = item.item_type as string
      const est = POINTS_ESTIMATE[type] || POINTS_ESTIMATE.other
      const qty = item.quantity || 1
      const co2 = est.co2 * qty
      
      totalCO2 += co2
      pickupCO2 += co2
      totalItems += qty
      
      itemCounts[type] = (itemCounts[type] || 0) + qty
    })

    if (monthDiff >= 0 && monthDiff < 6) {
      monthsData[5 - monthDiff].co2 += pickupCO2
    }
  })

  const treesPlanted = Math.floor(totalCO2 / 10) || 0

  const sortedItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  let currentPct = 0
  const gradientStops = sortedItems.map(([type, count]) => {
     const pct = (count / totalItems) * 100
     const color = POINTS_ESTIMATE[type]?.color || '#9bf6ba'
     const stop = `${color} ${currentPct}% ${currentPct + pct}%`
     currentPct += pct
     return stop
  }).join(', ')
  const conicGradient = `conic-gradient(${gradientStops || '#e4e2e2 0% 100%'})`

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', color: '#1b1c1c', backgroundColor: '#fbf9f8', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '48px', boxSizing: 'border-box' }}>
      
      <header style={{ marginBottom: '48px' }}>
        <p style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '14px', color: '#006036', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>IMPACT DASHBOARD</p>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1b1c1c', letterSpacing: '-0.02em' }}>Your Environmental Contribution</h1>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        
        {/* Hero Impact Card */}
        <div style={{ flex: '2 1 500px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#3f4941', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Carbon Reduction</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '72px', fontWeight: 800, color: '#006036', lineHeight: 1, letterSpacing: '-0.05em' }}>{totalCO2.toFixed(1)}</span>
              <span style={{ fontSize: '24px', fontWeight: 600, color: '#3f4941' }}>kg CO₂ saved</span>
            </div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#f5f3f3', padding: '16px 24px', borderRadius: '16px' }}>
              <span style={{ fontSize: '28px' }}>🌳</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>That's like planting {treesPlanted} {treesPlanted === 1 ? 'tree' : 'trees'}</span>
            </div>
          </div>
          <div style={{ position: 'absolute', right: '-80px', bottom: '-80px', width: '350px', height: '350px', backgroundColor: 'rgba(26, 122, 74, 0.08)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 1 }}></div>
        </div>

        {/* Donut Chart placeholder */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#f5f3f3', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1b1c1c', marginBottom: '24px' }}>Items Recycled</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', position: 'relative', margin: '24px 0' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '16px solid #e4e2e2', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ position: 'absolute', top: '-16px', left: '-16px', width: 'calc(100% + 32px)', height: 'calc(100% + 32px)', borderRadius: '50%', background: conicGradient, WebkitMask: 'radial-gradient(transparent 58%, black 58%)', mask: 'radial-gradient(transparent 58%, black 58%)' }}></div>
               <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '32px', fontWeight: 800, color: '#1b1c1c' }}>{totalItems}</span>
                 <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>Total</span>
               </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedItems.length === 0 && (
              <p style={{ fontSize: '14px', color: '#6f7a70', textAlign: 'center' }}>No items recycled yet.</p>
            )}
            {sortedItems.map(([type, count]) => {
              const est = POINTS_ESTIMATE[type] || POINTS_ESTIMATE.other
              return (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: est.color }}></div>
                    <span style={{ color: '#3f4941', fontWeight: 600 }}>{est.label}</span>
                  </div>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#1b1c1c', fontSize: '16px' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ flex: '1 1 100%', backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1b1c1c' }}>CO₂ Saved (Last 6 Months)</h3>
            <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '14px', color: '#3f4941' }}>Value in kg</span>
          </div>

          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '24px', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e4e2e2' }}>
            {monthsData.map((data, i) => {
               const maxCO2 = Math.max(...monthsData.map(m => m.co2), 1)
               const heightPct = Math.max((data.co2 / maxCO2) * 100, 5)
               const isCurrent = i === 5

               return (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', height: '100%', position: 'relative' }}>
                   <div style={{ width: '100%', maxWidth: '80px', backgroundColor: '#eae8e7', borderRadius: '12px 12px 0 0', position: 'relative', display: 'flex', alignItems: 'flex-end', height: '100%', overflow: 'hidden' }}>
                      <div style={{ 
                        width: '100%', 
                        height: `${heightPct}%`, 
                        backgroundColor: isCurrent ? '#006036' : (data.co2 > 0 ? '#1a7a4a' : 'transparent'),
                        opacity: isCurrent ? 1 : 0.6,
                        borderRadius: '12px 12px 0 0',
                        transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                     <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '14px', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#006036' : '#3f4941' }}>{data.monthStr}</span>
                     {data.co2 > 0 && (
                        <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '12px', color: '#6f7a70', fontWeight: 500 }}>{data.co2.toFixed(1)}</span>
                     )}
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
