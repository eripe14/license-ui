'use client'
import React, { useState } from 'react'
import { Copy, CheckCircle, XCircle, Trash2, Play, Pause, Plus, ChevronDown, ChevronRight, Calendar, Server, Key, Shield } from 'lucide-react'

interface Activation {
    server_id: string
    activated_at: string
}

interface License {
    key: string
    status: 'active' | 'inactive' | 'expired'
    support_expires: string | null
    activations?: Activation[]
}

interface LicenseTableProps {
    licenses: License[]
}

export default function LicenseTable({ licenses }: LicenseTableProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const handleCreate = async (duration: '1y' | 'lifetime') => {
        const res = await fetch('/api/licenses/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ duration }),
        })
        const data = await res.json()
        if (data.licenseKey) {
            alert('License generated:\n' + data.licenseKey)
            location.reload()
        }
    }

    const handleToggle = async (key: string) => {
        await fetch('/api/licenses/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
        })
        location.reload()
    }

    const handleDelete = async (key: string) => {
        if (confirm('Are you sure?')) {
            await fetch('/api/licenses/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
            })
            location.reload()
        }
    }

    const handleCopy = async (key: string) => {
        await navigator.clipboard.writeText(key)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const toggleRow = (key: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(key)) {
            newExpanded.delete(key)
        } else {
            newExpanded.add(key)
        }
        setExpandedRows(newExpanded)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-emerald-400 bg-emerald-400/10'
            case 'inactive': return 'text-orange-400 bg-orange-400/10'
            case 'expired': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4" />
            case 'inactive': return <Pause className="w-4 h-4" />
            case 'expired': return <XCircle className="w-4 h-4" />
            default: return <Shield className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">License Management</h1>
                            <p className="text-gray-400">Manage your software licenses and activations</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleCreate('1y')}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                1 Year License
                            </button>
                            <button
                                onClick={() => handleCreate('lifetime')}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                Lifetime License
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Licenses</p>
                                <p className="text-2xl font-bold text-white">{licenses.length}</p>
                            </div>
                            <Key className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active</p>
                                <p className="text-2xl font-bold text-emerald-400">{licenses.filter(l => l.status === 'active').length}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Inactive</p>
                                <p className="text-2xl font-bold text-orange-400">{licenses.filter(l => l.status === 'inactive').length}</p>
                            </div>
                            <Pause className="w-8 h-8 text-orange-400" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Expired</p>
                                <p className="text-2xl font-bold text-red-400">{licenses.filter(l => l.status === 'expired').length}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* License Table */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-slate-700/50 border-b border-slate-600/50">
                                <th className="text-left p-4 text-gray-300 font-semibold">License Key</th>
                                <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                                <th className="text-left p-4 text-gray-300 font-semibold">Support Until</th>
                                <th className="text-left p-4 text-gray-300 font-semibold">Server</th>
                                <th className="text-right p-4 text-gray-300 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {licenses.map((license) => (
                                <React.Fragment key={license.key}>
                                    <tr className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors duration-200">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRow(license.key)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {expandedRows.has(license.key) ?
                                                        <ChevronDown className="w-4 h-4" /> :
                                                        <ChevronRight className="w-4 h-4" />
                                                    }
                                                </button>
                                                <div className="flex items-center gap-2">
                                                        <span className="font-mono text-gray-300 text-sm bg-slate-700/50 px-3 py-1 rounded-lg">
                                                            {license.key.slice(0, 12)}...
                                                        </span>
                                                    <button
                                                        onClick={() => handleCopy(license.key)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded"
                                                    >
                                                        {copiedKey === license.key ?
                                                            <CheckCircle className="w-4 h-4" /> :
                                                            <Copy className="w-4 h-4" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(license.status)}`}>
                                                {getStatusIcon(license.status)}
                                                <span className="capitalize">{license.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {license.support_expires
                                                    ? new Date(license.support_expires).toLocaleDateString()
                                                    : 'Lifetime'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Server className="w-4 h-4 text-gray-400" />
                                                {license.activations?.length
                                                    ? `${license.activations[0].server_id.slice(0, 8)}...`
                                                    : 'Not activated'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggle(license.key)}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        license.status === 'active'
                                                            ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/30'
                                                            : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                                                    }`}
                                                >
                                                    {license.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    {license.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(license.key)}
                                                    className="flex items-center gap-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRows.has(license.key) && (
                                        <tr className="bg-slate-700/20">
                                            <td colSpan={5} className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                                        <h4 className="text-white font-semibold mb-2">Full License Key</h4>
                                                        <div className="bg-slate-900/50 rounded p-3 font-mono text-sm text-gray-300 break-all">
                                                            {license.key}
                                                        </div>
                                                    </div>
                                                    {license.activations?.length && license.activations.length > 0 && (
                                                        <div className="bg-slate-800/50 rounded-lg p-4">
                                                            <h4 className="text-white font-semibold mb-2">Server Details</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div>
                                                                    <span className="text-gray-400">Server ID:</span>
                                                                    <div className="font-mono text-gray-300 bg-slate-900/50 rounded p-2 mt-1 break-all">
                                                                        {license.activations[0].server_id}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Activated:</span>
                                                                    <span className="text-gray-300 ml-2">
                                                                            {new Date(license.activations[0].activated_at).toLocaleString()}
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                                        <h4 className="text-white font-semibold mb-2">License Info</h4>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Type:</span>
                                                                <span className="text-gray-300">
                                                                        {license.support_expires ? 'Annual' : 'Lifetime'}
                                                                    </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Activations:</span>
                                                                <span className="text-gray-300">
                                                                        {license.activations?.length || 0}/1
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {licenses.length === 0 && (
                    <div className="text-center py-12">
                        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No licenses found</h3>
                        <p className="text-gray-500">Create your first license to get started</p>
                    </div>
                )}
            </div>
        </div>
    )
}