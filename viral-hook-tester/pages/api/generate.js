/**
 * /api/generate — HookScore viral hook generator
 *
 * Security hardening (OWASP-aligned):
 *  - IP-based rate limiting with in-memory store (swap for Redis at scale)
 *  - Strict input validation: whitelist, type checks, length limits
 *  - Unknown/extra fields are silently ignored (no passthrough to AI)
 *  - API key lives only in server env — never sent to the client
 *  - Security response headers on every reply
 *  - Graceful 429 with Retry-After header
 *  - Sanitized text input (strips null bytes & non-printable control chars)
 */

import Anthropic from '@anthropic-ai/sdk';

// ─── Anthropic client — API key from env ONLY, never hard-coded ───────────────
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Allowed values (whitelist) ────────────────────────────────────────────────
const ALLOWED_PLATFORMS = new Set(['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn']);
const ALLOWED_NICHES    = new Set(['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

// ─── Input limits ─────────────────────────────────────────────────────────────
const MAX_TEXT_LENGTH   = 3000;   // chars
const MAX_BASE64_LENGTH = 11_000_000; // ~8 MB decoded

// ─── Rate limiting — in-memory, per IP ────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT    = 20;              // max requests
const WINDOW_MS     = 60 * 60 * 1000; // per 1 hour

// Clean stale entries every 10 minutes to prevent memory growth
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
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetTime: entry.resetTime };
}

// ─── Text sanitizer ───────────────────────────────────────────────────────────
function sanitizeText(str) {
  // Strip null bytes and non-printable ASCII control characters (except tab, newline, CR)
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// ─── Platform & Niche Context ─────────────────────────────────────────────────

const PLATFORM_CONTEXT = {
  TikTok: {
    desc:    'TikTok short-form video (15s–3min). Viewer decides in the first 1–2 seconds whether to keep watching or scroll.',
    format:  'Short, punchy, spoken aloud. 5–12 words. Sounds natural when said out loud.',
    examples: ['"I wish someone told me this sooner"', '"Stop scrolling — this could save you $X"'],
  },
  YouTube: {
    desc:    'YouTube long-form video. Viewer decides in the first 15–30 seconds.',
    format:  'More complete sentence. 8–18 words. Promises a transformation or teases a result.',
    examples: ['"I tested every productivity system so you don\'t have to — here\'s the only one that actually works"'],
  },
  Instagram: {
    desc:    'Instagram Reels/feed. Visual-first. Hook is the first line of a caption or on-screen text overlay.',
    format:  'Short and visual. 5–10 words. Relatable or emotional.',
    examples: ['"No one talks about this part of X"', '"If you\'re still doing X, read this"'],
  },
  'Twitter/X': {
    desc:    'Twitter/X text-based feed. The hook IS the first line of the tweet.',
    format:  'Sharp, punchy, standalone sentence. 6–12 words. Contrarian or surprising.',
    examples: ['"Most people get X completely backwards"', '"I spent X doing Y. Here\'s what I learned:"'],
  },
  LinkedIn: {
    desc:    'LinkedIn professional network. Hook is the first 1–2 lines before the "see more" cutoff.',
    format:  '1–2 punchy sentences. 10–20 words total. Personal and credible.',
    examples: ['"I got rejected 14 times before landing my dream role. Here\'s what changed."'],
  },
};

const NICHE_CONTEXT = {
  Finance:   'Personal finance, investing, money-saving. Core fears: losing money, dying broke. Core desires: financial freedom, passive income.',
  Fitness:   'Workouts, nutrition, transformation. Core fears: wasting time, never reaching goals. Core desires: visible results fast, confidence.',
  Beauty:    'Skincare, makeup, haircare. Core desires: effortless results, hidden gems, trend-leading.',
  Tech:      'Gadgets, software, AI tools. Core desires: doing more in less time, being first to know.',
  Food:      'Recipes, restaurants, culture. Core desire: easy impressive results, new discoveries.',
  Gaming:    'Video games, esports. Core desires: getting better, secrets/exploits, insider knowledge.',
  Business:  'Entrepreneurship, side hustles, marketing. Core fears: failing, wasting time. Core desires: freedom, revenue.',
  Lifestyle: 'Daily routines, travel, self-improvement. Core desires: simplification, self-optimization.',
  Education: 'Learning, skills, career. Core desires: learning faster, shortcuts, career advancement.',
  Comedy:    'Humor, relatable content. Core desire: to laugh and share. Timing and subverted expectations.',
};

const HOOK_STYLES = [
  { style: 'Curiosity Gap',  desc: 'Teases information the viewer absolutely needs without giving it away.' },
  { style: 'Bold Claim',     desc: 'Makes a surprising, counterintuitive, or controversial statement.' },
  { style: 'Personal Story', desc: 'Opens with a relatable personal moment or transformation.' },
];

// ─── Body parser config ───────────────────────────────────────────────────────
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

// ─── Security headers helper ──────────────────────────────────────────────────
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setSecurityHeaders(res);

  // Method guard
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  const rl = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit',     String(RATE_LIMIT));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  res.setHeader('X-RateLimit-Reset',     String(Math.ceil(rl.resetTime / 1000)));

  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetTime - Date.now()) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // ── Input validation (strict — only known fields accepted) ───────────────────
  const body = req.body;

  // Must be a plain object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  // platform — required, whitelist
  const platform = body.platform;
  if (typeof platform !== 'string' || !ALLOWED_PLATFORMS.has(platform)) {
    return res.status(400).json({ error: 'Invalid platform.' });
  }

  // niche — required, whitelist
  const niche = body.niche;
  if (typeof niche !== 'string' || !ALLOWED_NICHES.has(niche)) {
    return res.status(400).json({ error: 'Invalid niche.' });
  }

  // text — optional string, length-limited, sanitized
  let text = null;
  if (body.text !== undefined) {
    if (typeof body.text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string.' });
    }
    text = sanitizeText(body.text);
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: `Text exceeds ${MAX_TEXT_LENGTH} character limit.` });
    }
  }

  // imageBase64 + imageMimeType — optional, validated together
  let imageBase64 = null;
  let imageMimeType = null;
  if (body.imageBase64 !== undefined || body.imageMimeType !== undefined) {
    if (typeof body.imageBase64 !== 'string' || typeof body.imageMimeType !== 'string') {
      return res.status(400).json({ error: 'Invalid image fields.' });
    }
    if (!ALLOWED_MIME_TYPES.has(body.imageMimeType)) {
      return res.status(400).json({ error: 'Unsupported image type.' });
    }
    if (body.imageBase64.length > MAX_BASE64_LENGTH) {
      return res.status(400).json({ error: 'Image too large.' });
    }
    // Basic base64 character validation
    if (!/^[A-Za-z0-9+/=]+$/.test(body.imageBase64)) {
      return res.status(400).json({ error: 'Invalid image data.' });
    }
    imageBase64   = body.imageBase64;
    imageMimeType = body.imageMimeType;
  }

  const hasText  = text && text.length > 10;
  const hasImage = imageBase64 && imageMimeType;

  if (!hasText && !hasImage) {
    return res.status(400).json({ error: 'Please provide your content — paste text or upload an image.' });
  }

  // ── Build prompt ─────────────────────────────────────────────────────────────
  const platformCtx = PLATFORM_CONTEXT[platform];
  const nicheCtx    = NICHE_CONTEXT[niche];

  const systemPrompt = `You are a world-class viral content strategist who has written hooks for creators with combined followings of over 50 million. You deeply understand the psychology of attention, scroll behavior, and platform-specific audience expectations. You write hooks that feel human, natural, and impossible to ignore.

Your hooks are:
- Specific, never generic
- Written for the exact platform's format and character
- Calibrated to the niche audience's deepest fears and desires
- Different in style from each other so the creator has real options

You never write filler. Every word earns its place.`;

  const styleInstructions = HOOK_STYLES.map((s, i) =>
    `Hook ${i + 1} — ${s.style}: ${s.desc}`
  ).join('\n');

  const taskPrompt = `Analyze the content provided and generate 3 viral hook options for a ${niche} creator on ${platform}.

PLATFORM: ${platformCtx.desc}
HOOK FORMAT FOR ${platform.toUpperCase()}: ${platformCtx.format}
FORMAT EXAMPLES: ${platformCtx.examples.join(' | ')}
NICHE AUDIENCE PSYCHOLOGY: ${nicheCtx}

GENERATE THESE 3 STYLES:
${styleInstructions}

SCORING (0–100 each):
- curiosityGap: Does it create a must-fill information void?
- clarity: Is the topic instantly understood in under 2 seconds?
- emotionalTrigger: Does it trigger FOMO, curiosity, desire, surprise, or fear?
- platformFit: Is it perfectly calibrated for ${platform}'s tone and format?
- nicheRelevance: Does it speak the exact language of ${niche} creators and their audience?

Calculate overallScore = (curiosityGap × 0.30) + (clarity × 0.20) + (emotionalTrigger × 0.25) + (platformFit × 0.10) + (nicheRelevance × 0.15). Round to integer.

Be honest with scores. Generic = 40. Good = 65. Great = 80. Exceptional = 90+.

${hasText ? `CONTENT TO BASE HOOKS ON:\n${text}` : 'Analyze the image/screenshot provided to understand the content.'}

Respond with ONLY valid JSON (no markdown, no code fences, no commentary):

{
  "contentSummary": "One sentence: what this content is actually about",
  "hooks": [
    {
      "style": "Curiosity Gap",
      "text": "The actual hook text, ready to use",
      "scores": {
        "curiosityGap": 0,
        "clarity": 0,
        "emotionalTrigger": 0,
        "platformFit": 0,
        "nicheRelevance": 0
      },
      "overallScore": 0,
      "whyItWorks": "One sentence: the specific psychological mechanism",
      "deliveryTip": "One sentence: how to deliver this hook on ${platform}"
    }
  ],
  "winner": 0,
  "winnerReason": "One sentence: why this hook beats the others"
}`;

  // ── Build message content (text or vision) ────────────────────────────────────
  const messageContent = hasImage
    ? [
        { type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageBase64 } },
        { type: 'text', text: taskPrompt },
      ]
    : taskPrompt;

  // ── Call Anthropic API + parse response (single try/catch covers everything) ──
  const MODELS = [
    'claude-3-5-haiku-20241022',   // fast, cheap, widely available
    'claude-3-haiku-20240307',     // older fallback
    'claude-3-5-sonnet-20241022',  // last resort
  ];

  try {
    // Try each model in order; only retry on 400/404 (model not found)
    let message;
    for (const modelId of MODELS) {
      try {
        message = await client.messages.create({
          model:      modelId,
          max_tokens: 2000,
          system:     systemPrompt,
          messages:   [{ role: 'user', content: messageContent }],
        });
        break; // success
      } catch (modelErr) {
        console.error(`Model ${modelId} failed (${modelErr.status}):`, modelErr.message);
        if (modelId === MODELS[MODELS.length - 1]) throw modelErr; // rethrow on last attempt
        if (modelErr.status !== 400 && modelErr.status !== 404) throw modelErr; // non-model error — stop retrying
        // otherwise loop to next model
      }
    }

    const raw     = message.content[0]?.text?.trim() ?? '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('No JSON in response. Raw:', raw.slice(0, 300));
      return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });
    }

    const result = JSON.parse(jsonMatch[0]);

    if (!result.hooks || !Array.isArray(result.hooks) || result.hooks.length === 0) {
      return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });
    }

    // Clamp all scores 0–100
    result.hooks = result.hooks.map(hook => ({
      ...hook,
      overallScore: Math.min(100, Math.max(0, Math.round(Number(hook.overallScore) || 0))),
      scores: Object.fromEntries(
        Object.entries(hook.scores || {}).map(([k, v]) => [
          k, Math.min(100, Math.max(0, Math.round(Number(v) || 0))),
        ])
      ),
    }));

    result.winner = Math.min(result.hooks.length - 1, Math.max(0, Number(result.winner) || 0));
    return res.status(200).json(result);

  } catch (err) {
    console.error('Generate error:', { message: err.message, status: err.status, type: err.constructor?.name });

    if (err.status === 401) return res.status(500).json({ error: 'API key error. Please contact support.' });
    if (err.status === 429) {
      res.setHeader('Retry-After', '30');
      return res.status(429).json({ error: 'AI is busy. Please retry in a moment.' });
    }
    if (err.status === 529 || err.status === 503) return res.status(503).json({ error: 'AI is overloaded. Please retry in a moment.' });

    return res.status(500).json({ error: 'Generation failed. Please try again.' });
  }
}
