/**
 * /api/health — quick diagnostic endpoint
 * Visit /api/health in your browser to check if the API key is working.
 * DELETE this file once everything is confirmed working.
 */

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Check env var exists
  const keyExists = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = keyExists ? process.env.ANTHROPIC_API_KEY.slice(0, 7) + '...' : 'NOT SET';

  if (!keyExists) {
    return res.status(200).json({
      ok: false,
      problem: 'ANTHROPIC_API_KEY is not set in Vercel environment variables',
      keyPrefix,
    });
  }

  // Try a tiny API call
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok"' }],
    });
    return res.status(200).json({
      ok: true,
      keyPrefix,
      modelUsed: 'claude-3-haiku-20240307',
      response: msg.content[0]?.text,
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      problem: err.message,
      status: err.status,
      keyPrefix,
    });
  }
}
