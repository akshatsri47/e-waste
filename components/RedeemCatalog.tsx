'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Reward {
  id: string
  title: string
  brand: string
  description: string
  points_cost: number
  category: 'voucher' | 'electronics' | 'apparel'
  image_color: string
  icon: string
}

const REWARDS: Reward[] = [
  { id: 'r1', title: '₹500 Zomato Coupon', brand: 'Zomato', description: 'Get a flat ₹500 off on your next food delivery order.', points_cost: 250, category: 'voucher', image_color: '#E23744', icon: 'restaurant' },
  { id: 'r2', title: '₹1000 Amazon Gift Card', brand: 'Amazon', description: 'Shop anything on Amazon India with this digital gift card.', points_cost: 500, category: 'voucher', image_color: '#FF9900', icon: 'shopping_bag' },
  { id: 'r3', title: 'Sony WH-1000XM4', brand: 'Sony', description: 'Premium noise-canceling wireless headphones.', points_cost: 15000, category: 'electronics', image_color: '#1a1a1a', icon: 'headphones' },
  { id: 'r4', title: 'Apple AirPods Pro', brand: 'Apple', description: 'Active Noise Cancellation and immersive sound.', points_cost: 12000, category: 'electronics', image_color: '#f5f5f7', icon: 'earbuds' },
  { id: 'r5', title: 'Evolve Eco-Shirt', brand: 'Evolve', description: 'Premium t-shirt made from 100% recycled cotton.', points_cost: 300, category: 'apparel', image_color: '#006036', icon: 'checkroom' },
  { id: 'r6', title: '₹200 Swiggy Voucher', brand: 'Swiggy', description: 'Instant discount on food and Instamart orders.', points_cost: 100, category: 'voucher', image_color: '#FC8019', icon: 'fastfood' },
]

export default function RedeemCatalog({ availablePoints }: { availablePoints: number }) {
  const [filter, setFilter] = useState<'all' | 'voucher' | 'electronics' | 'apparel'>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [points, setPoints] = useState(availablePoints)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleRedeem = (reward: Reward) => {
    if (points < reward.points_cost) {
      showToast(`Not enough tokens for ${reward.title}.`, 'error')
      return
    }
    // Simulate redemption
    setPoints(prev => prev - reward.points_cost)
    showToast(`Successfully redeemed ${reward.title}! Check your email.`, 'success')
  }

  const filtered = filter === 'all' ? REWARDS : REWARDS.filter(r => r.category === filter)

  return (
    <div style={{ flex: 1, padding: '48px', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box', minHeight: '100vh', width: '100%', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          background: toast.type === 'success' ? '#065F46' : '#991b1b',
          color: 'white', padding: '12px 24px', borderRadius: '999px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideDown 0.3s ease-out'
        }}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header and Balance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <Link href="/dashboard/wallet" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6f7a70', textDecoration: 'none', marginBottom: '16px', transition: 'color 0.2s' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back to Wallet
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1b1c1c', letterSpacing: '-0.02em', marginBottom: '8px' }}>Rewards Catalog</h1>
          <p style={{ fontSize: '15px', color: '#3f4941', maxWidth: '600px', lineHeight: 1.5 }}>Redeem your Evolve tokens for exclusive rewards, vouchers, and premium electronics. Your sustainable choices pay off.</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e4e2e2', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #006036, #1a7a4a)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">stars</span>
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#6f7a70', letterSpacing: '0.05em' }}>Available Tokens</span>
            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', color: '#1b1c1c', lineHeight: 1, marginTop: '4px' }}>
              {points}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {['all', 'voucher', 'electronics', 'apparel'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} style={{
            padding: '10px 20px', borderRadius: '999px',
            backgroundColor: filter === f ? '#1b1c1c' : '#ffffff',
            color: filter === f ? '#ffffff' : '#3f4941',
            fontWeight: filter === f ? 600 : 500, fontSize: '14px',
            border: filter === f ? '1px solid #1b1c1c' : '1px solid #e4e2e2',
            cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Bento Grid for Rewards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filtered.map(reward => {
          const canAfford = points >= reward.points_cost;
          return (
            <div key={reward.id} style={{
              backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden',
              border: '1px solid #e4e2e2', display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 32px -12px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px -12px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px -12px rgba(0,0,0,0.05)' }}>
              
              {/* Card Image Area */}
              <div style={{ height: '160px', backgroundColor: reward.image_color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#ffffff', opacity: reward.category === 'electronics' ? 0.9 : 0.4 }}>{reward.icon}</span>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#1b1c1c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {reward.brand}
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', margin: 0, lineHeight: 1.3 }}>{reward.title}</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#6f7a70', lineHeight: 1.5, margin: '0 0 24px 0', flex: 1 }}>{reward.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f5f3f3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#006036' }}>stars</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#1b1c1c' }}>{reward.points_cost}</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    style={{
                      padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: canAfford ? 'pointer' : 'not-allowed',
                      backgroundColor: canAfford ? '#1b1c1c' : '#f5f3f3',
                      color: canAfford ? '#ffffff' : '#a3aba5',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => { if(canAfford) e.currentTarget.style.backgroundColor = '#3f4941' }}
                    onMouseLeave={(e) => { if(canAfford) e.currentTarget.style.backgroundColor = '#1b1c1c' }}
                  >
                    {canAfford ? 'Redeem' : 'Locked'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
