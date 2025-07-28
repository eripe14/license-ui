import React from 'react'
import {createServerSupabase} from '@/utils/supabase/server'
import LicenseTable from './LicenseTable'

export default async function DashboardPage() {
    const supabase = await createServerSupabase()
    const {data: {user}} = await supabase.auth.getUser()

    if (user?.email !== process.env.ADMIN_EMAIL) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No access</h2>
                    <p className="text-gray-400">You do not have permission to be here!</p>
                </div>
            </div>
        )
    }

    const { data: licenses } = await supabase
        .from('licenses')
        .select(`
            key,
            status,
            support_expires,
            activations(server_id)
          `)

    return <LicenseTable licenses={licenses || []} />
}