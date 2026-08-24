'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Business = {
    id: string
    business_name: string
    business_hours: string
    retell_agent_id: string | null
    google_calendar_connected: boolean
}

type Appointment = {
    id: string
    caller_name: string
    caller_phone: string
    appointment_time: string
    status: string
}

export default function DashboardPage() {
    const [business, setBusiness] = useState<Business | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data: businessData } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single()

            if (!businessData) {
                router.push('/onboarding')
                return
            }

            setBusiness(businessData)

            const { data: appointmentsData } = await supabase
                .from('appointments')
                .select('*')
                .eq('business_id', businessData.id)
                .order('appointment_time', { ascending: true })

            setAppointments(appointmentsData || [])
            setLoading(false)
        }

        loadData()
    }, [router])

    const [connecting, setConnecting] = useState(false)

    const handleConnectAgent = async () => {
        if (!business) return
        setConnecting(true)

        const response = await fetch('/api/create-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessName: business.business_name,
                businessHours: business.business_hours,
            }),
        })

        const data = await response.json()

        if (data.agent_id) {
            const supabase = createClient()
            await supabase
                .from('businesses')
                .update({ retell_agent_id: data.agent_id })
                .eq('id', business.id)

            setBusiness({ ...business, retell_agent_id: data.agent_id })
        } else {
            alert('Failed to connect agent: ' + JSON.stringify(data.error))
        }

        setConnecting(false)
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Top nav */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
                            AI
                        </div>
                        <span className="font-semibold">Receptionist</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-400 hover:text-white transition"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">{business?.business_name}</h1>
                    <p className="text-slate-400 mt-1">{business?.business_hours}</p>
                </div>

                {/* Status card */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">AI Receptionist</p>
                        {business?.retell_agent_id ? (
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-sm font-medium text-emerald-400">Active</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400" />
                                <span className="text-sm font-medium text-amber-400">Not connected</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Calendar</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${business?.google_calendar_connected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                <span className="text-sm font-medium text-slate-300">
                                    {business?.google_calendar_connected ? 'Connected' : 'Not connected'}
                                </span>
                            </div>
                            {!business?.google_calendar_connected && (
                                <a
                                    href={`/api/google/connect?business_id=${business?.id}`}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Connect
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Total Bookings</p>
                        <p className="text-2xl font-semibold">{appointments.length}</p>
                    </div>
                </div>

                {
                    !business?.retell_agent_id && (
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 mb-8 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-indigo-300">Set up your AI receptionist</p>
                                <p className="text-sm text-slate-400 mt-1">Connect your voice agent to start taking calls automatically.</p>
                            </div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-400 transition text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
                                onClick={handleConnectAgent}
                                disabled={connecting}
                            >
                                {connecting ? 'Connecting...' : 'Connect Now'}
                            </button>
                        </div>
                    )
                }

                {/* Appointments */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800">
                        <h2 className="font-semibold">Upcoming Appointments</h2>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-500 text-sm">
                                No appointments yet. They&apos;ll show up here once your AI receptionist books its first call.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {appointments.map((appt) => (
                                <div key={appt.id} className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{appt.caller_name}</p>
                                        <p className="text-sm text-slate-500">{appt.caller_phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-300">
                                            {new Date(appt.appointment_time).toLocaleString()}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full inline-block mt-1">
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main >
        </div >
    )
}