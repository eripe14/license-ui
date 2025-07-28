import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    const { licenseKey, serverId } = await req.json()
    const supabase = await createServerSupabase()

    // Sprawdź licencję
    const { data: lic, error: licErr } = await supabase
        .from('licenses')
        .select('*')
        .eq('key', licenseKey)
        .eq('status', 'active')
        .single()

    if (licErr || !lic) {
        return NextResponse.json({ error: 'license_not_found' }, { status: 404 })
    }

    // Sprawdź, czy już jest activation
    const { data: existing } = await supabase
        .from('activations')
        .select('*')
        .eq('license_key', licenseKey)
        .single()

    if (existing) {
        // Jeśli aktywacja istnieje, sprawdź czy to ten sam serwer
        if (existing.server_id === serverId) {
            // Ten sam serwer - zwróć istniejący instanceId
            return NextResponse.json({ instanceId: existing.id })
        } else {
            // Inny serwer - błąd
            return NextResponse.json({ error: 'license_used_on_different_server' }, { status: 400 })
        }
    }

    // Utwórz nową aktywację
    const instanceId = uuidv4()
    const { error: actErr } = await supabase
        .from('activations')
        .insert({
            id: instanceId,
            license_key: licenseKey,
            server_id: serverId,
        })

    if (actErr) {
        return NextResponse.json({ error: 'activation_failed' }, { status: 500 })
    }

    return NextResponse.json({ instanceId })
}