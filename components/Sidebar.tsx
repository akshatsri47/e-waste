'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supbase/client'
import { useState } from 'react'

interface SidebarProps {
  isAdmin?: boolean
  userName?: string
  userEmail?: string
  totalPoints?: number
}

const userNav = [
  { href: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
  { href: '/dashboard/pickups', label: 'Pickups', icon: 'local_shipping' },
  { href: '/dashboard/impact', label: 'Impact', icon: 'monitoring' },
  { href: '/dashboard/wallet', label: 'Token Wallet', icon: 'account_balance_wallet' },
  { href: '/dashboard/map', label: 'Find Centers', icon: 'map' },
]

const userBottomNav = [
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
  { href: '/dashboard/help', label: 'Support', icon: 'help_outline' },
]

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: 'grid_view' },
  { href: '/admin/pickups', label: 'All Pickups', icon: 'local_shipping' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'monitoring' },
]

export default function Sidebar({ isAdmin = false, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') return pathname === href
    return pathname.startsWith(href)
  }

  const mainNav = isAdmin ? adminNav : userNav

  return (
    <nav style={{
      width: '280px', minWidth: '280px', height: '100vh', position: 'sticky', top: 0,
      backgroundColor: 'rgba(245, 243, 243, 0.7)', color: '#006036',
      fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 500,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '40px 24px', zIndex: 40, backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(190, 201, 190, 0.15)'
    }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: '20px', color: '#006036', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #006036, #1a7a4a)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M10 16l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 8l-2 4M10 8l2 4M16 6v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          Evolve
          {isAdmin && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: '#006036', color: 'white', padding: '2px 8px', borderRadius: '9999px' }}>ADMIN</span>}
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mainNav.map(item => {
            const active = isActive(item.href)
            return (
              <li key={item.href} style={{ margin: 0 }}>
                <Link href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '9999px', textDecoration: 'none',
                  backgroundColor: active ? '#006036' : 'transparent',
                  color: active ? '#ffffff' : '#1b1c1c',
                  fontWeight: active ? 600 : 500,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#e4e2e2' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {!isAdmin && (
          <Link href="/dashboard/new" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #006036, #1a7a4a)', color: '#ffffff',
            borderRadius: '12px', padding: '12px 16px', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            boxShadow: '0 4px 14px 0 rgba(0,96,54,0.39)', transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Schedule New Pickup
          </Link>
        )}

        {!isAdmin && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {userBottomNav.map(item => {
              const active = isActive(item.href)
              return (
                <li key={item.href} style={{ margin: 0 }}>
                  <Link href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '9999px', textDecoration: 'none',
                    backgroundColor: active ? '#e4e2e2' : 'transparent',
                    color: '#1b1c1c', fontWeight: active ? 600 : 500,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#e4e2e2' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0 16px', borderTop: '1px solid rgba(190, 201, 190, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#1a7a4a', color: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: '120px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1b1c1c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName || 'User'}</span>
              <span style={{ fontSize: '12px', color: '#3f4941', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</span>
            </div>
          </div>
          <button onClick={handleSignOut} disabled={signingOut} style={{ color: '#ba1a1a', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(186, 26, 26, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Sign Out">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
