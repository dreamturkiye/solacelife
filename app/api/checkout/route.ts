import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const stripe = new Stripe('REMOVED')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: 'price_1TXTvGCqyVOjGBTqr94J6NRY', quantity: 1 }],
      success_url: 'https://vela-one-vert.vercel.app/?success=true',
      cancel_url: 'https://vela-one-vert.vercel.app/',
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', JSON.stringify(err))
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
