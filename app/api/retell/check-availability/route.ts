import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
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

    if (!business?.google_refresh_token) {
        return NextResponse.json({ result: { openSlots: [] } })
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )
        oauth2Client.setCredentials({ refresh_token: business.google_refresh_token })
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

        const dayStart = new Date(`${date}T09:00:00`)
        const dayEnd = new Date(`${date}T17:00:00`)

        const freeBusy = await calendar.freebusy.query({
            requestBody: {
                timeMin: dayStart.toISOString(),
                timeMax: dayEnd.toISOString(),
                items: [{ id: 'primary' }],
            },
        })

        const busy = freeBusy.data.calendars?.primary?.busy || []
        const openSlots: string[] = []

        for (let h = 9; h < 17; h++) {
            const slotStart = new Date(`${date}T${String(h).padStart(2, '0')}:00:00`)
            const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000)
            const conflict = busy.some((b) => {
                const busyStart = new Date(b.start!)
                const busyEnd = new Date(b.end!)
                return slotStart < busyEnd && slotEnd > busyStart
            })
            if (!conflict) openSlots.push(`${String(h).padStart(2, '0')}:00`)
        }

        return NextResponse.json({ result: { openSlots } })
    } catch (err) {
        console.error('Availability check error:', err)
        return NextResponse.json({ result: { openSlots: [] } })
    }
}