'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import BackgroundGlow from '../components/BackgroundGlow'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        router.push('/dashboard')
    }

    return (
        <>
            <BackgroundGlow />
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center font-bold mx-auto mb-4">
                            AI
                        </div>
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-slate-400 text-sm mt-1">Log in to your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-500 hover:bg-indigo-400 transition text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className="text-sm text-center text-slate-400 mt-6">
                        Don&apos;t have an account?{' '}
                        <a href="/signup" className="text-indigo-400 hover:text-indigo-300">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}