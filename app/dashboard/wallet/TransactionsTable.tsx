'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface Pickup {
  id: string
  status: string
  created_at: string
  pickup_items: any
}

export default function TransactionsTable({ allPickups }: { allPickups: Pickup[] }) {
  const [filter, setFilter] = useState<'all' | 'earned' | 'pending'>('all')

  const filteredPickups = allPickups.filter(pickup => {
    if (filter === 'all') return true
    if (filter === 'earned') return pickup.status === 'completed'
    if (filter === 'pending') return pickup.status === 'scheduled' || pickup.status === 'pending'
    return true
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', margin: 0 }}>Transaction History</h2>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f5f3f3', padding: '4px', borderRadius: '12px' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', backgroundColor: filter === 'all' ? '#ffffff' : 'transparent', color: filter === 'all' ? '#1b1c1c' : '#3f4941', border: 'none', boxShadow: filter === 'all' ? '0 2px 8px rgba(27,28,28,0.06)' : 'none', cursor: 'pointer' }}>All</button>
          <button onClick={() => setFilter('earned')} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', backgroundColor: filter === 'earned' ? '#ffffff' : 'transparent', color: filter === 'earned' ? '#1b1c1c' : '#3f4941', border: 'none', boxShadow: filter === 'earned' ? '0 2px 8px rgba(27,28,28,0.06)' : 'none', cursor: 'pointer' }}>Earned</button>
          <button onClick={() => setFilter('pending')} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', backgroundColor: filter === 'pending' ? '#ffffff' : 'transparent', color: filter === 'pending' ? '#1b1c1c' : '#3f4941', border: 'none', boxShadow: filter === 'pending' ? '0 2px 8px rgba(27,28,28,0.06)' : 'none', cursor: 'pointer' }}>Pending</button>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflowX: 'auto', boxShadow: '0 4px 24px -8px rgba(27,28,28,0.06)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f3f3', color: '#3f4941', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              <th style={{ padding: '16px 24px', fontWeight: 500, borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>Date</th>
              <th style={{ padding: '16px 24px', fontWeight: 500, borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>Booking ID</th>
              <th style={{ padding: '16px 24px', fontWeight: 500, borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>Items</th>
              <th style={{ padding: '16px 24px', fontWeight: 500, textAlign: 'right', borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>Amount</th>
              <th style={{ padding: '16px 24px', fontWeight: 500, borderBottom: '1px solid rgba(190, 201, 190, 0.15)' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {filteredPickups.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#3f4941' }}>No transactions found.</td>
              </tr>
            ) : (
              filteredPickups.map((pickup, index) => {
                const items = pickup.pickup_items as { item_type: string; quantity: number; points_awarded: number }[]
                const itemType = items[0]?.item_type || 'other'
                const pts = items.reduce((s, i) => s + (i.points_awarded || 0), 0)

                let icon = 'devices'
                let itemName = 'E-Waste Collection'

                if (itemType === 'phone') { icon = 'smartphone'; itemName = 'Phone Collection' }
                else if (itemType === 'laptop') { icon = 'laptop_mac'; itemName = 'Laptop Collection' }
                else if (itemType === 'tv') { icon = 'tv'; itemName = 'TV Collection' }
                else if (itemType === 'appliance') { icon = 'kitchen'; itemName = 'Appliance Collection' }

                const isPending = pickup.status === 'scheduled' || pickup.status === 'pending'
                const rowBg = index % 2 === 0 ? 'transparent' : 'rgba(245, 243, 243, 0.3)'

                return (
                  <tr key={pickup.id} style={{ backgroundColor: rowBg, transition: 'background-color 0.2s', borderBottom: '1px solid rgba(190, 201, 190, 0.05)' }}>
                    <td style={{ padding: '20px 24px', color: '#1b1c1c' }}>
                      {format(new Date(pickup.created_at), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#3f4941' }}>
                      #BK-{pickup.id.substring(0, 5).toUpperCase()}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isPending ? '#3f4941' : '#006036' }}>
                          {icon}
                        </span>
                        <span style={{ color: '#1b1c1c' }}>{itemName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: isPending ? 'rgba(63, 73, 65, 0.7)' : '#006036' }}>
                      {pts > 0 ? `+${pts.toFixed(2)}` : 'Pending'}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {isPending ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#e4e2e2', color: '#3f4941' }}>
                          Pending
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(26, 122, 74, 0.1)', color: '#1a7a4a' }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
