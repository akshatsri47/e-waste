import { createClient } from '@/utils/supbase/server'
import { NextResponse } from 'next/server'

const POINTS_CO2: Record<string, { points: number; co2: number }> = {
  phone:     { points: 50,  co2: 0.5 },
  laptop:    { points: 120, co2: 1.8 },
  tablet:    { points: 80,  co2: 1.2 },
  tv:        { points: 150, co2: 2.5 },
  appliance: { points: 100, co2: 2.0 },
  cables:    { points: 20,  co2: 0.2 },
  other:     { points: 30,  co2: 0.3 },
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    item_type, is_working, condition, power_status, missing_parts,
    age_range, notes, quantity, address, time_slot, image_urls,
    pickup_type, recycler_id,
  } = body

  // Create pickup
  const { data: pickup, error: pickupErr } = await supabase
    .from('pickups')
    .insert({
      user_id: user.id,
      status: 'scheduled',
      address,
      time_slot,
      pickup_type: pickup_type || 'pickup',
      recycler_id: recycler_id || null,
    })
    .select()
    .single()

  if (pickupErr) return NextResponse.json({ error: pickupErr.message }, { status: 500 })

  // Create pickup_item
  const { data: pickupItem, error: itemErr } = await supabase
    .from('pickup_items')
    .insert({
      pickup_id: pickup.id,
      item_type,
      is_working,
      condition,
      power_status,
      missing_parts,
      age_range,
      notes,
      quantity: quantity || 1,
    })
    .select()
    .single()

  if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 })

  // Store image URLs
  if (image_urls && image_urls.length > 0) {
    await supabase.from('item_images').insert(
      image_urls.map((url: string) => ({ pickup_item_id: pickupItem.id, image_url: url }))
    )
  }

  return NextResponse.json({ pickup_id: pickup.id })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('pickups')
    .select('*, pickup_items(*, item_images(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
