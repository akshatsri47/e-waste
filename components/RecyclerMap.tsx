'use client'

import { useEffect, useRef } from 'react'

const CHENNAI_RECYCLERS = [
  { id: 1, name: 'Attero Recycling', address: '7/1 Industrial Estate, Guindy, Chennai 600032', lat: 13.0067, lng: 80.2206 },
  { id: 2, name: 'E-Parisaraa', address: '23 Ambattur Industrial Estate, Chennai 600058', lat: 13.1143, lng: 80.1548 },
  { id: 3, name: 'Gem Enviro Solutions', address: '45 Perungudi IT Park, Chennai 600096', lat: 12.9722, lng: 80.2477 },
  { id: 4, name: 'Eco Green Unit', address: '12 SIDCO Industrial Estate, Thirumazhisai, Chennai 600124', lat: 13.0700, lng: 80.0586 },
  { id: 5, name: 'Recycling House', address: '89 Velachery Main Road, Chennai 600042', lat: 12.9847, lng: 80.2205 },
  { id: 6, name: 'Green Worms', address: '15 Anna Nagar West, Chennai 600040', lat: 13.0827, lng: 80.2000 },
  { id: 7, name: 'Saahas Zero Waste', address: '3rd Cross Street, OMR Road, Chennai 600119', lat: 12.8500, lng: 80.2273 },
]

export default function RecyclerMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet
    import('leaflet').then(L => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [13.0827, 80.2707],
        zoom: 11,
        zoomControl: true,
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom green icon
      const greenIcon = L.divIcon({
        html: `<div style="
          width:36px; height:36px;
          background: linear-gradient(135deg, #1A7A4A, #2DB56C);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          display:flex; align-items:center; justify-content:center;
        "><span style="transform:rotate(45deg); font-size:14px;">♻️</span></div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      })

      CHENNAI_RECYCLERS.forEach(r => {
        L.marker([r.lat, r.lng], { icon: greenIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 4px;">
              <div style="font-size:15px; font-weight:700; color:#1A1A1A; margin-bottom:6px;">♻️ ${r.name}</div>
              <div style="font-size:12px; color:#4B4B4B; line-height:1.5;">${r.address}</div>
            </div>
          `, { maxWidth: 260 })
      })

      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords
          const userIcon = L.divIcon({
            html: `<div style="
              width:14px; height:14px;
              background: #4285F4;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 0 4px rgba(66,133,244,0.3);
            "></div>`,
            className: '',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })
          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;">📍 Your location</div>')
          map.setView([latitude, longitude], 12)
        }, () => {})
      }
    })

    // Load leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
