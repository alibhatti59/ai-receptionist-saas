import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code')
    const businessId = request.nextUrl.searchParams.get('state')

    if (!code || !businessId) {
        return NextResponse.redirect(new URL('/dashboard?calendar_error=1', request.url))
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)

    // Use the service role key here since this is a trusted server-side route
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
        .from('businesses')
        .update({
            google_calendar_connected: true,
            google_refresh_token: tokens.refresh_token,
        })
        .eq('id', businessId)

    return NextResponse.redirect(new URL('/dashboard?calendar_connected=1', request.url))
}