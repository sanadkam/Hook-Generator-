import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(router.query.redirect || '/generate');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
        });
        if (error) throw error;
        if (data?.session) {
          router.replace(router.query.redirect || '/generate');
        } else {
          setSuccess('Check your email for a confirmation link, then sign in.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(router.query.redirect || '/generate');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    if (!supabase) return;
    setLoading(true); setError(null);
    try {
      const next = router.query.redirect || '/generate';
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${next}` },
      });
      if (error) throw error;
      setSuccess('Magic link sent! Check your email — click the link to sign in instantly.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!supabase) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 text-sm">Auth not configured yet.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{mode === 'signup' ? 'Create Account' : 'Sign In'} — HookLab</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <Link href="/pricing" className="text-sm text-white/35 hover:text-white/65 transition-colors">Pricing</Link>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">⚡</div>
              <h1 className="text-2xl font-black mb-2">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-white/40 text-sm">
                {mode === 'signup' ? '3 free uses per month · No card required' : 'Sign in to continue making viral hooks'}
              </p>
            </div>

            <div className="flex bg-white/[0.05] border border-white/10 rounded-xl p-1 mb-6">
              <button onClick={() => { setMode('signin'); setError(null); setSuccess(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signin' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>Sign in</button>
              <button onClick={() => { setMode('signup'); setError(null); setSuccess(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>Sign up</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest block mb-2">EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest block mb-2">PASSWORD</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors" />
              </div>

              {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
              {success && <div className="px-4 py-3 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 text-sm">{success}</div>}

              <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'}`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
                  : mode === 'signup' ? 'Create free account' : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/25">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button onClick={handleMagicLink} disabled={loading} className="w-full py-3 border border-white/10 hover:border-white/25 rounded-xl text-sm text-white/50 hover:text-white transition-all disabled:opacity-40">
              ✉️ Send magic link (no password)
            </button>

            <p className="text-center text-xs text-white/25 mt-6">
              {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
              <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); setSuccess(null); }} className="text-green-400 hover:text-green-300 transition-colors">
                {mode === 'signup' ? 'Sign in' : 'Create free account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
    }
