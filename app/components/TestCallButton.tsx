'use client'

import { useState, useRef } from 'react'
import { RetellWebClient } from 'retell-client-js-sdk'

const WHATSAPP_LINK = 'https://wa.me/923177336159' // your real number
const CALENDLY_LINK = 'https://calendly.com/thealibhatti-dev/30min' // your real link

export default function TestCallButton({ agentId }: { agentId: string }) {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle')
    const clientRef = useRef<RetellWebClient | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const startCall = async () => {
        setStatus('connecting')

        const response = await fetch('/api/retell/create-web-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId }),
        })
        const data = await response.json()

        if (!data.access_token) {
            alert('Failed to start test call')
            setStatus('idle')
            return
        }

        const client = new RetellWebClient()
        clientRef.current = client

        client.on('call_started', () => {
            setStatus('active')
            // Manually cut the demo at 80 seconds
            timeoutRef.current = setTimeout(() => {
                client.stopCall()
            }, 80000)
        })

        client.on('call_ended', () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setStatus('ended')
        })

        client.on('error', () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setStatus('ended')
        })

        await client.startCall({ accessToken: data.access_token })
    }

    const endCall = () => {
        clientRef.current?.stopCall()
    }

    const reset = () => setStatus('idle')

    return (
        <div>
            {status === 'idle' && (
                <button
                    onClick={startCall}
                    className="bg-indigo-500 hover:bg-indigo-400 transition text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    🎙️ Test Call Now
                </button>
            )}

            {status === 'connecting' && (
                <button disabled className="bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg opacity-70">
                    Connecting...
                </button>
            )}

            {status === 'active' && (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Call in progress (80s demo)
                    </span>
                    <button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-400 transition text-white text-sm font-medium px-3 py-1.5 rounded-lg"
                    >
                        🔴 End Call
                    </button>
                </div>
            )}

            {status === 'ended' && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-2">
                    <p className="text-sm font-medium text-indigo-300 mb-1">That was a 80-second demo</p>
                    <p className="text-xs text-slate-400 mb-3">
                        Want the full AI receptionist answering real calls for your business, unlimited?
                    </p>
                    <div className="flex gap-2">
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-500 hover:bg-indigo-400 transition text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                        >
                            💬 WhatsApp Me
                        </a>
                        <a
                            href={CALENDLY_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-slate-700 hover:border-slate-500 transition text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg"
                        >
                            📅 Book a Call
                        </a>
                        <button
                            onClick={reset}
                            className="text-xs text-slate-500 hover:text-slate-300 px-2"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}