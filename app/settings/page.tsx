'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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

export default function SettingsPage() {
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [businessName, setBusinessName] = useState('')
    const [schedule, setSchedule] = useState<Record<number, DaySchedule>>(() => {
        const initial: Record<number, DaySchedule> = {}
        DAYS.forEach((d) => {
            initial[d.value] = { enabled: false, start: '09:00', end: '17:00' }
        })
        return initial
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const load = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: business } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single()

            if (!business) {
                router.push('/onboarding')
                return
            }

            setBusinessId(business.id)
            setBusinessName(business.business_name)

            const { data: slots } = await supabase
                .from('availability_slots')
                .select('*')
                .eq('business_id', business.id)

            if (slots && slots.length > 0) {
                setSchedule((prev) => {
                    const updated = { ...prev }
                    slots.forEach((s) => {
                        updated[s.day_of_week] = {
                            enabled: true,
                            start: s.start_time.slice(0, 5),
                            end: s.end_time.slice(0, 5),
                        }
                    })
                    return updated
                })
            }

            setLoading(false)
        }

        load()
    }, [router])

    const toggleDay = (day: number) => {
        setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }))
    }

    const updateTime = (day: number, field: 'start' | 'end', value: string) => {
        setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
    }

    const handleSave = async () => {
        if (!businessId) return
        setSaving(true)

        const supabase = createClient()
        const enabledDays = DAYS.filter((d) => schedule[d.value].enabled)

        const hoursummary = enabledDays
            .map((d) => `${d.label.slice(0, 3)} ${schedule[d.value].start}-${schedule[d.value].end}`)
            .join(', ')

        await supabase
            .from('businesses')
            .update({ business_name: businessName, business_hours: hoursummary })
            .eq('id', businessId)

        // Replace availability: delete old, insert new
        await supabase.from('availability_slots').delete().eq('business_id', businessId)

        if (enabledDays.length > 0) {
            const slotRows = enabledDays.map((d) => ({
                business_id: businessId,
                day_of_week: d.value,
                start_time: schedule[d.value].start,
                end_time: schedule[d.value].end,
                slot_duration_minutes: 30,
            }))
            await supabase.from('availability_slots').insert(slotRows)
        }

        await supabase.from('activity_log').insert({
            business_id: businessId,
            event_type: 'settings_updated',
            description: 'Business settings and availability updated',
        })

        setSaving(false)
        toast.success('Settings saved')
    }

    if (loading) {
        return (
            <div className="min-h-screen text-slate-100 flex items-center justify-center">
                <BackgroundGlow />
                <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="min-h-screen text-slate-100">
            <BackgroundGlow />

            <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
                            AI
                        </div>
                        <span className="font-semibold">FrontDesk</span>
                    </div>
                    <a href="/dashboard" className="text-sm text-slate-400 hover:text-white transition">
                        ← Back to Dashboard
                    </a>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-8">Settings</h1>

                <div className="space-y-6">
                    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl p-5">
                        <label className="block text-sm text-slate-400 mb-1.5">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
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

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 transition text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </main>
        </div>
    )
}