import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { businessName, email } = await request.json()

  if (!email) {
    return NextResponse.json({ skipped: true })
  }

  try {
    await resend.emails.send({
      from: 'Ali Hassnain Bhatti <onboarding@resend.dev>',
      to: email,
      subject: `Welcome to AI FrontDesk, ${businessName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>You're all set up 🎉</h2>
          <p>Hi there, thanks for trying out AI FrontDesk for ${businessName}.</p>
          <p>Here's what your AI receptionist can do once it's live:</p>
          <ul>
            <li>✅ Answers calls instantly, 24/7 — no missed leads</li>
            <li>✅ Books real appointments directly, checked against your actual availability</li>
            <li>✅ Sounds natural and calm, not robotic</li>
            <li>✅ Sends you an instant email the moment a booking happens</li>
          </ul>
          <p>Want this running for your real business, fully set up and customized? I build these personally.</p>
          <p>
            <a href="https://wa.me/923177336159" style="background:#6366f1;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;margin-right:8px;">
              Message me on WhatsApp
            </a>
            <a href="https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/" style="background:#0a66c2;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
              Connect on LinkedIn
            </a>
          </p>
          <p style="color:#888;font-size:12px;margin-top:30px;">— Ali Hassnain Bhatti, AI Automation Engineer</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ sent: false, error: String(err) })
  }

  return NextResponse.json({ sent: true })
}