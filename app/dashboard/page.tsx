'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import BackgroundGlow from '../components/BackgroundGlow'
import LiveBadge from '../components/LiveBadge'
import TestCallButton from '../components/TestCallButton'

type Business = {
    id: string
    business_name: string
    business_hours: string
    retell_agent_id: string | null
}

type Appointment = {
    id: string
    caller_name: string
    caller_phone: string
    appointment_time: string
    status: string
}

type ActivityItem = {
    id: string
    event_type: string
    description: string
    created_at: string
}

type AvailabilityDay = {
    day_of_week: number
    start_time: string
    end_time: string
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function groupAppointments(appointments: Appointment[]) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const groups: { label: string; items: Appointment[] }[] = [
        { label: 'Today', items: [] },
        { label: 'Tomorrow', items: [] },
        { label: 'This Week', items: [] },
        { label: 'Later', items: [] },
    ]

    for (const appt of appointments) {
        const apptDate = new Date(appt.appointment_time)
        const apptDay = new Date(apptDate)
        apptDay.setHours(0, 0, 0, 0)

        if (apptDay.getTime() === today.getTime()) groups[0].items.push(appt)
        else if (apptDay.getTime() === tomorrow.getTime()) groups[1].items.push(appt)
        else if (apptDay < weekEnd) groups[2].items.push(appt)
        else groups[3].items.push(appt)
    }

    return groups.filter((g) => g.items.length > 0)
}

function SkeletonCard() {
    return (
        <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5 animate-pulse">
            <div className="h-3 w-20 bg-slate-800 rounded mb-3" />
            <div className="h-5 w-16 bg-slate-800 rounded" />
        </div>
    )
}

export default function DashboardPage() {
    const [business, setBusiness] = useState<Business | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [activity, setActivity] = useState<ActivityItem[]>([])
    const [availability, setAvailability] = useState<AvailabilityDay[]>([])
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)
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

            const { data: activityData } = await supabase
                .from('activity_log')
                .select('*')
                .eq('business_id', businessData.id)
                .order('created_at', { ascending: false })
                .limit(5)

            setActivity(activityData || [])

            const { data: availabilityData } = await supabase
                .from('availability_slots')
                .select('day_of_week, start_time, end_time')
                .eq('business_id', businessData.id)

            setAvailability(availabilityData || [])

            setLoading(false)
        }

        loadData()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleConnectAgent = async () => {
        if (!business) return
        setConnecting(true)
        const loadingToast = toast.loading('Setting up your AI receptionist...')

        try {
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

                await supabase.from('activity_log').insert({
                    business_id: business.id,
                    event_type: 'agent_connected',
                    description: 'AI receptionist connected and activated',
                })

                setBusiness({ ...business, retell_agent_id: data.agent_id })
                setActivity((prev) => [
                    {
                        id: 'temp',
                        event_type: 'agent_connected',
                        description: 'AI receptionist connected and activated',
                        created_at: new Date().toISOString(),
                    },
                    ...prev,
                ])

                toast.success('AI receptionist is live!', { id: loadingToast })
            } else {
                toast.error('Failed to connect agent', { id: loadingToast })
            }
        } catch {
            toast.error('Something went wrong', { id: loadingToast })
        } finally {
            setConnecting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen text-slate-100">
                <BackgroundGlow />
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="h-8 w-48 bg-slate-800 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-32 bg-slate-800 rounded mb-8 animate-pulse" />
                    <div className="grid sm:grid-cols-3 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        )
    }

    const appointmentGroups = groupAppointments(appointments)

    return (
        <div className="min-h-screen text-slate-100">
            <BackgroundGlow />

            <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
                            AI
                        </div>
                        <span className="font-semibold">FrontDesk</span>
                    </div>
                    <a href="/settings" className="text-sm text-slate-400 hover:text-white transition">
                        Settings
                    </a>
                    <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition">
                        Log out
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">{business?.business_name}</h1>
                    <p className="text-slate-400 mt-1 text-sm">{business?.business_hours}</p>
                </div>

                {/* Status cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">AI Receptionist</p>
                        {business?.retell_agent_id ? (
                            <LiveBadge label="Active" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400" />
                                <span className="text-sm font-medium text-amber-400">Not connected</span>
                            </div>
                        )}
                        {business?.retell_agent_id && (
                            <div className="mt-3">
                                <TestCallButton agentId={business.retell_agent_id} />
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Total Bookings</p>
                        <p className="text-2xl font-semibold">{appointments.length}</p>
                    </div>

                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">This Week</p>
                        <p className="text-2xl font-semibold">
                            {appointmentGroups.reduce(
                                (sum, g) => sum + (g.label !== 'Later' ? g.items.length : 0),
                                0
                            )}
                        </p>
                    </div>
                </div>

                {/* 7-day availability strip */}
                <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5 mb-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Weekly Availability</p>
                    <div className="grid grid-cols-7 gap-2">
                        {DAY_LABELS.map((label, idx) => {
                            const dayConfig = availability.find((a) => a.day_of_week === idx)
                            return (
                                <div
                                    key={idx}
                                    className={`rounded-lg py-2 text-center border ${dayConfig
                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                        : 'bg-slate-950/40 border-slate-800 text-slate-600'
                                        }`}
                                >
                                    <p className="text-xs font-medium">{label}</p>
                                    {dayConfig ? (
                                        <p className="text-[10px] mt-1">{dayConfig.start_time.slice(0, 5)}</p>
                                    ) : (
                                        <p className="text-[10px] mt-1">Off</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {!business?.retell_agent_id && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <p className="font-medium text-indigo-300">Set up your AI receptionist</p>
                            <p className="text-sm text-slate-400 mt-1">Connect your voice agent to start taking calls automatically.</p>
                        </div>
                        <button
                            onClick={handleConnectAgent}
                            disabled={connecting}
                            className="bg-indigo-500 hover:bg-indigo-400 transition text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap disabled:opacity-50"
                        >
                            {connecting ? 'Connecting...' : 'Connect Now'}
                        </button>
                    </div>
                )}

                <div className="grid sm:grid-cols-3 gap-6">
                    {/* Appointments - grouped */}
                    <div className="sm:col-span-2 bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800">
                            <h2 className="font-semibold">Upcoming Appointments</h2>
                        </div>

                        {appointmentGroups.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-slate-500 text-sm">
                                    No appointments yet. They&apos;ll show up here once your AI receptionist books its first call.
                                </p>
                            </div>
                        ) : (
                            <div>
                                {appointmentGroups.map((group) => (
                                    <div key={group.label}>
                                        <div className="px-6 py-2 bg-slate-950/40 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            {group.label}
                                        </div>
                                        <div className="divide-y divide-slate-800">
                                            {group.items.map((appt) => (
                                                <div key={appt.id} className="px-6 py-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{appt.caller_name}</p>
                                                        <p className="text-sm text-slate-500">{appt.caller_phone}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-slate-300">
                                                            {new Date(appt.appointment_time).toLocaleString(undefined, {
                                                                weekday: 'short',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                        <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full inline-block mt-1">
                                                            {appt.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent activity feed */}
                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl overflow-hidden h-fit">
                        <div className="px-5 py-4 border-b border-slate-800">
                            <h2 className="font-semibold text-sm">Recent Activity</h2>
                        </div>
                        {activity.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <p className="text-slate-500 text-xs">Nothing yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {activity.map((item) => (
                                    <div key={item.id} className="px-5 py-3">
                                        <p className="text-xs text-slate-300">{item.description}</p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">
                                            {new Date(item.created_at).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}