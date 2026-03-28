import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ─── Auth & usage helpers ──────────────────────────────────────────────────────
const FREE_LIMIT = 3;

async function checkAuth(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return { ok: true, userId: null };

  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (!token) return { ok: false, status: 401, error: 'auth_required' };

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return { ok: false, status: 401, error: 'auth_required' };

  const { data: sub } = await admin.from('subscriptions').select('plan, status').eq('user_id', user.id).single();
  const isPaid = sub && sub.status === 'active' && sub.plan !== 'free';
  if (isPaid) return { ok: true, userId: user.id, plan: sub.plan };

  const month = new Date().toISOString().slice(0, 7);
  const { data: usage } = await admin.from('usage').select('count').eq('user_id', user.id).eq('feature', 'improve').eq('month', month).single();
  const count = usage?.count || 0;
  if (count >= FREE_LIMIT) return { ok: false, status: 402, error: 'limit_reached', plan: 'free' };

  return { ok: true, userId: user.id, plan: 'free' };
}

async function incrementUsage(userId, feature) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!userId || !supabaseUrl || !serviceKey) return;
  try {
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    await admin.rpc('increment_usage', { p_user_id: userId, p_feature: feature, p_month: new Date().toISOString().slice(0, 7) });
  } catch (err) { console.error('Usage increment failed:', err.message); }
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const data = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > data.resetAt) { data.count = 0; data.resetAt = now + RATE_WINDOW; }
  data.count++;
  rateLimitMap.set(ip, data);
  return { allowed: data.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - data.count), resetAt: data.resetAt };
}

// ─── Validation ────────────────────────────────────────────────────────────────
const ALLOWED_PLATFORMS = new Set(['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn']);
const ALLOWED_NICHES    = new Set(['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy']);

function sanitize(str) {
  return String(str).replace(/\x00/g, '').replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').slice(0, 500);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODELS = ['claude-sonnet-4-6', 'claude-opus-4-6'];

// ─── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const { allowed, remaining, resetAt } = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', remaining);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil((resetAt - Date.now()) / 1000));
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  // ── Auth & usage check ────────────────────────────────────────────────────
  const auth = await checkAuth(req);
  if (!auth.ok) {
    if (auth.error === 'auth_required') return res.status(401).json({ error: 'auth_required' });
    if (auth.error === 'limit_reached')  return res.status(402).json({ error: 'limit_reached' });
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── Input validation ───────────────────────────────────────────────────────
  const { hook, platform, niche } = req.body || {};
  if (!hook || typeof hook !== 'string' || hook.trim().length < 5) return res.status(400).json({ error: 'Please paste your hook (at least 5 characters).' });
  if (!ALLOWED_PLATFORMS.has(platform)) return res.status(400).json({ error: 'Invalid platform.' });
  if (!ALLOWED_NICHES.has(niche))       return res.status(400).json({ error: 'Invalid niche.' });

  const cleanHook = sanitize(hook.trim());

  const prompt = `You are a viral content strategist. A creator wrote this hook for ${platform} in the ${niche} niche:

"${cleanHook}"

Step 1 — Score the original on these 5 dimensions (0–100 each):
- curiosityGap (30% weight): Does it force the viewer to keep watching?
- emotionalTrigger (25% weight): Fear, hope, surprise, FOMO, relatability?
- clarity (20% weight): Instantly understood in under 2 seconds?
- platformFit (15% weight): Match the tone and energy of ${platform}?
- nicheRelevance (10% weight): Speaks to ${niche} audience pain points?

overallScore = (curiosityGap×0.30) + (emotionalTrigger×0.25) + (clarity×0.20) + (platformFit×0.15) + (nicheRelevance×0.10). Round to nearest integer.

Step 2 — Write 3 dramatically improved rewrites. Each must: fix the main weakness, target a different psychological angle, sound creator-authentic, score higher than the original.

Respond ONLY with valid JSON:
{
  "original": {
    "text": "${cleanHook.replace(/"/g, '\\"')}",
    "overallScore": 0,
    "scores": { "curiosityGap": 0, "clarity": 0, "emotionalTrigger": 0, "platformFit": 0, "nicheRelevance": 0 },
    "mainIssue": "The single biggest weakness — be specific"
  },
  "rewrites": [
    { "text": "rewritten hook 1", "style": "CURIOSITY_GAP", "overallScore": 0, "scores": { "curiosityGap": 0, "clarity": 0, "emotionalTrigger": 0, "platformFit": 0, "nicheRelevance": 0 }, "whatChanged": "One precise sentence" },
    { "text": "rewritten hook 2", "style": "BOLD_CLAIM", "overallScore": 0, "scores": { "curiosityGap": 0, "clarity": 0, "emotionalTrigger": 0, "platformFit": 0, "nicheRelevance": 0 }, "whatChanged": "One precise sentence" },
    { "text": "rewritten hook 3", "style": "PERSONAL_STORY", "overallScore": 0, "scores": { "curiosityGap": 0, "clarity": 0, "emotionalTrigger": 0, "platformFit": 0, "nicheRelevance": 0 }, "whatChanged": "One precise sentence" }
  ]
}`;

  let lastErr;
  for (const model of MODELS) {
    try {
      const msg = await client.messages.create({ model, max_tokens: 1400, messages: [{ role: 'user', content: prompt }] });
      const raw = msg.content[0]?.text?.trim() || '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON in response');
      const data = JSON.parse(match[0]);

      const clamp = (v) => Math.min(100, Math.max(0, Math.round(v)));
      const clampScores = (obj) => ({ ...obj, overallScore: clamp(obj.overallScore), scores: Object.fromEntries(Object.entries(obj.scores).map(([k, v]) => [k, clamp(v)])) });
      data.original = clampScores(data.original);
      data.rewrites  = data.rewrites.map(clampScores);

      // Increment usage (non-blocking)
      if (auth.userId) incrementUsage(auth.userId, 'improve');

      return res.status(200).json(data);
    } catch (err) { lastErr = err; }
  }
  return res.status(500).json({ error: lastErr?.message || 'Failed. Please try again.' });
}
