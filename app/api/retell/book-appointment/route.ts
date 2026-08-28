import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transporter } from '@/lib/mailer'

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
            try {
                await transporter.sendMail({
                    from: `"AI FrontDesk by Ali" <${process.env.GMAIL_USER}>`,
                    to: ownerEmail,
                    subject: `New appointment booked: ${caller_name}`,
                    html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2>📅 New appointment booked!</h2>
              <p>Your AI receptionist just booked a real appointment, automatically, with no human involved.</p>
              <p><strong>Name:</strong> ${caller_name}<br/>
              <strong>Date & Time:</strong> ${date} at ${time}<br/>
              <strong>Phone:</strong> ${phone || 'not provided'}</p>

              <div style="background:#f5f5ff; border-radius:8px; padding:16px; margin:24px 0;">
                <p style="margin:0 0 8px 0; font-weight:600;">Like what you're seeing?</p>
                <p style="margin:0 0 16px 0; font-size:14px; color:#444;">
                  This is exactly how it would work for your real business, answering every call, checking real availability, and booking appointments while you focus on your work.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <a href="https://wa.me/923177336159" style="display:inline-block; background:#6366f1; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
                        💬 Let's talk on WhatsApp
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/" style="display:inline-block; background:#0a66c2; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
                        Connect on LinkedIn
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color:#888;font-size:12px;margin-top:20px;">— Ali Hassnain Bhatti, AI Automation Engineer</p>
            </div>
          `,
                })
            } catch (emailErr) {
                // Don't fail the booking if the notification email fails
                console.error('Booking notification email error:', emailErr)
            }
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