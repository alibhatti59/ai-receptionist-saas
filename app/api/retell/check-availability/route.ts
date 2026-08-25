import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const agentId = body.call?.agent_id
    const args = body.args || {}
    const { date } = args

    if (!agentId || !date) {
        return NextResponse.json({ result: { openSlots: [] } })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('retell_agent_id', agentId)
        .single()

    if (!business) {
        return NextResponse.json({ result: { openSlots: [] } })
    }

    const dayOfWeek = new Date(`${date}T00:00:00`).getDay()

    const { data: availability } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('business_id', business.id)
        .eq('day_of_week', dayOfWeek)
        .single()

    if (!availability) {
        return NextResponse.json({ result: { openSlots: [] } })
    }

    // Get already-booked appointments for that date
    const { data: booked } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('business_id', business.id)
        .gte('appointment_time', `${date}T00:00:00`)
        .lte('appointment_time', `${date}T23:59:59`)

    const bookedTimes = new Set(
        (booked || []).map((b) => new Date(b.appointment_time).toTimeString().slice(0, 5))
    )

    const openSlots: string[] = []
    const [startH, startM] = availability.start_time.split(':').map(Number)
    const [endH, endM] = availability.end_time.split(':').map(Number)
    const duration = availability.slot_duration_minutes

    let current = startH * 60 + startM
    const end = endH * 60 + endM

    while (current < end) {
        const h = Math.floor(current / 60)
        const m = current % 60
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        if (!bookedTimes.has(timeStr)) {
            openSlots.push(timeStr)
        }
        current += duration
    }

    return NextResponse.json({ result: { openSlots } })
}