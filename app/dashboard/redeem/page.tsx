import { createClient } from '@/utils/supbase/server'
import { redirect } from 'next/navigation'
import RedeemCatalog from '@/components/RedeemCatalog'

export default async function RedeemTokensPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('total_points')
    .eq('id', user.id)
    .single()

  const availablePoints = profile?.total_points || 0

  return <RedeemCatalog availablePoints={availablePoints} />
}
