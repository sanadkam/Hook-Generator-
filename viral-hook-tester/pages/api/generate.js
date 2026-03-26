import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory rate limiter — swap for Upstash Redis at scale
const rateLimitMap = new Map();
const SERVER_RATE_LIMIT = 20; // per IP per hour

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
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

// ─── Platform & Niche Context ─────────────────────────────────────────────────

const PLATFORM_CONTEXT = {
  TikTok: {
    desc: 'TikTok short-form video (15s–3min). Viewer decides in the first 1–2 seconds whether to keep watching or scroll. The hook is the spoken or on-screen text that appears in the first 2 seconds.',
    format: 'Short, punchy, spoken aloud. 5–12 words. Sounds natural when said out loud. Uses bold curiosity, relatable pain, or a surprising claim.',
    examples: ['"I wish someone told me this sooner"', '"POV: you just discovered the cheat code for X"', '"Stop scrolling — this could save you $X"'],
  },
  YouTube: {
    desc: 'YouTube long-form video. Viewer decides in the first 15–30 seconds. The hook is the first sentence spoken in the video, often paired with a thumbnail text.',
    format: 'More complete sentence. 8–18 words. Can promise a transformation, tease a result, or open a curiosity loop that only the full video closes.',
    examples: ['"I tested every productivity system so you don\'t have to — here\'s the only one that actually works"', '"In the next 10 minutes, I\'m going to show you exactly how I went from X to Y"'],
  },
  Instagram: {
    desc: 'Instagram Reels/feed. Visual-first platform. Audience skips in under 2 seconds. Hook is the first line of a caption or the on-screen text overlay.',
    format: 'Short and visual. 5–10 words. Relatable, aesthetic, or emotional. Often uses "if you..." or "this is for anyone who..."',
    examples: ['"No one talks about this part of X"', '"If you\'re still doing X, read this"'],
  },
  'Twitter/X': {
    desc: 'Twitter/X text-based feed. Reader scans in under 2 seconds. The hook IS the first line of the tweet — it determines if they click "show more".',
    format: 'Sharp, punchy, standalone sentence. 6–12 words. Contrarian, bold, or surprising. Must work without context.',
    examples: ['"Most people get X completely backwards"', '"Unpopular opinion: X is actually the wrong move"', '"I spent X doing Y. Here\'s what I learned:"'],
  },
  LinkedIn: {
    desc: 'LinkedIn professional network. Readers skim during work. The hook is the first 1–2 lines before the "see more" cutoff.',
    format: '1–2 punchy sentences. 10–20 words total. Personal, credible, and professional. Short paragraphs. Often uses a personal story opener or a bold professional claim.',
    examples: ['"I got rejected 14 times before landing my dream role. Here\'s what changed."', '"After 10 years in X, I\'ve noticed one thing that separates good from great:"'],
  },
};

const NICHE_CONTEXT = {
  Finance: 'Personal finance, investing, money-saving. Core fears: losing money, dying broke, missing opportunities. Core desires: financial freedom, passive income, early retirement.',
  Fitness: 'Workouts, nutrition, transformation. Core fears: wasting time on wrong methods, never reaching goals. Core desires: visible results fast, confidence, longevity.',
  Beauty: 'Skincare, makeup, haircare. Core desires: effortless results, finding hidden gems, being ahead of trends. Social proof and before/afters dominate.',
  Tech: 'Gadgets, software, AI tools, productivity. Core desires: doing more in less time, being first to know, gaining an unfair edge.',
  Food: 'Recipes, restaurants, culture. Core desire: easy impressive results, nostalgia, new discoveries. Visual payoff is crucial.',
  Gaming: 'Video games, esports, culture. Core desires: getting better, secrets/exploits, community. Insider knowledge wins.',
  Business: 'Entrepreneurship, side hustles, marketing. Core fears: failing, wasting time. Core desires: freedom, revenue, scale. Real numbers and results convert.',
  Lifestyle: 'Daily routines, travel, self-improvement. Core desires: simplification, aesthetic living, self-optimization.',
  Education: 'Learning, skills, career. Core desires: learning faster, shortcuts, career advancement. Counterintuitive insights dominate.',
  Comedy: 'Humor, relatable content. Core desire: to laugh and share. Timing and subverted expectations are everything.',
};

const HOOK_STYLES = [
  { style: 'Curiosity Gap', desc: 'Teases information the viewer absolutely needs without giving it away. Creates an itch they must scratch.' },
  { style: 'Bold Claim', desc: 'Makes a surprising, counterintuitive, or controversial statement that challenges assumptions.' },
  { style: 'Personal Story', desc: 'Opens with a relatable personal moment, failure, or transformation that mirrors the viewer\'s own experience.' },
];

// ─── Handler ──────────────────────────────────────────────────────────────────

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow image uploads
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { platform, niche, text, imageBase64, imageMimeType } = req.body;

  if (!platform || !niche) {
    return res.status(400).json({ error: 'Platform and niche are required.' });
  }

  const hasText = text && text.trim().length > 10;
  const hasImage = imageBase64 && imageMimeType;

  if (!hasText && !hasImage) {
    return res.status(400).json({ error: 'Please provide your content — paste text or upload an image.' });
  }

  const platformCtx = PLATFORM_CONTEXT[platform] || PLATFORM_CONTEXT['TikTok'];
  const nicheCtx = NICHE_CONTEXT[niche] || NICHE_CONTEXT['Business'];

  const systemPrompt = `You are a world-class viral content strategist who has written hooks for creators with combined followings of over 50 million. You deeply understand the psychology of attention, scroll behavior, and platform-specific audience expectations. You write hooks that feel human, natural, and impossible to ignore.

Your hooks are:
- Specific, never generic
- Written for the exact platform's format and character (spoken, text, caption, etc.)
- Calibrated to the niche audience's deepest fears and desires
- Different in style from each other so the creator has real options to choose from

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

${text ? `CONTENT TO BASE HOOKS ON:\n${text.trim()}` : 'Analyze the image/screenshot provided to understand the content.'}

Respond with ONLY valid JSON, no markdown, no commentary outside the JSON:

{
  "contentSummary": "One sentence: what this content is actually about, as you understood it",
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
      "whyItWorks": "One sentence: the specific psychological mechanism that makes this hook work",
      "deliveryTip": "One sentence: how to deliver or format this hook on ${platform}"
    }
  ],
  "winner": 0,
  "winnerReason": "One sentence: why this hook beats the others for ${niche} content on ${platform}"
}`;

  // Build the message content — text or vision
  let messageContent;

  if (hasImage) {
    messageContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageMimeType,
          data: imageBase64,
        },
      },
      {
        type: 'text',
        text: taskPrompt,
      },
    ];
  } else {
    messageContent = taskPrompt;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: messageContent }],
    });

    const raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);

    if (!result.hooks || !Array.isArray(result.hooks)) {
      throw new Error('Invalid response structure');
    }

    // Clamp scores
    result.hooks = result.hooks.map(hook => ({
      ...hook,
      overallScore: Math.min(100, Math.max(0, Math.round(hook.overallScore))),
      scores: Object.fromEntries(
        Object.entries(hook.scores).map(([k, v]) => [k, Math.min(100, Math.max(0, Math.round(v)))])
      ),
    }));

    result.winner = Math.min(result.hooks.length - 1, Math.max(0, result.winner ?? 0));

    return res.status(200).json(result);
  } catch (err) {
    console.error('Generate error:', err.message);
    if (err.status === 401) return res.status(500).json({ error: 'Invalid API key.' });
    if (err.status === 429) return res.status(429).json({ error: 'AI is busy. Please retry in a moment.' });
    return res.status(500).json({ error: 'Generation failed. Please try again.' });
  }
}
