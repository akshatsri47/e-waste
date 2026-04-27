'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Pickup {
  id: string
  status: string
  address: string
  time_slot: string | null
  created_at: string
  pickup_type?: string | null
  users: { name: string; email: string } | null
  pickup_items: { item_type: string; quantity: number; points_awarded?: number; estimated_weight_kg?: number }[]
  recyclers?: { name: string } | null
}

const ITEM_ICONS: Record<string, string> = {
  phone: 'smartphone', laptop: 'laptop_mac', tablet: 'tablet_mac', tv: 'tv',
  appliance: 'kitchen', cables: 'cable', other: 'recycling',
}

const POINTS_ESTIMATE: Record<string, number> = {
  phone: 50, laptop: 120, tablet: 80, tv: 150,
  appliance: 100, cables: 20, other: 30,
}

export default function AdminPickupsTable({ initialPickups }: { initialPickups: Pickup[] }) {
  const [pickups, setPickups] = useState(initialPickups)
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = pickups.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function showToast(msg: string, type: 'success' | 'info' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const updateStatus = async (id: string, status: 'completed' | 'cancelled', e: React.MouseEvent) => {
    e.preventDefault() // prevent Link navigation
    setLoading(id + status)
    const res = await fetch(`/api/admin/pickups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const data = await res.json()
      setPickups(prev => prev.map(p => p.id === id ? { ...p, status } : p))
      if (status === 'completed' && data.pointsAwarded > 0) {
        showToast(`✅ Completed! ${data.pointsAwarded} eco-points awarded to user.`)
      } else if (status === 'completed') {
        showToast('✅ Marked as completed.')
      } else {
        showToast('Pickup cancelled.', 'info')
      }
      router.refresh()
    }
    setLoading(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', backgroundColor: '#b3f1c2', color: '#16512e', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#006036' }}></span> Scheduled
          </span>
        )
      case 'completed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', backgroundColor: '#eae8e7', color: '#1b1c1c', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6f7a70' }}></span> Completed
          </span>
        )
      case 'cancelled':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', backgroundColor: 'rgba(255, 218, 214, 0.5)', color: '#ba1a1a', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ba1a1a' }}></span> Cancelled
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ flex: 1, padding: '48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box', minHeight: '100vh', width: '100%' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 999,
          background: toast.type === 'success' ? '#065F46' : '#374151',
          color: 'white', padding: '12px 20px', borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '13px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <p style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Logistics activity</p>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', letterSpacing: '-0.02em', marginBottom: '8px' }}>Pickup History</h1>
          <p style={{ fontSize: '14px', color: '#3f4941', maxWidth: '600px' }}>A comprehensive administrative record of all scheduled, completed, and cancelled collection events. Click to view details or process pickups.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} style={{
            padding: '10px 20px', borderRadius: '999px',
            backgroundColor: filter === f ? '#9bf6ba' : '#f5f3f3',
            color: filter === f ? '#00210f' : '#3f4941',
            fontWeight: filter === f ? 600 : 500, fontSize: '14px',
            border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', textTransform: 'capitalize'
          }} onMouseEnter={(e) => { if (filter !== f) e.currentTarget.style.backgroundColor = '#e4e2e2' }} onMouseLeave={(e) => { if (filter !== f) e.currentTarget.style.backgroundColor = '#f5f3f3' }}>
            {f} <span style={{ opacity: 0.7 }}>({f === 'all' ? pickups.length : pickups.filter(p => p.status === f).length})</span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', color: 'rgba(63, 73, 65, 0.5)', fontSize: '20px' }}>search</span>
          <input type="text" placeholder="Search by ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
            padding: '10px 16px 10px 40px', borderRadius: '8px',
            backgroundColor: '#f5f3f3', border: '1px solid rgba(190, 201, 190, 0.15)',
            fontSize: '14px', fontFamily: '"Roboto Mono", monospace', width: '200px',
            color: '#1b1c1c', outline: 'none'
          }} />
        </div>
      </div>

      {/* SaaS Data Table (Bento Style Rows) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '16px', padding: '8px 24px', fontSize: '11px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <div style={{ gridColumn: 'span 2' }}>Status</div>
          <div style={{ gridColumn: 'span 3' }}>Booking ID & User</div>
          <div style={{ gridColumn: 'span 3' }}>Items & Impact</div>
          <div style={{ gridColumn: 'span 2' }}>Date</div>
          <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Actions</div>
        </div>

        {(!filtered || filtered.length === 0) ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '64px', textAlign: 'center', border: '1px solid rgba(190, 201, 190, 0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#6f7a70', marginBottom: '16px' }}>inventory_2</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>No pickups found</h3>
            <p style={{ fontSize: '14px', color: '#3f4941' }}>There are no pickups matching the current filter or search.</p>
          </div>
        ) : (
          filtered.map(pickup => {
            const items = pickup.pickup_items || []
            const totalItems = items.reduce((s, i) => s + (i.quantity || 1), 0)
            const itemSummaries = items.slice(0, 2).map(i => `${i.quantity}x ${i.item_type}`).join(', ') + (items.length > 2 ? `, +${items.length - 2} more` : '')
            const estWeight = items.reduce((s, i) => s + (i.estimated_weight_kg || 0), 0)
            const awardedPts = items.reduce((s, i) => s + (i.points_awarded || 0), 0)
            const user = pickup.users
            const isScheduled = pickup.status === 'scheduled'

            return (
              <div key={pickup.id} style={{
                display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '16px', alignItems: 'center',
                backgroundColor: pickup.status === 'cancelled' ? '#fbf9f8' : '#ffffff',
                padding: '24px', borderRadius: '24px',
                boxShadow: '0 16px 32px -8px rgba(27, 28, 28, 0.06)',
                border: '1px solid rgba(190, 201, 190, 0.1)',
                transition: 'background-color 0.3s, transform 0.2s',
                opacity: pickup.status === 'cancelled' ? 0.75 : 1
              }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#efeded'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = pickup.status === 'cancelled' ? '#fbf9f8' : '#ffffff'; e.currentTarget.style.transform = 'translateY(0)' }}>

                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center' }}>
                  {getStatusBadge(pickup.status)}
                </div>

                <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/dashboard/pickups/${pickup.id}`} style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '20px', fontFamily: '"Roboto Mono", monospace', fontWeight: 600, color: '#006036', textDecoration: pickup.status === 'cancelled' ? 'line-through' : 'none', textDecorationColor: '#6f7a70' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                      EVL-{pickup.id.split('-')[0].toUpperCase()}
                    </span>
                  </Link>
                  <span style={{ fontSize: '12px', color: '#6f7a70', marginTop: '4px' }}>{user?.name || 'Unknown'} • {user?.email}</span>
                </div>

                <div style={{ gridColumn: 'span 3' }}>
                  <p style={{ fontSize: '14px', color: '#1b1c1c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {itemSummaries || 'No items listed'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: '"Roboto Mono", monospace', color: '#6f7a70' }}>
                      {estWeight > 0 ? `Est. ${estWeight.toFixed(1)} kg` : `${totalItems} total items`}
                    </span>
                    {awardedPts > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#006036', backgroundColor: '#b3f1c2', padding: '2px 6px', borderRadius: '4px' }}>+{awardedPts} Pts</span>
                    )}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1b1c1c' }}>
                    {pickup.time_slot ? format(new Date(pickup.time_slot), 'MMM d, yyyy') : format(new Date(pickup.created_at), 'MMM d, yyyy')}
                  </p>
                  <p style={{ fontSize: '11px', color: '#3f4941', marginTop: '4px' }}>
                    {pickup.time_slot ? format(new Date(pickup.time_slot), 'hh:mm a') : 'TBD'}
                  </p>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {isScheduled && (
                    <>
                      <button
                        onClick={(e) => updateStatus(pickup.id, 'completed', e)}
                        disabled={!!loading}
                        style={{
                          padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          backgroundColor: '#006036', color: 'white', opacity: loading ? 0.6 : 1, transition: 'background-color 0.2s',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a7a4a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006036'}
                      >
                        {loading === pickup.id + 'completed' ? '...' : <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span> Process</>}
                      </button>
                      <button
                        onClick={(e) => updateStatus(pickup.id, 'cancelled', e)}
                        disabled={!!loading}
                        style={{
                          padding: '8px 12px', borderRadius: '8px', border: '1px solid #ba1a1a', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          backgroundColor: 'transparent', color: '#ba1a1a', opacity: loading ? 0.6 : 1, transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ba1a1a'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ba1a1a' }}
                      >
                        {loading === pickup.id + 'cancelled' ? '...' : '✕'}
                      </button>
                    </>
                  )}
                  {!isScheduled && (
                    <span style={{ fontSize: '12px', color: pickup.status === 'completed' ? '#006036' : '#ba1a1a', fontWeight: 600, padding: '8px 0' }}>
                      {pickup.status === 'completed' ? 'Points Awarded ✓' : 'Cancelled ✕'}
                    </span>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
