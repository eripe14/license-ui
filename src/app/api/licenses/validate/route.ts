import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const { licenseKey, instanceId } = await req.json()
    const supabase = await createServerSupabase()

    const { data: act } = await supabase
        .from('activations')
        .select('id, support_expires')
        .eq('id', instanceId)
        .eq('license_key', licenseKey)
        .single()

    if (!act) return NextResponse.json({ valid: false })

    const { data: lic } = await supabase
        .from('licenses')
        .select('support_expires')
        .eq('key', licenseKey)
        .single()

    const supported = lic?.support_expires && new Date(lic.support_expires) > new Date()

    return NextResponse.json({ valid: true, supported })
}
