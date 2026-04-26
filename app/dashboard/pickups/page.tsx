import { createClient } from '@/utils/supbase/server'
import Link from 'next/link'
import { PickupCard } from '@/components/PickupCard'

export const dynamic = 'force-dynamic'

export default async function PickupsListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: pickups, error } = await supabase
    .from('pickups')
    .select('id, status, address, time_slot, created_at, pickup_type, pickup_items(item_type, quantity, points_awarded)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[PickupsListPage] Supabase error:', error.message)
  }

  const list = (pickups ?? []) as any[]

  return (
    <div
      style={{
        flex: 1,
        padding: '48px',
        backgroundColor: '#fbf9f8',
        color: '#1b1c1c',
        fontFamily: '"Inter", sans-serif',
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1b1c1c',
              letterSpacing: '-0.02em',
            }}
          >
            My Pickups
          </h1>
          <p style={{ fontSize: '14px', color: '#6f7a70', marginTop: '4px' }}>
            {list.length} pickup{list.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/dashboard/new" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#006036',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              add
            </span>
            Schedule New
          </button>
        </Link>
      </div>

      {/* Pickup Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list.length === 0 ? (
          <div
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e4e2e2',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '48px',
                color: '#bec9be',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              inventory_2
            </span>
            <p style={{ color: '#6f7a70', fontWeight: 500, fontSize: '16px' }}>
              No pickups yet
            </p>
            <p style={{ color: '#a0a8a0', fontSize: '14px', marginTop: '4px' }}>
              Schedule your first e-waste pickup to get started.
            </p>
          </div>
        ) : (
          list.map((pickup) => <PickupCard key={pickup.id} pickup={pickup} />)
        )}
      </div>
    </div>
  )
}
