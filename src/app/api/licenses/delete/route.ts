import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key } = await req.json()
    const { error } = await supabase.from('licenses').delete().eq('key', key)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
