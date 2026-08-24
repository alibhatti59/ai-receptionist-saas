import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    const body = await request.json()
    console.log('RETELL PAYLOAD:', JSON.stringify(body, null, 2))

    // ... rest of the function stays the same for now

    // Retell sends the call context including agent_id, and the args your function schema defined
    const agentId = body.call?.agent_id
    const args = body.args || body.parameters || {}
    const { caller_name, date, time } = args

    if (!agentId || !caller_name || !date || !time) {
        return NextResponse.json(
            { result: "I'm missing some details to complete the booking." },
            { status: 200 }
        )
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find which business this agent belongs to
    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('retell_agent_id', agentId)
        .single()

    if (!business || !business.google_refresh_token) {
        return NextResponse.json(
            { result: "I'm unable to check the calendar right now. Someone will follow up with you." },
            { status: 200 }
        )
    }

    try {
        // Set up Google Calendar client using the business's stored refresh token
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )
        oauth2Client.setCredentials({ refresh_token: business.google_refresh_token })

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

        const startDateTime = new Date(`${date}T${time}:00`)
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000) // 30-minute default slot

        // Check for conflicts first
        const freeBusy = await calendar.freebusy.query({
            requestBody: {
                timeMin: startDateTime.toISOString(),
                timeMax: endDateTime.toISOString(),
                items: [{ id: 'primary' }],
            },
        })

        const busySlots = freeBusy.data.calendars?.primary?.busy || []
        if (busySlots.length > 0) {
            return NextResponse.json({
                result: `That time isn't available. Could we try a different time?`,
            })
        }

        // Create the event
        const event = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `Appointment with ${caller_name}`,
                start: { dateTime: startDateTime.toISOString() },
                end: { dateTime: endDateTime.toISOString() },
            },
        })

        // Save to Supabase so it shows on the dashboard
        await supabase.from('appointments').insert({
            business_id: business.id,
            caller_name,
            caller_phone: body.call?.from_number || 'unknown',
            appointment_time: startDateTime.toISOString(),
            status: 'confirmed',
        })

        return NextResponse.json({
            result: `You're all set, ${caller_name}. Your appointment is confirmed for ${date} at ${time}.`,
        })
    } catch (err) {
        console.error('Booking error:', err)
        return NextResponse.json({
            result: "I ran into an issue booking that. Someone from our team will follow up with you shortly.",
        })
    }
}