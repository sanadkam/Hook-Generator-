import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
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

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const next = router.query.redirect || '/generate';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${next}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        if (data?.session) {
          router.replace(router.query.redirect || '/generate');
        } else {
          setSuccess('Account created! Check your email for a confirmation link, then sign in.');
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
    setLoading(true);
    setError(null);
    try {
      const next = router.query.redirect || '/generate';
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${next}`,
        },
      });
      if (error) throw error;
      setSuccess('Magic link sent! Check your email â click the link to sign in instantly.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess('Password reset link sent! Check your inbox.');
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
        <title>{mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Sign In'} â HookLab</title>
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
              <div className="text-4xl mb-4">â¡</div>
              <h1 className="text-2xl font-black mb-2">
                {mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset password' : 'Welcome back'}
              </h1>
              <p className="text-white/40 text-sm">
                {mode === 'signup'
                  ? '3 free uses per month Â· No card required'
                  : mode === 'forgot'
                  ? "Enter your email and we'll send a reset link."
                  : 'Sign in to continue making viral hooks'}
              </p>
            </div>

            {mode !== 'forgot' && (
              <div className="flex bg-white/[0.05] border border-white/10 rounded-xl p-1 mb-6">
                <button onClick={() => { setMode('signin'); setError(null); setSuccess(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signin' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>Sign in</button>
                <button onClick={() => { setMode('signup'); setError(null); setSuccess(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>Sign up</button>
              </div>
            )}

            {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            {success && <div className="mb-4 px-4 py-3 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 text-sm">{success}</div>}

            {mode !== 'forgot' && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 mb-4 flex items-center justify-center gap-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/25">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </>
            )}

            {mode === 'forgot' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-white/40 tracking-widest block mb-2">EMAIL</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors" />
                </div>
                <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'}`}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-white/40 tracking-widest block mb-2">EMAIL</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-mono text-white/40 tracking-widest block mb-2">PASSWORD</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors" />
                </div>
                <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'}`}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                      {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </span>
                  ) : mode === 'signup' ? 'Create free account' : 'Sign in'}
                </button>
              </form>
            )}

            {mode === 'signin' && (
              <div className="mt-3 text-center">
                <button onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {mode !== 'forgot' && (
              <>
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/25">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <button onClick={handleMagicLink} disabled={loading} className="w-full py-3 border border-white/10 hover:border-white/25 rounded-xl text-sm text-white/50 hover:text-white transition-all disabled:opacity-40">
                  âï¸ Send magic link (no password)
                </button>
                <p className="text-center text-xs text-white/25 mt-6">
                  {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
                  <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); setSuccess(null); }} className="text-green-400 hover:text-green-300 transition-colors">
                    {mode === 'signup' ? 'Sign in' : 'Create free account'}
                  </button>
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <div className="mt-4 text-center">
                <button onClick={() => { setMode('signin'); setError(null); setSuccess(null); }} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                  â Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
