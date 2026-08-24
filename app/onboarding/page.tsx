'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function OnboardingPage() {
    const [businessName, setBusinessName] = useState('')
    const [businessHours, setBusinessHours] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in.')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('businesses').insert({
            owner_id: user.id,
            business_name: businessName,
            business_hours: businessHours,
        })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center font-bold mx-auto mb-4">
                        AI
                    </div>
                    <h1 className="text-2xl font-bold">Set up your business</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        This helps your AI receptionist answer calls correctly.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                            placeholder="e.g. Bright Smile Dental"
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Business Hours</label>
                        <input
                            type="text"
                            value={businessHours}
                            onChange={(e) => setBusinessHours(e.target.value)}
                            placeholder="e.g. Mon-Fri 9am-5pm"
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 transition text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Continue to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    )
}