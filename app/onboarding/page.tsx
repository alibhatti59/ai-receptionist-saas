'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import BackgroundGlow from '../components/BackgroundGlow'

const DAYS = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
]

type DaySchedule = {
    enabled: boolean
    start: string
    end: string
}

export default function OnboardingPage() {
    const [businessName, setBusinessName] = useState('')
    const [schedule, setSchedule] = useState<Record<number, DaySchedule>>(() => {
        const initial: Record<number, DaySchedule> = {}
        DAYS.forEach((d) => {
            initial[d.value] = {
                enabled: d.value >= 1 && d.value <= 5, // Mon-Fri on by default
                start: '09:00',
                end: '17:00',
            }
        })
        return initial
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const toggleDay = (day: number) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled },
        }))
    }

    const updateTime = (day: number, field: 'start' | 'end', value: string) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }))
    }

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

        const enabledDays = DAYS.filter((d) => schedule[d.value].enabled)
        if (enabledDays.length === 0) {
            setError('Select at least one working day.')
            setLoading(false)
            return
        }

        // Build a readable summary string for business_hours (kept for display/prompt use)
        const hoursummary = enabledDays
            .map((d) => `${d.label.slice(0, 3)} ${schedule[d.value].start}-${schedule[d.value].end}`)
            .join(', ')

        const { data: newBusiness, error: businessError } = await supabase
            .from('businesses')
            .insert({
                owner_id: user.id,
                business_name: businessName,
                business_hours: hoursummary,
            })
            .select()
            .single()

        if (businessError) {
            setError(businessError.message)
            setLoading(false)
            return
        }

        const slotRows = enabledDays.map((d) => ({
            business_id: newBusiness.id,
            day_of_week: d.value,
            start_time: schedule[d.value].start,
            end_time: schedule[d.value].end,
            slot_duration_minutes: 30,
        }))

        const { error: slotsError } = await supabase.from('availability_slots').insert(slotRows)

        setLoading(false)

        if (slotsError) {
            setError(slotsError.message)
            return
        }

        // Send a welcome/pitch email after successful onboarding
        await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessName, email: user.email }),
        })

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen text-slate-100 flex items-center justify-center px-4 py-12">
            <BackgroundGlow />

            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center font-bold mx-auto mb-4">
                        AI
                    </div>
                    <h1 className="text-2xl font-bold">Set up your business</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        This tells your AI receptionist when to take bookings.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <label className="block text-sm text-slate-400 mb-1.5">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                            placeholder="e.g. Bright Smile Dental"
                            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <p className="text-sm text-slate-400 mb-4">Working days & hours</p>

                        <div className="space-y-2">
                            {DAYS.map((day) => {
                                const daySchedule = schedule[day.value]
                                return (
                                    <div
                                        key={day.value}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${daySchedule.enabled ? 'bg-slate-950/60' : 'bg-slate-950/20 opacity-50'
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`relative h-5 w-9 rounded-full transition shrink-0 ${daySchedule.enabled ? 'bg-indigo-500' : 'bg-slate-700'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${daySchedule.enabled ? 'left-4.5 translate-x-0.5' : 'left-0.5'
                                                    }`}
                                            />
                                        </button>

                                        <span className="text-sm w-24 shrink-0">{day.label}</span>

                                        <input
                                            type="time"
                                            value={daySchedule.start}
                                            onChange={(e) => updateTime(day.value, 'start', e.target.value)}
                                            disabled={!daySchedule.enabled}
                                            className="bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 disabled:opacity-40"
                                        />
                                        <span className="text-slate-600 text-xs">to</span>
                                        <input
                                            type="time"
                                            value={daySchedule.end}
                                            onChange={(e) => updateTime(day.value, 'end', e.target.value)}
                                            disabled={!daySchedule.enabled}
                                            className="bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 disabled:opacity-40"
                                        />
                                    </div>
                                )
                            })}
                        </div>
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