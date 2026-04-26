'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/RecyclerMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-lg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
        <div style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>Loading map…</div>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '4px' }}>
          Nearby Recycling Centers
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>
          Find certified e-waste recyclers in Chennai. Click a pin for details.
        </p>
      </div>
      <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <Map />
      </div>
    </div>
  )
}
