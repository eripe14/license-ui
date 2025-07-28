import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { key } = await req.json()
    const { data, error } = await supabase
        .from('licenses')
        .select('status')
        .eq('key', key)
        .single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newStatus = data.status === 'active' ? 'inactive' : 'active'
    await supabase.from('licenses').update({ status: newStatus }).eq('key', key)
    return NextResponse.json({ status: newStatus })
}
