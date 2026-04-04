import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PRICE_MAP = {
  creator: process.env.STRIPE_PRICE_CREATOR,
  pro:     process.env.STRIPE_PRICE_PRO,
  agency:  process.env.STRIPE_PRICE_AGENCY,
};

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { plan } = req.body || {};
  const priceId = PRICE_MAP[plan];

  if (!priceId)
    return res.status(400).json({ error: 'Invalid plan. Use: creator, pro, or agency' });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret)
    return res.status(500).json({ error: 'Stripe not configured' });

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  // --- Authenticate via Supabase JWT ---
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized – please log in first' });

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin().auth.getUser(token);
  if (authError || !user)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin()
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin()
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hook-generator-tau.vercel.app';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { supabase_uid: user.id, plan },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
              }
