import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
    const { plan, businessId } = await request.json()

    const priceId =
        plan === 'starter'
            ? process.env.STRIPE_PRICE_STARTER
            : process.env.STRIPE_PRICE_GROWTH

    if (!priceId) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${request.nextUrl.origin}/dashboard?checkout=success`,
        cancel_url: `${request.nextUrl.origin}/#pricing`,
        metadata: { businessId: businessId || '' },
    })

    return NextResponse.json({ url: session.url })
}