'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supbase/client'

interface Recycler { id: string; name: string; address: string; latitude: number; longitude: number }

const ITEM_TYPES = [
  { id: 'phone',     label: 'Smartphones', icon: 'smartphone', desc: 'Smartphones & feature phones' },
  { id: 'laptop',    label: 'Laptops',     icon: 'laptop_mac', desc: 'Laptops & notebooks' },
  { id: 'tablet',    label: 'Tablets',     icon: 'tablet_mac', desc: 'Tablets & e-readers' },
  { id: 'tv',        label: 'Monitors',    icon: 'tv',         desc: 'TVs & monitors' },
  { id: 'appliance', label: 'Appliances',  icon: 'blender',    desc: 'Small home appliances' },
  { id: 'cables',    label: 'Cables',      icon: 'cable',      desc: 'Cables, chargers & accessories' },
  { id: 'other',     label: 'Other',       icon: 'recycling',  desc: 'Other electronic waste' },
]

const POINTS_ESTIMATE: Record<string, { points: number; co2: number }> = {
  phone:     { points: 50,  co2: 0.5 },
  laptop:    { points: 120, co2: 1.8 },
  tablet:    { points: 80,  co2: 1.2 },
  tv:        { points: 150, co2: 2.5 },
  appliance: { points: 100, co2: 2.0 },
  cables:    { points: 20,  co2: 0.2 },
  other:     { points: 30,  co2: 0.3 },
}

const STEPS = ['Items', 'Details', 'Photos', 'Schedule']

const inputStyle = {
  width: '100%', backgroundColor: '#f5f3f3', border: '1px solid rgba(190, 201, 190, 0.5)',
  borderRadius: '8px', padding: '12px 16px', fontSize: '16px', color: '#1b1c1c',
  fontFamily: '"Inter", sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '16px',
  transition: 'box-shadow 0.2s',
}
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 500, color: '#3f4941', marginBottom: '8px', fontFamily: '"Inter", sans-serif' }

function Select({ label, id, value, onChange, options }: {
  label: string; id: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle} htmlFor={id}>{label}</label>
      <select
        id={id} value={value} onChange={e => onChange(e.target.value)}
        style={{
          ...inputStyle, appearance: 'none', cursor: 'pointer',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px'
        }}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f5f3f3', padding: '16px 24px', borderRadius: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
      {STEPS.map((s, i) => {
        const isActive = i === current
        const isPast = i < current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: (isActive || isPast) ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: (isActive || isPast) ? '#006036' : '#e4e2e2', color: (isActive || isPast) ? '#fff' : '#3f4941', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                {isPast ? <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span> : i + 1}
              </div>
              <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500, color: isActive ? '#006036' : '#3f4941' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <span className="material-symbols-outlined" style={{ color: '#bec9be', fontSize: '16px' }}>chevron_right</span>}
          </div>
        )
      })}
    </div>
  )
}

export default function NewPickupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [itemType, setItemType] = useState('')
  const [isWorking, setIsWorking] = useState('')
  const [condition, setCondition] = useState('')
  const [powerStatus, setPowerStatus] = useState('')
  const [missingParts, setMissingParts] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [address, setAddress] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [pickupType, setPickupType] = useState<'pickup' | 'dropoff'>('pickup')
  const [recyclerId, setRecyclerId] = useState('')
  const [recyclers, setRecyclers] = useState<Recycler[]>([])
  const [pickupId, setPickupId] = useState('')

  useEffect(() => {
    fetch('/api/recyclers').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRecyclers(data)
    }).catch(() => {})
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    setImages(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const uploadImages = async (pid: string): Promise<string[]> => {
    const urls: string[] = []
    for (const file of images) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('pickup_id', pid)
      fd.append('item_id', 'tmp')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        urls.push(url)
      }
    }
    return urls
  }

  const handleSubmit = async () => {
    if (!timeSlot) { setError('Time slot required'); return }
    if (pickupType === 'pickup' && !address) { setError('Address required for home pickup'); return }
    if (pickupType === 'dropoff' && !recyclerId) { setError('Please select a drop-off center'); return }
    setSubmitting(true)
    setError('')

    try {
      const selectedCenter = recyclers.find(r => r.id === recyclerId)
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: itemType, is_working: isWorking, condition,
          power_status: powerStatus, missing_parts: missingParts,
          age_range: ageRange, notes, quantity,
          address: pickupType === 'dropoff' ? (selectedCenter?.address || '') : address,
          time_slot: timeSlot,
          pickup_type: pickupType,
          recycler_id: pickupType === 'dropoff' ? recyclerId : null,
          image_urls: [],
        }),
      })

      if (!res.ok) throw new Error('Failed to create pickup')
      const { pickup_id } = await res.json()

      // Upload images
      if (images.length > 0) {
        const urls = await uploadImages(pickup_id)
        const supabase = createClient()
        const { data: items } = await supabase.from('pickup_items').select('id').eq('pickup_id', pickup_id)
        if (items && items[0]) {
          await supabase.from('item_images').insert(urls.map(url => ({ pickup_item_id: items[0].id, image_url: url })))
        }
      }

      setPickupId(pickup_id)
      setStep(4) // Move to Success Screen
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const canNext = () => {
    if (step === 0) return !!itemType
    if (step === 1) return !!isWorking && !!condition && !!powerStatus && !!ageRange
    if (step === 2) return true
    if (step === 3) return !!timeSlot && (pickupType === 'pickup' ? !!address : !!recyclerId)
    return false
  }

  // --- Step 4: Success View (Replaces Full Page) ---
  if (step === 4) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', width: '100%', fontFamily: '"Inter", sans-serif', padding: '48px', boxSizing: 'border-box' }}>
        <div style={{ width: '96px', height: '96px', backgroundColor: '#b3f1c2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#006036' }}>check_circle</span>
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 700, color: '#1b1c1c', letterSpacing: '-0.02em', marginBottom: '16px', textAlign: 'center' }}>Pickup Scheduled!</h1>
        <p style={{ fontSize: '16px', color: '#3f4941', maxWidth: '450px', textAlign: 'center', marginBottom: '40px' }}>Your sustainable action has been recorded. We're looking forward to collecting your items.</p>
        
        <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)', border: '1px solid #e4e2e2', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: 'linear-gradient(to right, #006036, #1a7a4a)' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>Booking Reference</p>
                <p style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '22px', fontWeight: 500, backgroundColor: '#f5f3f3', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e4e2e2' }}>{pickupId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div style={{ backgroundColor: '#b3f1c2', padding: '8px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#006036' }}>pending_actions</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#006036' }}>Confirmed</span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4e2e2' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f5f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#006036' }}>event</span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 600 }}>Date & Time</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>{new Date(timeSlot).toLocaleDateString()}</p>
                  <p style={{ fontSize: '14px', color: '#3f4941', mt: 1 }}>{new Date(timeSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f5f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#006036' }}>location_on</span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 600 }}>Location</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>{pickupType === 'pickup' ? 'Home Pickup' : 'Drop-off Center'}</p>
                  <p style={{ fontSize: '14px', color: '#3f4941', mt: 1 }}>{pickupType === 'pickup' ? address : recyclers.find(r => r.id === recyclerId)?.name}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4e2e2' }}></div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => router.push('/dashboard')} style={{ padding: '16px 32px', backgroundColor: '#f5f3f3', color: '#1b1c1c', borderRadius: '12px', fontWeight: 600, fontSize: '16px', border: '1px solid #e4e2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span> Home
              </button>
              <button onClick={() => router.push(`/dashboard/pickups/${pickupId}`)} style={{ padding: '16px 32px', background: 'linear-gradient(to bottom right, #006036, #1a7a4a)', color: '#fff', borderRadius: '12px', fontWeight: 600, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,96,54,0.2)', transition: 'opacity 0.2s' }}>
                View Details <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedEst = itemType ? POINTS_ESTIMATE[itemType] : null
  const totalPts = selectedEst ? selectedEst.points * quantity : 0
  const totalCO2 = selectedEst ? (selectedEst.co2 * quantity).toFixed(1) : '0'

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', color: '#1b1c1c', backgroundColor: '#fbf9f8', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '48px', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#006036', marginBottom: '8px' }}>Schedule Pickup</h1>
        <p style={{ fontSize: '16px', color: '#3f4941' }}>Complete the steps below to schedule your recycling service.</p>
      </div>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Content Area */}
        <div style={{ flex: '1 1 600px', minWidth: 0 }}>
          <StepIndicator current={step} />

          {/* Step 0: Item Type */}
          {step === 0 && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>What are you recycling today?</h2>
              <p style={{ fontSize: '14px', color: '#3f4941', marginBottom: '24px' }}>Select the category of the electronic device.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {ITEM_TYPES.map(t => {
                  const isSelected = itemType === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setItemType(t.id)}
                      style={{
                        padding: '24px', borderRadius: '16px', textAlign: 'left', cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                        backgroundColor: isSelected ? '#ffffff' : '#f5f3f3',
                        border: `2px solid ${isSelected ? '#006036' : 'transparent'}`,
                        boxShadow: isSelected ? '0 16px 32px rgba(27,28,28,0.06)' : 'none',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '20px',
                        outline: 'none',
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: isSelected ? '#1a7a4a' : '#e4e2e2', color: isSelected ? '#ffffff' : '#3f4941', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{t.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '4px' }}>{t.label}</div>
                        <div style={{ fontSize: '13px', color: '#3f4941' }}>{t.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', marginBottom: '24px' }}>Tell us about the item</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'x: 20px, y: 0' }}>
                  <Select label="Is the device working?" id="is_working" value={isWorking} onChange={setIsWorking} options={[
                    { value: 'yes', label: 'Yes — fully working' },
                    { value: 'partial', label: 'Partially working' },
                    { value: 'no', label: 'No — not working' },
                  ]} />

                  <Select label="Physical condition" id="condition" value={condition} onChange={setCondition} options={[
                    { value: 'good', label: 'Good — minimal wear' },
                    { value: 'minor_damage', label: 'Minor damage' },
                    { value: 'heavy_damage', label: 'Heavy damage' },
                  ]} />

                  <Select label="Power status" id="power_status" value={powerStatus} onChange={setPowerStatus} options={[
                    { value: 'powers_on', label: 'Powers on' },
                    { value: 'does_not', label: 'Does not power on' },
                    { value: 'unknown', label: 'Unknown' },
                  ]} />

                  <Select label="Age range" id="age_range" value={ageRange} onChange={setAgeRange} options={[
                    { value: '<1', label: 'Less than 1 year' },
                    { value: '1-3', label: '1–3 years' },
                    { value: '3-5', label: '3–5 years' },
                    { value: '5+', label: 'More than 5 years' },
                  ]} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="missing_parts">Missing parts (optional)</label>
                  <input id="missing_parts" style={inputStyle} placeholder="e.g. charger, battery cover" value={missingParts} onChange={e => setMissingParts(e.target.value)} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="notes">Additional notes (optional)</label>
                  <textarea id="notes" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Any other details…" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                <div>
                  <label style={labelStyle} htmlFor="quantity">Quantity</label>
                  <input id="quantity" type="number" min={1} max={50} style={{ ...inputStyle, maxWidth: '150px' }} value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>Upload Photos (Optional)</h2>
                <p style={{ fontSize: '14px', color: '#3f4941', marginBottom: '24px' }}>Up to 3 photos help our recyclers assess the item faster.</p>

                {imagePreviews.length < 3 && (
                  <label htmlFor="photo-upload" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed #bec9be', borderRadius: '16px', padding: '48px', cursor: 'pointer',
                    backgroundColor: '#f5f3f3', transition: 'all 0.2s', marginBottom: '24px'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#006036', marginBottom: '16px' }}>add_a_photo</span>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>Click to upload photos</div>
                    <div style={{ fontSize: '13px', color: '#3f4941', marginTop: '8px' }}>PNG, JPG up to 5MB each</div>
                    <input id="photo-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />
                  </label>
                )}

                {imagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={src} alt={`Preview ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => removeImage(i)} style={{
                          position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', marginBottom: '24px' }}>Service Type</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {([['pickup','local_shipping','Home Pickup','We come to you'],['dropoff','storefront','Drop-off','Bring to a center']] as const).map(([val,icon,title,desc]) => (
                    <button key={val} onClick={() => { setPickupType(val); setRecyclerId(''); setAddress(''); }}
                      style={{
                        padding: '24px', borderRadius: '16px', textAlign: 'left', cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                        border: `2px solid ${pickupType === val ? '#006036' : '#e4e2e2'}`,
                        backgroundColor: pickupType === val ? '#ffffff' : '#f5f3f3',
                        boxShadow: pickupType === val ? '0 16px 32px rgba(27,28,28,0.06)' : 'none', transition: 'all 0.2s', outline: 'none'
                      }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: pickupType === val ? '#1a7a4a' : '#e4e2e2', color: pickupType === val ? '#ffffff' : '#3f4941', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c', marginBottom: '4px' }}>{title}</div>
                      <div style={{ fontSize: '13px', color: '#3f4941' }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 32px rgba(27,28,28,0.06)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c', marginBottom: '24px' }}>Location & Time</h2>
                
                {pickupType === 'dropoff' && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Select Nearest Center</label>
                    {recyclers.length === 0 ? (
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f5f3f3', fontSize: '14px', color: '#3f4941' }}>Loading centers…</div>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {recyclers.map(r => (
                          <button key={r.id} onClick={() => setRecyclerId(r.id)}
                            style={{
                              width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                              border: `2px solid ${recyclerId === r.id ? '#006036' : 'transparent'}`,
                              backgroundColor: recyclerId === r.id ? '#ffffff' : '#f5f3f3',
                              boxShadow: recyclerId === r.id ? '0 8px 16px rgba(0,0,0,0.05)' : 'none',
                              display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', outline: 'none'
                            }}>
                            <span className="material-symbols-outlined" style={{ color: recyclerId === r.id ? '#006036' : '#6f7a70' }}>location_on</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1b1c1c' }}>{r.name}</div>
                              <div style={{ fontSize: '13px', color: '#3f4941', marginTop: '2px' }}>{r.address}</div>
                            </div>
                            {recyclerId === r.id && <span className="material-symbols-outlined" style={{ color: '#006036' }}>check_circle</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {pickupType === 'pickup' && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle} htmlFor="address">Pickup Address</label>
                    <textarea id="address" style={{ ...inputStyle, resize: 'none', height: '100px' }} placeholder="Enter your full address…" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                )}

                <div>
                  <label style={labelStyle} htmlFor="time_slot">
                    {pickupType === 'pickup' ? 'Preferred Pickup Date & Time' : 'Planned Drop-off Date & Time'}
                  </label>
                  <input id="time_slot" type="datetime-local" style={inputStyle} value={timeSlot} onChange={e => setTimeSlot(e.target.value)} min={new Date().toISOString().slice(0, 16)} />
                </div>

                {error && (
                  <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', backgroundColor: '#ffdad6', color: '#93000a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span> {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Summary (Width: 360px) */}
        <div style={{ width: '100%', maxWidth: '380px', flexShrink: 0, position: 'sticky', top: '100px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 32px 64px rgba(27,28,28,0.04)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '24px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #e4e2e2', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#3f4941' }}>Selected Items</span>
              <span style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 600, fontSize: '18px', color: '#1b1c1c' }}>{itemType ? quantity : 0}</span>
            </div>

            {itemType && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fbf9f8', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#b3f1c2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#37704a' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{ITEM_TYPES.find(t => t.id === itemType)?.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1b1c1c' }}>{ITEM_TYPES.find(t => t.id === itemType)?.label}</p>
                      <p style={{ fontSize: '12px', color: '#3f4941' }}>{quantity} item(s)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ backgroundColor: '#1a7a4a', padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', opacity: 0.1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '100px', color: '#fff' }}>eco</span>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#abffc6', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Est. Token Reward</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '36px', fontWeight: 700, color: '#ffffff' }}>~{totalPts}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#abffc6' }}>TOKENS</span>
                </div>
                <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
                   <div style={{ fontSize: '12px', fontWeight: 600, color: '#abffc6', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>CO2 Impact</div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                     <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>{totalCO2}</span>
                     <span style={{ fontSize: '14px', fontWeight: 500, color: '#abffc6' }}>kg saved</span>
                   </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext()}
                  style={{
                    width: '100%', padding: '16px', background: 'linear-gradient(to bottom right, #006036, #1a7a4a)', color: '#fff', borderRadius: '12px',
                    fontWeight: 600, fontSize: '16px', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: canNext() ? 1 : 0.5, boxShadow: canNext() ? '0 4px 12px rgba(0,96,54,0.2)' : 'none', transition: 'all 0.2s'
                  }}
                >
                  Continue <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canNext() || submitting}
                  style={{
                    width: '100%', padding: '16px', background: 'linear-gradient(to bottom right, #006036, #1a7a4a)', color: '#fff', borderRadius: '12px',
                    fontWeight: 600, fontSize: '16px', border: 'none', cursor: (!canNext() || submitting) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: (!canNext() || submitting) ? 0.7 : 1, boxShadow: (!canNext() || submitting) ? 'none' : '0 4px 12px rgba(0,96,54,0.2)', transition: 'all 0.2s'
                  }}
                >
                  {submitting ? (
                    <>Processing... <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span></>
                  ) : (
                    <>Confirm Schedule <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span></>
                  )}
                </button>
              )}
              
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    width: '100%', padding: '16px', backgroundColor: 'transparent', color: '#3f4941', borderRadius: '12px',
                    fontWeight: 600, fontSize: '16px', border: '1px solid #bec9be', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span> Back
                </button>
              )}
            </div>
            
            {step === STEPS.length - 1 && (
               <p style={{ fontSize: '12px', textAlign: 'center', color: '#3f4941', marginTop: '16px' }}>By confirming, you agree to our pickup terms.</p>
            )}

          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  )
}
