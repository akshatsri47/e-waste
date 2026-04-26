'use client'

import Link from 'next/link'
import { format } from 'date-fns'

const ITEM_ICONS: Record<string, string> = {
  phone: 'smartphone',
  laptop: 'laptop_mac',
  tablet: 'tablet_mac',
  tv: 'tv',
  appliance: 'kitchen',
  cables: 'cable',
  other: 'recycling',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  scheduled:   { bg: '#e8f5e9', color: '#1b5e20', label: 'Scheduled' },
  in_progress: { bg: '#fff8e1', color: '#e65100', label: 'In Progress' },
  completed:   { bg: '#abffc6', color: '#00522e', label: 'Completed' },
  cancelled:   { bg: '#ffdad6', color: '#93000a', label: 'Cancelled' },
}

export interface PickupCardData {
  id: string
  status: string
  address: string | null
  time_slot: string | null
  created_at: string
  pickup_type: string | null
  pickup_items: { item_type: string; quantity: number; points_awarded: number | null }[]
}

export function PickupCard({ pickup }: { pickup: PickupCardData }) {
  const items = pickup.pickup_items ?? []
  const mainItem = items[0] ?? null
  const totalQty = items.reduce((s, i) => s + (i.quantity || 1), 0)
  const totalPoints = items.reduce((s, i) => s + (i.points_awarded || 0), 0)
  const statusStyle = STATUS_STYLE[pickup.status] ?? STATUS_STYLE['scheduled']

  const displayDate = pickup.time_slot
    ? new Date(pickup.time_slot)
    : new Date(pickup.created_at)
  const isValidDate = !isNaN(displayDate.getTime())

  return (
    <Link href={`/dashboard/pickups/${pickup.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        style={{
          padding: '20px 24px',
          borderRadius: '14px',
          border: '1px solid #e4e2e2',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = '0 4px 16px rgba(0,96,54,0.08)'
          el.style.borderColor = '#bec9be'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = 'none'
          el.style.borderColor = '#e4e2e2'
        }}
      >
        {/* Icon + Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              backgroundColor: '#f0faf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#006036',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined">
              {mainItem ? ITEM_ICONS[mainItem.item_type] ?? 'recycling' : 'recycling'}
            </span>
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#1b1c1c' }}>
              {isValidDate ? format(displayDate, 'MMMM d, yyyy') : 'Date not set'}
              {pickup.time_slot && isValidDate && (
                <span style={{ fontWeight: 400, color: '#6f7a70', fontSize: '13px', marginLeft: '8px' }}>
                  {format(new Date(pickup.time_slot), 'h:mm a')}
                </span>
              )}
            </p>
            <p style={{ fontSize: '13px', color: '#6f7a70' }}>
              {totalQty} item{totalQty !== 1 ? 's' : ''}
              {pickup.address ? ` · ${pickup.address}` : ''}
              {pickup.pickup_type === 'dropoff' ? ' · Drop-off' : ''}
            </p>
          </div>
        </div>

        {/* Right: points + status + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {totalPoints > 0 && (
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#006036',
                fontFamily: '"Roboto Mono", monospace',
              }}
            >
              +{totalPoints} pts
            </span>
          )}
          <span
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              letterSpacing: '0.02em',
            }}
          >
            {statusStyle.label}
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#bec9be' }}>
            chevron_right
          </span>
        </div>
      </div>
    </Link>
  )
}
