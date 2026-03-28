import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser-safe client — respects RLS, persists session automatically */
export const supabase = (url && anon) ? createClient(url, anon) : null;

/** Server-only admin client — bypasses RLS, never import in browser code */
export const supabaseAdmin = () => {
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !svc) return null;
  return createClient(url, svc, { auth: { persistSession: false } });
};
