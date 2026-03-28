import { createClient } from '@supabase/supabase-js';

/**
 * /api/auth/callback
 * Handles Supabase magic-link and email-confirmation redirects.
 * Supabase sends ?code=xxx here; we exchange it for a session then redirect.
 */
export default async function handler(req, res) {
  const { code, next = '/generate' } = req.query;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback error:', error.message);
      return res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  return res.redirect(next);
}
