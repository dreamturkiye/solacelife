export const dynamic = 'force-dynamic'

import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_FOUNDING_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/personas`,
    })
    return NextResponse.redirect(session.url!)
  } catch (e) {
    console.error('Checkout error:', e)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/personas?error=checkout_failed`)
  }
}

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_FOUNDING_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/personas`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Checkout error:', e)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
