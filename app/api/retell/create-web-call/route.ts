import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const { agentId } = await request.json()

    if (!agentId) {
        return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Karachi',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            agent_id: agentId,
            retell_llm_dynamic_variables: {
                now: now,
            },
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        return NextResponse.json({ error: data }, { status: 500 })
    }

    return NextResponse.json({ access_token: data.access_token })
}