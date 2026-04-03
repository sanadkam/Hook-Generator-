import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const PLAN_MAP = {
  ...(process.env.STRIPE_PRICE_CREATOR && { [process.env.STRIPE_PRICE_CREATOR]: 'creator' }),
  ...(process.env.STRIPE_PRICE_PRO     && { [process.env.STRIPE_PRICE_PRO]:     'pro'     }),
  ...(process.env.STRIPE_PRICE_AGENCY  && { [process.env.STRIPE_PRICE_AGENCY]:  'agency'  }),
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
        const customerId    = obj.customer;
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
        const now    = new Date().toISOString();

        // Update subscriptions table
        await admin.from('subscriptions').upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan, status, updated_at: now,
        }, { onConflict: 'user_id' });

        // Sync profiles table so the app sees the new plan immediately
        await admin.from('profiles').upsert({
          id: user.id,
          plan,
          stripe_customer_id: customerId,
          updated_at: now,
        }, { onConflict: 'id' });

        console.log(`Subscription activated: ${customerEmail} -> ${plan}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionId = obj.id;
        const status = obj.status;
        const plan   = getPlanFromLineItems(obj.items);
        const now    = new Date().toISOString();
        const activePlan = status === 'active' ? plan : 'free';

        const { data: rows } = await admin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId);

        const subUpdate = { plan: activePlan, status, updated_at: now };

        let userId = null;
        if (rows?.length) {
          await admin.from('subscriptions').update(subUpdate).eq('stripe_subscription_id', subscriptionId);
          userId = rows[0].user_id;
        } else {
          const { data: byCustomer } = await admin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', obj.customer);
          await admin.from('subscriptions').update(subUpdate).eq('stripe_customer_id', obj.customer);
          userId = byCustomer?.[0]?.user_id;
        }

        // Sync profiles
        if (userId) {
          await admin.from('profiles').update({ plan: activePlan, updated_at: now }).eq('id', userId);
        }

        console.log(`Subscription updated: ${subscriptionId} -> ${status}/${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const now = new Date().toISOString();
        const { data: rows } = await admin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', obj.id);

        await admin.from('subscriptions').update({
          plan: 'free', status: 'canceled', updated_at: now,
        }).eq('stripe_subscription_id', obj.id);

        // Sync profiles
        if (rows?.[0]?.user_id) {
          await admin.from('profiles').update({ plan: 'free', updated_at: now }).eq('id', rows[0].user_id);
        }

        console.log(`Subscription canceled: ${obj.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        if (obj.subscription) {
          await admin.from('subscriptions').update({
            status: 'past_due', updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', obj.subscription);
          console.log(`Payment failed: ${obj.subscription}`);
        }
        break;
      }

      default: break;
    }
  } catch (err) {
    console.error(`Webhook handler error [${type}]:`, err);
  }

  return res.status(200).json({ received: true });
}
