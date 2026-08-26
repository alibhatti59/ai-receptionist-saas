import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    const body = await request.json()
    const agentId = body.call?.agent_id
    const args = body.args || {}
    const { caller_name, phone, date, time } = args

    if (!agentId || !caller_name || !date || !time) {
        return NextResponse.json({ result: "I'm missing some details to complete the booking." })
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
        return NextResponse.json({ result: "I'm unable to process that right now. Someone will follow up with you." })
    }

    try {
        const startDateTime = new Date(`${date}T${time}:00`)

        // Double-check the slot's still free (avoid race conditions)
        const { data: conflict } = await supabase
            .from('appointments')
            .select('id')
            .eq('business_id', business.id)
            .eq('appointment_time', startDateTime.toISOString())
            .maybeSingle()

        if (conflict) {
            return NextResponse.json({ result: `That time isn't available anymore. Could we try a different time?` })
        }

        await supabase.from('appointments').insert({
            business_id: business.id,
            caller_name,
            caller_phone: phone || body.call?.from_number || 'unknown',
            appointment_time: startDateTime.toISOString(),
            status: 'confirmed',
        })

        await supabase.from('activity_log').insert({
            business_id: business.id,
            event_type: 'booking_created',
            description: `New appointment booked for ${caller_name}`,
        })

        // Notify the business owner by email
        const { data: ownerData } = await supabase.auth.admin.getUserById(business.owner_id)
        const ownerEmail = ownerData?.user?.email

        if (ownerEmail) {
            await resend.emails.send({
                from: 'AI FrontDesk - Ali Hassnain Bhatti <onboarding@resend.dev>',
                to: ownerEmail,
                subject: `New appointment booked: ${caller_name}`,
                html: `<p>A new appointment was booked by your AI receptionist.</p>
               <p><strong>Name:</strong> ${caller_name}<br/>
               <strong>Date & Time:</strong> ${date} at ${time}<br/>
               <strong>Phone:</strong> ${phone || 'not provided'}</p>`,
            })
        }

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