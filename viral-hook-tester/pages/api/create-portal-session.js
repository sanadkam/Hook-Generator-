import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await supabaseAdmin().auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  try {
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
      await supabaseAdmin().from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hook-generator-tau.vercel.app'}/account`;
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Portal session error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
