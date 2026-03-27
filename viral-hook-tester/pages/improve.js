import Anthropic from '@anthropic-ai/sdk';

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT   = 20;
const RATE_WINDOW  = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now  = Date.now();
  const data = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > data.resetAt) { data.count = 0; data.resetAt = now + RATE_WINDOW; }
  data.count++;
  rateLimitMap.set(ip, data);
  return { allowed: data.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - data.count), resetAt: data.resetAt };
}

// ─── Validation ───────────────────────────────────────────────────────────────
const ALLOWED_PLATFORMS = new Set(['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn']);
const ALLOWED_NICHES    = new Set(['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy']);

function sanitize(str) {
  return String(str).replace(/\x00/g, '').replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').slice(0, 500);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODELS  = ['claude-sonnet-4-6', 'claude-opus-4-6'];

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const { allowed, remaining, resetAt } = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', remaining);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil((resetAt - Date.now()) / 1000));
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  const { hook, platform, niche } = req.body || {};

  if (!hook || typeof hook !== 'string' || hook.trim().length < 5)
    return res.status(400).json({ error: 'Please paste your hook (at least 5 characters).' });
  if (!ALLOWED_PLATFORMS.has(platform)) return res.status(400).json({ error: 'Invalid platform.' });
  if (!ALLOWED_NICHES.has(niche))       return res.status(400).json({ error: 'Invalid niche.' });

  const cleanHook = sanitize(hook.trim());

  const prompt = `You are a viral content strategist. A creator wrote this hook for ${platform} in the ${niche} niche:

"${cleanHook}"

Step 1 — Score the original on these 5 dimensions (0–100 each):
- curiosityGap (30% weight): Does it force the viewer to keep watching? Open a loop they must close?
- emotionalTrigger (25% weight): Fear, hope, surprise, FOMO, relatability — how strong is the emotional pull?
- clarity (20% weight): Is it instantly understood in under 2 seconds, zero friction?
- platformFit (15% weight): Does it match the tone, format, and energy of ${platform}?
- nicheRelevance (10% weight): Does it speak specifically to the ${niche} audience's pain points and desires?

overallScore = (curiosityGap×0.30) + (emotionalTrigger×0.25) + (clarity×0.20) + (platformFit×0.15) + (nicheRelevance×0.10). Round to nearest integer.

Step 2 — Write 3 dramatically improved rewrites. Each one must:
- Directly fix the main weakness of the original
- Target a different psychological angle
- Sound natural and creator-authentic — not generic or AI-sounding
- Be genuinely stronger than the original — not just cosmetically different
- Be optimized for ${platform} and ${niche}

Score each rewrite the same way.

Respond ONLY with valid JSON (no markdown, no explanation outside the JSON):
{
  "original": {
    "text": "${cleanHook.replace(/"/g, '\\"')}",
    "overallScore": number,
    "scores": { "curiosityGap": number, "clarity": number, "emotionalTrigger": number, "platformFit": number, "nicheRelevance": number },
    "mainIssue": "The single biggest weakness holding this hook back — be specific"
  },
  "rewrites": [
    {
      "text": "rewritten hook 1",
      "style": "CURIOSITY_GAP",
      "overallScore": number,
      "scores": { "curiosityGap": number, "clarity": number, "emotionalTrigger": number, "platformFit": number, "nicheRelevance": number },
      "whatChanged": "One precise sentence — what psychological lever did you pull and why is it stronger?"
    },
    {
      "text": "rewritten hook 2",
      "style": "BOLD_CLAIM",
      "overallScore": number,
      "scores": { "curiosityGap": number, "clarity": number, "emotionalTrigger": number, "platformFit": number, "nicheRelevance": number },
      "whatChanged": "One precise sentence"
    },
    {
      "text": "rewritten hook 3",
      "style": "PERSONAL_STORY",
      "overallScore": number,
      "scores": { "curiosityGap": number, "clarity": number, "emotionalTrigger": number, "platformFit": number, "nicheRelevance": number },
      "whatChanged": "One precise sentence"
    }
  ]
}

Valid style values: CURIOSITY_GAP | BOLD_CLAIM | PERSONAL_STORY | CONTRARIAN | PATTERN_INTERRUPT | RELATABLE_PAIN | STATISTIC`;

  let lastErr;
  for (const model of MODELS) {
    try {
      const msg = await client.messages.create({
        model,
        max_tokens: 1400,
        messages: [{ role: 'user', content: prompt }],
      });
      const raw   = msg.content[0]?.text?.trim() || '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON in response');
      const data = JSON.parse(match[0]);

      // Clamp scores
      const clamp = (v) => Math.min(100, Math.max(0, Math.round(v)));
      const clampScores = (obj) => ({
        ...obj,
        overallScore: clamp(obj.overallScore),
        scores: Object.fromEntries(Object.entries(obj.scores).map(([k, v]) => [k, clamp(v)])),
      });

      data.original = clampScores(data.original);
      data.rewrites = data.rewrites.map(clampScores);

      return res.status(200).json(data);
    } catch (err) {
      lastErr = err;
    }
  }
  return res.status(500).json({ error: lastErr?.message || 'Failed. Please try again.' });
}
