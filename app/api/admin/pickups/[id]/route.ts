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

async function awardPoints(supabase: Awaited<ReturnType<typeof import('@/utils/supbase/server').createClient>>, pickupId: string, userId: string) {
  const { data: items } = await supabase
    .from('pickup_items')
    .select('id, item_type, quantity, points_awarded')
    .eq('pickup_id', pickupId)

  if (!items || items.length === 0) return 0

  // Skip if already awarded
  if (items.every(i => (i.points_awarded || 0) > 0)) return 0

  let totalPoints = 0
  for (const item of items) {
    const { points, co2 } = POINTS_CO2[item.item_type] || POINTS_CO2.other
    const qty = item.quantity || 1
    const earned = points * qty
    const co2kg = co2 * qty
    totalPoints += earned
    await supabase.from('pickup_items').update({
      points_awarded: earned,
      co2_saved_kg: co2kg,
      points_calculated: true,
    }).eq('id', item.id)
  }

  const { data: userRow } = await supabase.from('users').select('total_points').eq('id', userId).single()
  await supabase.from('users').update({
    total_points: (userRow?.total_points || 0) + totalPoints,
  }).eq('id', userId)

  return totalPoints
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminProfile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!adminProfile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { status } = body

  const { data: pickup } = await supabase
    .from('pickups')
    .select('status, user_id, points_awarded_at')
    .eq('id', id)
    .single()

  if (!pickup) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const allowed: Record<string, string[]> = { scheduled: ['completed', 'cancelled'] }
  if (!allowed[pickup.status]?.includes(status)) {
    return NextResponse.json({ error: `Cannot transition from ${pickup.status} to ${status}` }, { status: 400 })
  }

  // Mark completed + award points atomically
  const now = new Date().toISOString()
  await supabase.from('pickups').update({
    status,
    ...(status === 'completed' ? { points_awarded_at: now } : {}),
  }).eq('id', id)

  let pointsAwarded = 0
  if (status === 'completed') {
    pointsAwarded = await awardPoints(supabase, id, pickup.user_id)
  }

  return NextResponse.json({ success: true, pointsAwarded })
}
