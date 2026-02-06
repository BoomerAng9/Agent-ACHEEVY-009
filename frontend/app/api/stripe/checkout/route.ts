/**
 * Stripe Checkout Session API
 *
 * Creates a Stripe Checkout session for subscription sign-up.
 * Requires STRIPE_SECRET_KEY in .env.
 */
import { NextResponse } from 'next/server';
import { PRICING_TIERS } from '@/lib/stripe';

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Stripe not configured. Add STRIPE_SECRET_KEY to environment.' },
      { status: 503 }
    );
  }

  try {
    const { tierId, userEmail } = await request.json();
    const tier = PRICING_TIERS.find(t => t.id === tierId);

    if (!tier || !tier.stripePriceId) {
      return NextResponse.json(
        { error: `Invalid tier: ${tierId}` },
        { status: 400 }
      );
    }

    // Dynamic import — Stripe SDK only loaded when key is present
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [{ price: tier.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?subscribed=${tier.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing`,
      metadata: { tierId: tier.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
