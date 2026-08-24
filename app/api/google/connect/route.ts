import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )

    const businessId = request.nextUrl.searchParams.get('business_id')

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/calendar'],
        state: businessId || '', // pass business_id through so we know who this is for
    })

    return NextResponse.redirect(url)
}