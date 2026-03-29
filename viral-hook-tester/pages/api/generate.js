import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ─── Auth & usage helpers ──────────────────────────────────────────────────────
const FREE_LIMIT = 3;

async function checkAuth(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase not configured: allow all (backwards compat during setup)
  if (!supabaseUrl || !serviceKey) return { ok: true, userId: null };

  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (!token) return { ok: false, status: 401, error: 'auth_required' };

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return { ok: false, status: 401, error: 'auth_required' };

  // Check subscription
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  const isPaid = sub && sub.status === 'active' && sub.plan !== 'free';
  if (isPaid) return { ok: true, userId: user.id, plan: sub.plan };

  // Free tier: check monthly usage
  const month = new Date().toISOString().slice(0, 7);
  const { data: usage } = await admin
    .from('usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('feature', 'generate')
    .eq('month', month)
    .single();

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
    await admin.rpc('increment_usage', {
      p_user_id: userId,
      p_feature:  feature,
      p_month:   new Date().toISOString().slice(0, 7),
    });
  } catch (err) {
    console.error('Usage increment failed:', err.message);
  }
}

// ─── Anthropic client ──────────────────────────────────────────────────────────
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Allowed values ────────────────────────────────────────────────────────────
const ALLOWED_PLATFORMS = new Set(['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn']);
const ALLOWED_NICHES    = new Set(['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

const MAX_TEXT_LENGTH   = 3000;
const MAX_BASE64_LENGTH = 11_000_000;

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const WINDOW_MS  = 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) rateLimitMap.delete(key);
  }
}, 10 * 60 * 1000);

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: now + WINDOW_MS };
  }
  if (entry.count >= RATE_LIMIT) return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetTime: entry.resetTime };
}

function sanitizeText(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// ─── Platform / Niche context ──────────────────────────────────────────────────
const PLATFORM_CONTEXT = {
  TikTok:    { desc: 'TikTok short-form video (15s–3min). Viewer decides in the first 1–2 seconds.', format: 'Short, punchy, spoken aloud. 5–12 words.', examples: ['"I wish someone told me this sooner"', '"Stop scrolling — this could save you $X"'] },
  YouTube:   { desc: 'YouTube long-form video. Viewer decides in the first 15–30 seconds.', format: 'More complete sentence. 8–18 words.', examples: ['"I tested every productivity system so you don\'t have to"'] },
  Instagram: { desc: 'Instagram Reels/feed. Hook is first line or on-screen text.', format: 'Short and visual. 5–10 words.', examples: ['"No one talks about this part of X"'] },
  'Twitter/X': { desc: 'Twitter/X text-based feed. The hook IS the first line.', format: 'Sharp, punchy, standalone sentence. 6–12 words.', examples: ['"Most people get X completely backwards"'] },
  LinkedIn:  { desc: 'LinkedIn professional network. Hook is the first 1–2 lines before "see more".', format: '1–2 punchy sentences. 10–20 words total.', examples: ['"I got rejected 14 times before landing my dream role. Here\'s what changed."'] },
};

const NICHE_CONTEXT = {
  Finance:   'Personal finance, investing, money-saving. Core fears: losing money, dying broke. Core desires: financial freedom.',
  Fitness:   'Workouts, nutrition, transformation. Core fears: wasting time, never reaching goals. Core desires: visible results fast.',
  Beauty:    'Skincare, makeup, haircare. Core desires: effortless results, hidden gems, trend-leading.',
  Tech:      'Gadgets, software, AI tools. Core desires: doing more in less time, being first to know.',
  Food:      'Recipes, restaurants, culture. Core desire: easy impressive results, new discoveries.',
  Gaming:    'Video games, esports. Core desires: getting better, secrets/exploits, insider knowledge.',
  Business:  'Entrepreneurship, side hustles, marketing. Core fears: failing, wasting time. Core desires: freedom, revenue.',
  Lifestyle: 'Daily routines, travel, self-improvement. Core desires: simplification, self-optimization.',
  Education: 'Learning, skills, career. Core desires: learning faster, shortcuts, career advancement.',
  Comedy:    'Humor, relatable content. Core desire: to laugh and share.',
};

const HOOK_STYLES = [
  { style: 'Curiosity Gap', desc: 'Teases information the viewer absolutely needs without giving it away.' },
  { style: 'Bold Claim',    desc: 'Makes a surprising, counterintuitive, or controversial statement.' },
  { style: 'Personal Story', desc: 'Opens with a relatable personal moment or transformation.' },
];

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(rl.resetTime / 1000)));
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetTime - Date.now()) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // ── Auth & usage check (server-side — incognito-proof) ──────────────────────
  const auth = await checkAuth(req);
  if (!auth.ok) {
    if (auth.error === 'auth_required')  return res.status(401).json({ error: 'auth_required' });
    if (auth.error === 'limit_reached')  return res.status(402).json({ error: 'limit_reached' });
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── Input validation ─────────────────────────────────────────────────────────
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid request body.' });

  const platform = body.platform;
  if (typeof platform !== 'string' || !ALLOWED_PLATFORMS.has(platform)) return res.status(400).json({ error: 'Invalid platform.' });

  const niche = body.niche;
  if (typeof niche !== 'string' || !ALLOWED_NICHES.has(niche)) return res.status(400).json({ error: 'Invalid niche.' });

  let text = null;
  if (body.text !== undefined) {
    if (typeof body.text !== 'string') return res.status(400).json({ error: 'Text must be a string.' });
    text = sanitizeText(body.text);
    if (text.length > MAX_TEXT_LENGTH) return res.status(400).json({ error: `Text exceeds ${MAX_TEXT_LENGTH} character limit.` });
  }

  let imageBase64 = null, imageMimeType = null;
  if (body.imageBase64 !== undefined || body.imageMimeType !== undefined) {
    if (typeof body.imageBase64 !== 'string' || typeof body.imageMimeType !== 'string') return res.status(400).json({ error: 'Invalid image fields.' });
    if (!ALLOWED_MIME_TYPES.has(body.imageMimeType)) return res.status(400).json({ error: 'Unsupported image type.' });
    if (body.imageBase64.length > MAX_BASE64_LENGTH) return res.status(400).json({ error: 'Image too large.' });
    if (!/^[A-Za-z0-9+/=]+$/.test(body.imageBase64)) return res.status(400).json({ error: 'Invalid image data.' });
    imageBase64 = body.imageBase64;
    imageMimeType = body.imageMimeType;
  }

  const hasText  = text && text.length > 10;
  const hasImage = imageBase64 && imageMimeType;
  if (!hasText && !hasImage) return res.status(400).json({ error: 'Please provide your content — paste text or upload an image.' });

  // ── Build prompt ─────────────────────────────────────────────────────────────
  const platformCtx = PLATFORM_CONTEXT[platform];
  const nicheCtx    = NICHE_CONTEXT[niche];
  const systemPrompt = `You are a world-class viral content strategist who has written hooks for creators with combined followings of over 50 million. You deeply understand the psychology of attention, scroll behavior, and platform-specific audience expectations. You write hooks that feel human, natural, and impossible to ignore. Your hooks are: specific, never generic; written for the exact platform's format; calibrated to the niche audience's deepest fears and desires; different in style from each other.`;
  const styleInstructions = HOOK_STYLES.map((s, i) => `Hook ${i + 1} — ${s.style}: ${s.desc}`).join('\n');
  const taskPrompt = `Analyze the content provided and generate 3 viral hook options for a ${niche} creator on ${platform}.

PLATFORM: ${platformCtx.desc}
HOOK FORMAT: ${platformCtx.format}
FORMAT EXAMPLES: ${platformCtx.examples.join(' | ')}
NICHE AUDIENCE PSYCHOLOGY: ${nicheCtx}

GENERATE THESE 3 STYLES:
${styleInstructions}

SCORING (0–100 each): curiosityGap (×0.30), clarity (×0.20), emotionalTrigger (×0.25), platformFit (×0.10), nicheRelevance (×0.15). Calculate overallScore = weighted sum, round to integer.

${hasText ? `CONTENT TO BASE HOOKS ON:\n${text}` : 'Analyze the image/screenshot provided.'}

Respond with ONLY valid JSON:
{
  "contentSummary": "One sentence: what this content is actually about",
  "hooks": [
    {
      "style": "Curiosity Gap",
      "text": "The actual hook text",
      "scores": { "curiosityGap": 0, "clarity": 0, "emotionalTrigger": 0, "platformFit": 0, "nicheRelevance": 0 },
      "overallScore": 0,
      "whyItWorks": "One sentence: the specific psychological mechanism",
      "deliveryTip": "One sentence: how to deliver this hook on ${platform}"
    }
  ],
  "winner": 0,
  "winnerReason": "One sentence: why this hook beats the others"
}`;

  const messageContent = hasImage
    ? [{ type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageBase64 } }, { type: 'text', text: taskPrompt }]
    : taskPrompt;

  // ── Call Anthropic ───────────────────────────────────────────────────────────
  const MODELS = ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-3-5-sonnet-20241022'];
  try {
    let message;
    for (const modelId of MODELS) {
      try {
        message = await client.messages.create({ model: modelId, max_tokens: 2000, system: systemPrompt, messages: [{ role: 'user', content: messageContent }] });
        break;
      } catch (modelErr) {
        console.error(`Model ${modelId} failed:`, modelErr.message);
        if (modelId === MODELS[MODELS.length - 1]) throw modelErr;
        if (modelErr.status !== 400 && modelErr.status !== 404) throw modelErr;
      }
    }

    const raw     = message.content[0]?.text?.trim() ?? '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });

    const result = JSON.parse(jsonMatch[0]);
    if (!result.hooks || !Array.isArray(result.hooks) || result.hooks.length === 0) return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });

    result.hooks = result.hooks.map(hook => ({
      ...hook,
      overallScore: Math.min(100, Math.max(0, Math.round(Number(hook.overallScore) || 0))),
      scores: Object.fromEntries(Object.entries(hook.scores || {}).map(([k, v]) => [k, Math.min(100, Math.max(0, Math.round(Number(v) || 0)))])),
    }));
    result.winner = Math.min(result.hooks.length - 1, Math.max(0, Number(result.winner) || 0));

    // Increment usage (non-blocking)
    if (auth.userId) incrementUsage(auth.userId, 'generate');

    return res.status(200).json(result);
  } catch (err) {
    console.error('Generate error:', err.message);
    if (err.status === 401) return res.status(500).json({ error: 'API key error. Please contact support.' });
    if (err.status === 429) { res.setHeader('Retry-After', '30'); return res.status(429).json({ error: 'AI is busy. Please retry in a moment.' }); }
    if (err.status === 529 || err.status === 503) return res.status(503).json({ error: 'AI is overloaded. Please retry in a moment.' });
    return res.status(500).json({ error: 'Generation failed. Please try again.' });
  }
                }
