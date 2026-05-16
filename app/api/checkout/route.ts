import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    console.log('Key exists:', !!key)
    console.log('Key prefix:', key?.substring(0, 20))
    console.log('Price ID:', process.env.STRIPE_FOUNDING_PRICE_ID)
    console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL)
    
    const stripe = new Stripe(key!)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_FOUNDING_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', JSON.stringify(err))
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
