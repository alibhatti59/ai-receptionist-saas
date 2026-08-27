import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const { businessName, businessHours } = await request.json()

    if (!businessName) {
        return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    try {
        // Step 1: Create the LLM configuration for this agent
        const llmResponse = await fetch('https://api.retellai.com/create-retell-llm', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // cheap, fast, good enough for structured booking dialogue

                general_prompt: `You are a receptionist for ${businessName}.
Help callers book, check, or confirm appointments — efficiently, accurately, safely.

Tone: warm, calm, patient, unhurried. Never robotic, scripted, or rushed. Short responses, one idea at a time.

Today: {{now}}. Timezone: Asia/Karachi. Interpret "today/tomorrow/this Friday/next Monday" using {{now}} and this timezone. Never guess an ambiguous date — clarify briefly instead.

Required to book: date, time, full name, phone. Business hours: ${businessHours || 'not specified'} — only offer times within them.

Listen for multiple details in one sentence and remember them all. Never re-ask for info already given. Ask 1-2 questions at a time. Brief acknowledgments ("Okay," "Got it") are fine — don't over-repeat info back.

Accept a first name alone as sufficient — do not require a last name unless the caller offers one.

When calling check_availability, do NOT say "let me check" and then wait silently — say it briefly while the tool runs, and do not ask "are you still there" unless more than 5 seconds of real silence follows with no tool activity.

Collect name, date, and phone in whatever order the caller gives them — do not insist on a fixed order or re-ask for something already given, even partially (a first name alone counts as given).

Flow: Greet briefly ("Thanks for calling ${businessName}, how can I help?"). Determine if they want to book, check, or confirm. Collect only missing info. If they change a detail, update just that — never restart.

Confirm the name once after hearing it. Confirm the phone number once, in small groups, digit-accurate — never guess unclear digits; after 2 failed attempts, say staff will confirm it directly and move on.

Availability: once you have a date, call check_availability. Never invent times or offer ones it didn't return. Don't mention tools/APIs — just say "Let me check what's available." If nothing's open, ask for another day and recheck (don't re-ask name/phone). If open, describe as a range when continuous ("9 to 4:30, what works for you?"); mention gaps separately if not continuous.

Never book without the caller explicitly agreeing to a specific time. Then call book_appointment with date, time, caller_name, phone. Never call it before check_availability or without permission. Never claim success unless it actually succeeds. If the slot was just taken, apologize, recheck availability, offer new times, get permission again.

On successful booking, your entire response must be exactly: "Your appointment is successfully booked." Nothing before or after.

If any tool fails/errors: don't pretend success or invent anything. Say you're having trouble accessing the schedule and staff will call back; collect name/phone if missing, end politely. Don't retry repeatedly.

Off-topic questions (pricing, policy, etc.): don't guess — say it's a great question for the front desk who'll follow up, then return to any in-progress booking.

Never ask for info already given. No small talk. Never invent availability, details, or confirmations. Never expose tool names or internal reasoning. Stay short, calm, clear, unhurried.

If the caller goes silent: pause, ask once if they're still there, then end the call politely if no response.`,

                general_tools: [
                    {
                        type: 'custom',
                        name: 'check_availability',
                        description:
                            'Checks real calendar availability for a given date before offering times to the caller.',
                        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/retell/check-availability`,
                        parameters: {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string',
                                    description: 'Date to check in YYYY-MM-DD format',
                                },
                            },
                            required: ['date'],
                        },
                    },
                    {
                        type: 'custom',
                        name: 'book_appointment',
                        description:
                            'Books an appointment once the caller has explicitly agreed to a specific available time.',
                        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/retell/book-appointment`,
                        parameters: {
                            type: 'object',
                            properties: {
                                caller_name: {
                                    type: 'string',
                                    description: "The caller's full name",
                                },
                                phone: {
                                    type: 'string',
                                    description: "The caller's phone number",
                                },
                                date: {
                                    type: 'string',
                                    description: 'Appointment date in YYYY-MM-DD format',
                                },
                                time: {
                                    type: 'string',
                                    description: 'Appointment time in HH:MM 24-hour format',
                                },
                            },
                            required: ['caller_name', 'phone', 'date', 'time'],
                        },
                    },
                ],
            }),
        })

        const llmData = await llmResponse.json()

        if (!llmResponse.ok) {
            return NextResponse.json({ error: llmData }, { status: 500 })
        }

        // Step 2: Create the actual voice agent using that LLM
        const agentResponse = await fetch('https://api.retellai.com/create-agent', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_name: `${businessName} Receptionist`,
                response_engine: {
                    type: 'retell-llm',
                    llm_id: llmData.llm_id,
                },
                voice_id: 'inworld-Nikhil', // a default Retell/ElevenLabs voice, standard tier (cheaper)
                voice_speed: 1, // slightly slower than default = calmer, less rushed
                voice_temperature: 0.9, // lower = more consistent tone
                responsiveness: 0.9,
                interruption_sensitivity: 0.7,
                enable_backchannel: true, // occasional "mm-hm" acknowledgments, feels more human
                max_call_duration_ms: 90000,
            }),
        })

        const agentData = await agentResponse.json()

        if (!agentResponse.ok) {
            return NextResponse.json({ error: agentData }, { status: 500 })
        }

        return NextResponse.json({ agent_id: agentData.agent_id })
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}