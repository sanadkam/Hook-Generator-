import { createClient } from '@supabase/supabase-js';

const FREE_LIMIT = 3;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({ count: 0, remaining: FREE_LIMIT, plan: 'free', limit: FREE_LIMIT });
  }

  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'auth_required' });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'auth_required' });

  const feature = req.query.feature || 'generate';

  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  const isPaid = sub && sub.status === 'active' && sub.plan !== 'free';
  if (isPaid) {
    return res.status(200).json({ count: 0, remaining: 9999, plan: sub.plan, limit: null });
  }

  const month = new Date().toISOString().slice(0, 7);
  const { data: usage } = await admin
    .from('usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('feature', feature)
    .eq('month', month)
    .single();

  const count = usage?.count || 0;
  const remaining = Math.max(0, FREE_LIMIT - count);

  return res.status(200).json({ count, remaining, plan: 'free', limit: FREE_LIMIT });
}
