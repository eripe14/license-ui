import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const licenseKey = uuidv4()
    const { duration } = await req.json()
    const support_expires = duration === 'lifetime'
        ? null
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1))

    const { error } = await supabase.from('licenses').insert({
        key: licenseKey,
        owner: user?.email ?? null,
        status: 'active',
        support_expires
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ licenseKey })
}
