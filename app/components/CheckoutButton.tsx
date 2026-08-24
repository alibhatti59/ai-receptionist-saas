'use client'

import { useState } from 'react'

export default function CheckoutButton({
    plan,
    label,
    variant = 'default',
}: {
    plan: 'starter' | 'growth'
    label: string
    variant?: 'default' | 'primary'
}) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
        })
        const data = await response.json()

        if (data.url) {
            window.location.href = data.url
        } else {
            setLoading(false)
            alert('Something went wrong starting checkout.')
        }
    }

    const baseClasses = 'block w-full text-center font-medium py-2 rounded-lg transition disabled:opacity-50'
    const styles =
        variant === 'primary'
            ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
            : 'border border-slate-700 hover:border-indigo-500 text-slate-200'

    return (
        <button onClick={handleClick} disabled={loading} className={`${baseClasses} ${styles}`}>
            {loading ? 'Loading...' : label}
        </button>
    )
}