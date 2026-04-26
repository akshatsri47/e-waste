import { createClient } from '@/utils/supbase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const pickup_id = formData.get('pickup_id') as string
  const item_id = formData.get('item_id') as string

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `${pickup_id}/${item_id || 'tmp'}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('pickup-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('pickup-images').getPublicUrl(path)

  return NextResponse.json({ url: publicUrl, path })
}
