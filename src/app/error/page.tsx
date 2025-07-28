'use client'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

export default function ErrorPage() {
    const handleRefresh = () => {
        window.location.reload()
    }

    const handleGoBack = () => {
        window.history.back()
    }

    const handleGoHome = () => {
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-6">
            <div className="text-center max-w-md w-full">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-400" />
                    </div>

                    {/* Animated Error Code */}
                    <div className="mb-4">
                        <h1 className="text-6xl font-bold text-white mb-2">
                            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                Oops!
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Error Message */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        We encountered an unexpected error while processing your request.
                        Don&apos;t worry, our team has been notified and is working to fix this issue.
                    </p>

                    {/* Error Details */}
                    <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-300 mb-2">What you can try:</p>
                        <ul className="text-sm text-gray-400 space-y-1 text-left">
                            <li>• Refresh the page</li>
                            <li>• Go back to the previous page</li>
                            <li>• Return to the homepage</li>
                            <li>• Contact support if the problem persists</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh Page
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold border border-slate-600/50 transition-all duration-200 transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold border border-slate-600/50 transition-all duration-200 transform hover:scale-105"
                        >
                            <Home className="w-5 h-5" />
                            Home
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Error ID: <span className="font-mono text-gray-400">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}