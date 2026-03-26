import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simple in-memory rate limiter (resets on server restart / Vercel cold start)
// For production, swap this for Redis or Upstash
const rateLimitMap = new Map();
const SERVER_RATE_LIMIT = 20; // max requests per IP per hour

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const data = rateLimitMap.get(ip);
  if (now > data.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (data.count >= SERVER_RATE_LIMIT) return false;
  data.count++;
  return true;
}

const PLATFORM_CONTEXT = {
  TikTok: 'TikTok short-form video (15s–3min). Audience scrolls fast. First 1–2 seconds decide everything. Visual hooks, bold text overlays, and pattern interrupts work best. Average watch time is 7s.',
  YouTube: 'YouTube long-form video. Audience decides in the first 30 seconds. Thumbnail + hook work together. Curiosity loops, lists, and credibility signals work best.',
  Instagram: 'Instagram Reels and feed posts. Visual-first platform. Audience skips instantly. Relatability, aesthetic, and quick emotional payoff dominate.',
  'Twitter/X': 'Twitter/X text-based feed. Readers scan in under 2 seconds. Contrarian takes, bold claims, and curiosity gaps work best. Character limit demands precision.',
  LinkedIn: 'LinkedIn professional network. Audience skimming during work. Personal stories, vulnerability, and professional credibility drive engagement. "I did X and it changed my career" format works.',
};

const NICHE_CONTEXT = {
  Finance: 'Personal finance, investing, money-saving, wealth building. Core fears: losing money, missing out, dying broke. Core desires: financial freedom, passive income, retiring early.',
  Fitness: 'Workouts, nutrition, weight loss, muscle gain, mental health. Core fears: never reaching goals, wasting time with wrong methods. Core desires: body transformation, confidence, longevity.',
  Beauty: 'Skincare, makeup, haircare, aesthetics. Core desires: looking effortlessly good, finding hidden gems, being ahead of trends. Social proof and before/afters dominate.',
  Tech: 'Gadgets, software, AI tools, productivity. Core desires: doing more in less time, being first to know, having an edge. "You\'re wasting your time without this" style works.',
  Food: 'Recipes, restaurants, food culture. Core desire: easy wins in the kitchen, impressive results, nostalgic flavors. Visual payoff matters enormously.',
  Gaming: 'Video games, esports, gaming culture. Core desires: getting better, discovering secrets, community belonging. Insider knowledge and skill demonstrations drive engagement.',
  Business: 'Entrepreneurship, startups, side hustles, marketing. Core fears: failing, wasting time on wrong path. Core desires: freedom, revenue, scale. Real numbers and results convert.',
  Lifestyle: 'Daily routines, minimalism, travel, self-improvement. Core desires: simplification, aesthetic living, self-optimization. Personal transformation stories dominate.',
  Education: 'Learning, skills, career growth, academic content. Core desires: learning faster, getting credentials, career advancement. Counterintuitive insights and shortcuts dominate.',
  Comedy: 'Humor, memes, relatable content. Core desire: to laugh and share. Relatability, timing, and subverted expectations are everything.',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit check
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { hooks, platform, niche } = req.body;

  if (!hooks || !Array.isArray(hooks) || hooks.length === 0) {
    return res.status(400).json({ error: 'No hooks provided' });
  }

  if (hooks.length > 6) {
    return res.status(400).json({ error: 'Maximum 6 hooks allowed' });
  }

  const validHooks = hooks.filter(h => typeof h === 'string' && h.trim().length > 0);
  if (validHooks.length === 0) {
    return res.status(400).json({ error: 'All hooks are empty' });
  }

  const platformCtx = PLATFORM_CONTEXT[platform] || PLATFORM_CONTEXT['TikTok'];
  const nicheCtx = NICHE_CONTEXT[niche] || NICHE_CONTEXT['Business'];

  const hooksText = validHooks.map((hook, i) => `Hook ${i + 1}: "${hook.trim()}"`).join('\n');

  const systemPrompt = `You are a viral content strategist who has analyzed over 100,000 high-performing social media posts. You understand the psychology of scroll-stopping hooks and have a data-driven understanding of what drives engagement on each platform. You are direct, specific, and never give generic advice. Your scores reflect real benchmarks — a score of 90+ is rare and means genuinely outstanding viral potential. Most decent hooks score 55–72. A score below 40 means the hook will likely be scrolled past.`;

  const userPrompt = `Analyze these hooks for a ${niche} creator on ${platform}.

PLATFORM CONTEXT: ${platformCtx}
AUDIENCE PSYCHOLOGY: ${nicheCtx}

HOOKS TO ANALYZE:
${hooksText}

Score each hook on these 5 dimensions (0–100 each):
- curiosityGap: Does it create an information void the viewer MUST fill? Does it tease without giving away the answer?
- clarity: Can a random person understand exactly what this is about in under 2 seconds? No confusion.
- emotionalTrigger: Does it trigger fear of missing out, curiosity, surprise, desire, or pain? Stronger = higher score.
- platformFit: Does it match the tone, format, and audience expectations of ${platform} specifically?
- nicheRelevance: Does it speak directly to the specific pain points, desires, or insider language of the ${niche} audience?

Calculate overallScore as: (curiosityGap * 0.30) + (clarity * 0.20) + (emotionalTrigger * 0.25) + (platformFit * 0.10) + (nicheRelevance * 0.15). Round to nearest integer.

Be brutally honest. Do NOT give inflated scores to seem encouraging. A generic hook deserves a 40. A genuinely scroll-stopping hook deserves an 85+.

Respond with ONLY valid JSON. No markdown, no explanation outside the JSON.

{
  "hooks": [
    {
      "text": "exact hook text as provided",
      "scores": {
        "curiosityGap": 0,
        "clarity": 0,
        "emotionalTrigger": 0,
        "platformFit": 0,
        "nicheRelevance": 0
      },
      "overallScore": 0,
      "verdict": "One punchy sentence verdict on this hook's viral potential",
      "weakness": "The single most important thing holding this hook back (be specific)",
      "improvement": "A rewritten, improved version of this hook that fixes the weakness"
    }
  ],
  "winner": 0,
  "winnerReason": "One sentence explaining why this hook beats the others on ${platform}",
  "topTip": "One actionable insight that applies across all these hooks for ${niche} content on ${platform}"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = message.content[0].text.trim();

    // Extract JSON (handle potential markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!analysis.hooks || !Array.isArray(analysis.hooks)) {
      throw new Error('Invalid analysis structure');
    }

    // Clamp all scores to 0–100 range
    analysis.hooks = analysis.hooks.map(hook => ({
      ...hook,
      overallScore: Math.min(100, Math.max(0, Math.round(hook.overallScore))),
      scores: Object.fromEntries(
        Object.entries(hook.scores).map(([k, v]) => [k, Math.min(100, Math.max(0, Math.round(v)))])
      ),
    }));

    // Ensure winner index is valid
    analysis.winner = Math.min(analysis.hooks.length - 1, Math.max(0, analysis.winner));

    return res.status(200).json(analysis);
  } catch (err) {
    console.error('Analysis error:', err.message);

    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'AI rate limit hit. Please wait a moment and try again.' });
    }

    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
}
