import { createClient } from '@/utils/supbase/server'
import AdminPickupsTable from '@/components/AdminPickupsTable'

export default async function AdminPickupsPage() {
  const supabase = await createClient()

  const { data: pickups } = await supabase
    .from('pickups')
    .select('*, users(name, email), pickup_items(item_type, quantity, points_awarded), recyclers(name)')
    .order('created_at', { ascending: false })

  return <AdminPickupsTable initialPickups={pickups || []} />
}
