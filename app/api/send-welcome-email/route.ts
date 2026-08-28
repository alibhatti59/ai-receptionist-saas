import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const { businessName, email } = await request.json()

  if (!email) {
    return NextResponse.json({ skipped: true })
  }

  try {
    const info = await transporter.sendMail({
      from: `"AI FrontDesk by Ali" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Welcome to AI FrontDesk, ${businessName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>You're all set up 🎉</h2>
          <p>Hi there, thanks for trying out AI FrontDesk for ${businessName}.</p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
            <tr>
              <td>
                <a href="https://ai-frontdesk-byali.vercel.app/login" style="display:inline-block; background:#1e293b; color:#e2e8f0; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px; border:1px solid #334155;">
                  🔑 Go to your dashboard
                </a>
              </td>
            </tr>
          </table>

          <p>Here's what your AI receptionist can do once it's live:</p>
          <ul>
            <li>✅ Answers calls instantly, 24/7 — no missed leads</li>
            <li>✅ Books real appointments directly, checked against your actual availability</li>
            <li>✅ Sounds natural and calm, not robotic</li>
            <li>✅ Sends you an instant email the moment a booking happens</li>
          </ul>
          <p>Want this running for your real business, fully set up and customized? I build these personally.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
            <tr>
              <td style="padding-bottom: 10px;">
                <a href="https://wa.me/923177336159" style="display:inline-block; background:#6366f1; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-family:sans-serif; font-size:14px;">
                  💬 Message me on WhatsApp
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/" style="display:inline-block; background:#0a66c2; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-family:sans-serif; font-size:14px;">
                  Connect on LinkedIn
                </a>
              </td>
            </tr>
          </table>
          <p style="color:#888;font-size:12px;margin-top:30px;">— Ali Hassnain Bhatti, AI Automation Engineer</p>
        </div>
      `,
    })

    console.log('Email sent:', info.messageId)
    return NextResponse.json({ sent: true, id: info.messageId })
  } catch (err) {
    console.error('Gmail send error:', err)
    return NextResponse.json({ sent: false, error: String(err) }, { status: 500 })
  }
}