import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Disable Next.js body parsing — Stripe needs the raw body to verify the signature
export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Map your Stripe Price IDs to plan names after creating products in Stripe
const PLAN_MAP = {
  // 'price_xxx': 'creator',
  // 'price_yyy': 'pro',
  // 'price_zzz': 'agency',
};

function getPlanFromLineItems(items) {
  if (!items?.data?.length) return 'creator';
  const priceId = items.data[0]?.price?.id;
  return PLAN_MAP[priceId] || 'creator';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeSecret  = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl   = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey    = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !serviceKey) {
    console.error('Stripe webhook: missing environment variables');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
  const admin  = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const rawBody = await getRawBody(req);
  const sig     = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const { type, data } = event;
  const obj = data.object;

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const customerId     = obj.customer;
        const subscriptionId = obj.subscription;
        const customerEmail  = obj.customer_details?.email || obj.customer_email;
        if (!customerEmail) break;

        // Find Supabase user by email
        const { data: { users } } = await admin.auth.admin.listUsers();
        const user = users?.find(u => u.email === customerEmail);
        if (!user) { console.warn('No Supabase user for email', customerEmail); break; }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price'],
        });
        const plan   = getPlanFromLineItems(subscription.items);
        const status = subscription.status;

        await admin.from('subscriptions').upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          status,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        console.log(`Subscription activated: ${customerEmail} -> ${plan}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionId = obj.id;
        const status = obj.status;
        const plan   = getPlanFromLineItems(obj.items);

        const { data: rows } = await admin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId);

        const update = {
          plan: status === 'active' ? plan : 'free',
          status,
          updated_at: new Date().toISOString(),
        };

        if (rows?.length) {
          await admin.from('subscriptions').update(update).eq('stripe_subscription_id', subscriptionId);
        } else {
          await admin.from('subscriptions').update(update).eq('stripe_customer_id', obj.customer);
        }
        console.log(`Subscription updated: ${subscriptionId} -> ${status}/${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        await admin.from('subscriptions').update({
          plan: 'free',
          status: 'canceled',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', obj.id);
        console.log(`Subscription canceled: ${obj.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        if (obj.subscription) {
          await admin.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', obj.subscription);
          console.log(`Payment failed: ${obj.subscription}`);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error [${type}]:`, err);
    // Return 200 to avoid Stripe retrying on application errors
  }

  return res.status(200).json({ received: true });
}
