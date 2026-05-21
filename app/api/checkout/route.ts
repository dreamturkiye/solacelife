export const dynamic = 'force-dynamic'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { tier } = await req.json()
    if (!tier || !['premium', 'vip'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const priceId = tier === 'premium'
      ? process.env.STRIPE_PREMIUM_PRICE_ID!
      : process.env.STRIPE_VIP_PRICE_ID!
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { tier },
      success_url: process.env.NEXT_PUBLIC_BASE_URL + '/?success=true&tier=' + tier,
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/personas',
    })
    return NextResponse.json({ url: checkoutSession.url })
  } catch (e) {
    console.error('Checkout error:', e)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 })
}