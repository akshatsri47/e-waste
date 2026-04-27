import { createClient } from '@/utils/supbase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const ITEM_ICONS: Record<string, string> = {
  phone: 'smartphone', laptop: 'laptop_mac', tablet: 'tablet_mac', tv: 'tv',
  appliance: 'kitchen', cables: 'cable', other: 'recycling',
}

const LABEL: Record<string, string> = {
  is_working: 'Working?',
  condition: 'Condition',
  power_status: 'Power status',
  missing_parts: 'Missing parts',
  age_range: 'Age',
  notes: 'Notes',
  quantity: 'Quantity',
  item_type: 'Item type',
  points_awarded: 'Points earned',
  co2_saved_kg: 'CO₂ saved',
}

export default async function PickupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pickup } = await supabase
    .from('pickups')
    .select('*, pickup_items(*, item_images(*))')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!pickup) notFound()

  const items = pickup.pickup_items as any[]
  const totalPoints = items.reduce((s, i) => s + (i.points_awarded || 0), 0)
  const totalCO2 = items.reduce((s, i) => s + (i.co2_saved_kg || 0), 0)
  const totalQuantity = items.reduce((s, i) => s + (i.quantity || 1), 0)

  return (
    <div style={{ flex: 1, padding: '48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <Link href="/dashboard/pickups" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6f7a70', textDecoration: 'none', marginBottom: '16px', transition: 'color 0.2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Back to Pickups
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.02em' }}>
              Pickup Detail
              {pickup.status === 'scheduled' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#b3f1c2', color: '#16512e', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled</span>
              ) : pickup.status === 'completed' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#abffc6', color: '#00522e', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(255, 218, 214, 0.5)', color: '#ba1a1a', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cancelled</span>
              )}
            </h1>
            <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70', marginTop: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ID: EVL-{pickup.id.split('-')[0].toUpperCase()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: '#f5f3f3', color: '#006036', fontWeight: 500, fontSize: '14px', border: '1px solid rgba(190, 201, 190, 0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>receipt_long</span>
              Download Receipt
            </button>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        
        {/* Left Column (Span 8) */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          {/* Reward Card */}
          <section style={{ background: 'linear-gradient(135deg, #006036 0%, #1a7a4a 100%)', borderRadius: '16px', padding: '32px', color: '#ffffff', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '256px', height: '256px', borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0.05, filter: 'blur(40px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '14px', fontWeight: 500, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Impact Reward</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '40px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#7cfbaa', lineHeight: 1 }}>{totalPoints.toFixed(2)}</span>
                  <span style={{ fontSize: '18px', fontWeight: 500, opacity: 0.9 }}>Tokens Earned</span>
                </div>
                <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px', maxWidth: '400px' }}>Tokens credited to corporate ledger for responsible e-waste disposal.</p>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#7cfbaa' }}>paid</span>
              </div>
            </div>
          </section>

          {/* Logistics Overview */}
          <section style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '32px', border: '1px solid rgba(190, 201, 190, 0.15)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Logistics Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
              {/* Vendor */}
              <div>
                <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Service Partner</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#b3f1c2', color: '#16512e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1b1c1c' }}>Evolve Direct</p>
                    <p style={{ fontSize: '14px', color: '#6f7a70', marginTop: '4px' }}>Certified E-Waste Handler</p>
                  </div>
                </div>
              </div>
              {/* Schedule */}
              <div>
                <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Pickup Time</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eae8e7', color: '#3f4941', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1b1c1c' }}>
                      {pickup.time_slot ? format(new Date(pickup.time_slot), 'MMMM d, yyyy') : format(new Date(pickup.created_at), 'MMMM d, yyyy')}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6f7a70', marginTop: '4px' }}>
                      {pickup.time_slot ? format(new Date(pickup.time_slot), 'h:mm a') : 'TBD'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Items Checklist */}
          <section style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '32px', border: '1px solid rgba(190, 201, 190, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Manifested Items</h3>
              <span style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', backgroundColor: '#fbf9f8', color: '#1b1c1c', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(190, 201, 190, 0.15)' }}>{totalQuantity} Items Total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item, index) => (
                <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#fbf9f8', border: '1px solid rgba(190, 201, 190, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f5f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6f7a70' }}>
                      <span className="material-symbols-outlined">{ITEM_ICONS[item.item_type] || 'recycling'}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#1b1c1c', textTransform: 'capitalize' }}>{item.item_type || 'Unknown Item'}</p>
                      <p style={{ fontSize: '14px', color: '#6f7a70', marginTop: '2px' }}>Condition: {item.condition || 'Unknown'}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#1b1c1c' }}>{item.quantity || 1}x</p>
                    <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', color: '#006036', marginTop: '4px' }}>+{item.points_awarded || 0} Tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Uploaded Photos */}
          {items.some(i => i.item_images && i.item_images.length > 0) && (
            <section style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', padding: '32px', border: '1px solid rgba(190, 201, 190, 0.15)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Uploaded Photos</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {items.flatMap(i => i.item_images || []).map((img: any, idx) => (
                  <div key={img.id || idx} style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(190, 201, 190, 0.2)' }}>
                    <img src={img.image_url} alt="Uploaded item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column (Span 4) */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          {/* Location Card */}
          <section style={{ backgroundColor: '#f5f3f3', borderRadius: '16px', border: '1px solid rgba(190, 201, 190, 0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: '200px', backgroundColor: '#dbd9d9', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ffffff', opacity: 0.5 }}>map</span>
              <div style={{ position: 'absolute', bottom: '16px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(251, 249, 248, 0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '999px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid rgba(190, 201, 190, 0.15)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#006036' }}>location_on</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Pickup Location</span>
              </div>
            </div>
            
            <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Origin Address</h3>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontWeight: 600, color: '#1b1c1c', marginBottom: '4px' }}>{pickup.address}</p>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(190, 201, 190, 0.15)' }}>
                <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#6f7a70', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Impact Metrics</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fbf9f8', padding: '12px', borderRadius: '8px', border: '1px solid rgba(190, 201, 190, 0.1)' }}>
                  <span style={{ fontSize: '14px', color: '#3f4941' }}>Carbon Offset</span>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '14px', fontWeight: 700, color: '#006036' }}>{totalCO2.toFixed(1)} kg CO₂e</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
