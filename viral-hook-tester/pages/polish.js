import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

// ─── Constants ───────────────────────────────────────────────────────────────
const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];
const NICHES = ['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy'];
const FREE_LIMIT = 3;

// ─── Utilities ────────────────────────────────────────────────────────────────
function scoreColor(s) { return s >= 75 ? 'text-green-400' : s >= 55 ? 'text-yellow-400' : 'text-red-400'; }
function scoreBarColor(s) { return s >= 75 ? 'bg-green-400' : s >= 55 ? 'bg-yellow-400' : 'bg-red-400'; }
function scoreLabel(s) { return s >= 88 ? 'Exceptional' : s >= 75 ? 'Strong' : s >= 60 ? 'Decent' : s >= 45 ? 'Weak' : 'Skip it'; }
function styleLabel(s) {
  const map = { CURIOSITY_GAP: 'Curiosity Gap', BOLD_CLAIM: 'Bold Claim', PERSONAL_STORY: 'Personal Story', CONTRARIAN: 'Contrarian', PATTERN_INTERRUPT: 'Pattern Interrupt', RELATABLE_PAIN: 'Relatable Pain', STATISTIC: 'Statistic' };
  return map[s] || s;
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), delay); return () => clearTimeout(t); }, [score, delay]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-white/35 font-mono">{label}</span>
        <span className={`text-xs font-bold font-mono ${scoreColor(score)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${scoreBarColor(score)}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

// ─── Rewrite Card ─────────────────────────────────────────────────────────────
function RewriteCard({ rewrite, rank, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const copy = () => navigator.clipboard.writeText(rewrite.text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  return (
    <div className={`border border-white/10 bg-white/[0.025] rounded-2xl p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-white/30">REWRITE {rank}</span>
            <span className="text-xs font-mono text-white/25 border border-white/8 px-2 py-0.5 rounded-full">{styleLabel(rewrite.style)}</span>
          </div>
          <p className="text-white text-base font-semibold leading-snug">&ldquo;{rewrite.text}&rdquo;</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-4xl font-black font-mono leading-none ${scoreColor(rewrite.overallScore)}`}>{rewrite.overallScore}</div>
          <div className="text-white/25 text-xs mt-0.5">/100</div>
          <div className={`text-xs font-mono mt-1 ${scoreColor(rewrite.overallScore)}`}>{scoreLabel(rewrite.overallScore)}</div>
        </div>
      </div>
      <button onClick={copy} className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all active:scale-[0.98] ${copied ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-white/8 hover:bg-white/12 text-white/70 hover:text-white border border-white/10'}`}>
        {copied ? '✓ Copied!' : 'Copy hook'}
      </button>
      <div className="space-y-2.5 mb-4">
        <ScoreBar label="Curiosity Gap" score={rewrite.scores.curiosityGap} delay={60} />
        <ScoreBar label="Clarity" score={rewrite.scores.clarity} delay={100} />
        <ScoreBar label="Emotional Trigger" score={rewrite.scores.emotionalTrigger} delay={140} />
        <ScoreBar label="Platform Fit" score={rewrite.scores.platformFit} delay={180} />
        <ScoreBar label="Niche Relevance" score={rewrite.scores.nicheRelevance} delay={220} />
      </div>
      {rewrite.whatChanged && (
        <div className="bg-blue-500/[0.06] border border-blue-400/15 rounded-xl px-4 py-3">
          <p className="text-xs font-mono text-blue-400/70 mb-1 tracking-wide">WHAT CHANGED</p>
          <p className="text-white/65 text-sm leading-relaxed">{rewrite.whatChanged}</p>
        </div>
      )}
    </div>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [magicSent, setMagicSent] = useState(false);

  const handleGoogle = async () => {
    if (!supabase) return;
    setLoading(true); setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback?next=/polish` },
      });
      if (error) throw error;
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true); setError(null);
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/polish` } });
        if (error) throw error;
        setMagicSent(true);
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/polish` } });
        if (error) throw error;
        setMagicSent(true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) { onSuccess(data.session); onClose(); }
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        {magicSent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-xl font-bold mb-2">Check your email</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">We sent a link to <span className="text-white/80">{email}</span>. Click it to sign in and continue.</p>
            <button onClick={onClose} className="text-sm text-white/30 hover:text-white/60 transition-colors">Close</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-1">{mode === 'signup' ? 'Create your account' : 'Sign in to continue'}</h3>
              <p className="text-white/40 text-sm">Free account · 3 improvements/month</p>
            </div>
            <button onClick={handleGoogle} disabled={loading} className="w-full py-3 mb-4 flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/25">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-400/40" />
              {mode !== 'magic' && (
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-400/40" />
              )}
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
                {loading ? 'Loading…' : mode === 'magic' ? 'Send magic link' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>
            <div className="mt-4 space-y-2 text-center">
              {mode === 'signin' && (
                <>
                  <button onClick={() => { setMode('magic'); setError(null); }} className="block w-full text-xs text-white/30 hover:text-white/60 transition-colors">Sign in with magic link instead</button>
                  <button onClick={() => { setMode('signup'); setError(null); }} className="block w-full text-xs text-white/30 hover:text-white/60 transition-colors">No account? Sign up</button>
                </>
              )}
              {mode === 'signup' && <button onClick={() => { setMode('signin'); setError(null); }} className="block w-full text-xs text-white/30 hover:text-white/60 transition-colors">Already have an account? Sign in</button>}
              {mode === 'magic' && <button onClick={() => { setMode('signin'); setError(null); }} className="block w-full text-xs text-white/30 hover:text-white/60 transition-colors">Use password instead</button>}
            </div>
            <button onClick={onClose} className="mt-5 w-full text-center text-xs text-white/20 hover:text-white/40 transition-colors">Not now</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose }) {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleUpgrade = async () => {
    if (!session) { router.push('/login?redirect=/pricing'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ plan: 'creator' }) });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else router.push('/pricing');
    } catch { router.push('/pricing'); }
  };
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">&#128274;</div>
        <h3 className="text-2xl font-bold mb-2">Free limit reached</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-2">You&apos;ve used all {FREE_LIMIT} free improvements this month.</p>
        <p className="text-white/35 text-sm mb-8">Upgrade to Creator for <span className="text-green-400 font-semibold">unlimited rewrites</span> + generation.</p>
        <div className="space-y-3">
          <button onClick={handleUpgrade} disabled={loading} className="block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-colors disabled:opacity-60">
            {loading ? 'Redirecting…' : 'Upgrade to Creator — €5.99/month'}
          </button>
          <Link href="/pricing" className="block w-full py-3 border border-white/10 hover:border-white/25 text-white/50 hover:text-white rounded-2xl text-sm transition-all">See all plans →</Link>
        </div>
        <button onClick={onClose} className="mt-5 text-sm text-white/25 hover:text-white/50 transition-colors">Not now</button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Improve() {
  const { session, authLoading, authEnabled } = useAuth();
  const [platform, setPlatform] = useState('TikTok');
  const [niche, setNiche] = useState('Finance');
  const [hook, setHook] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [bestCopied, setBestCopied] = useState(false);
  const [serverUsage, setServerUsage] = useState(null);
  const pendingImproveRef = useRef(false);

  const fetchServerUsage = async (currentSession) => {
    const s = currentSession || session;
    if (!authEnabled || !s) return;
    try {
      const res = await fetch('/api/usage?feature=improve', { headers: { Authorization: `Bearer ${s.access_token}` } });
      if (res.ok) { const data = await res.json(); setServerUsage(data); }
    } catch {}
  };

  useEffect(() => { if (!authLoading && session) fetchServerUsage(session); }, [authLoading, session]);

  const remaining = authEnabled ? (serverUsage ? serverUsage.remaining : FREE_LIMIT) : FREE_LIMIT;

  const improve = async () => {
    if (!hook || hook.trim().length < 5) { setError('Paste your hook (at least 5 characters).'); return; }
    if (authEnabled && !session) { pendingImproveRef.current = true; setShowAuth(true); return; }
    if (authEnabled && serverUsage && serverUsage.remaining <= 0) { setShowUpgrade(true); return; }
    setLoading(true); setError(null); setResults(null); setBestCopied(false);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (session) headers['Authorization'] = `Bearer ${session.access_token}`;
      const res = await fetch('/api/improve', { method: 'POST', headers, body: JSON.stringify({ hook: hook.trim(), platform, niche }) });
      if (res.status === 401) { pendingImproveRef.current = true; setShowAuth(true); return; }
      if (res.status === 402) { setShowUpgrade(true); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResults(data);
      fetchServerUsage(session);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleAuthSuccess = async (newSession) => {
    await fetchServerUsage(newSession);
    if (pendingImproveRef.current) { pendingImproveRef.current = false; setTimeout(() => improve(), 300); }
  };

  const handleSignOut = async () => { if (supabase) await supabase.auth.signOut(); };

  const bestRewrite = results?.rewrites?.reduce(
    (best, r) => r.overallScore > (best?.overallScore ?? 0) ? r : best, null
  );

  return (
    <>
      <Head>
        <title>Polish my hooks | HookLab</title>
        <meta name="description" content="Take your rough hook ideas and make them punch. AI-powered hook polishing for creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link href="/generate" className="hidden sm:block px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Generate</Link>
            <Link href="/polish" className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-white/[0.08]">Polish</Link>
            <Link href="/blueprints" className="hidden sm:block px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
            <div className="w-px h-4 bg-white/10 mx-1.5 hidden sm:block" />
            {authEnabled && (
              session ? (
                <button onClick={handleSignOut} className="hidden sm:block px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors">Sign out</button>
              ) : (
                <button onClick={() => setShowAuth(true)} className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30">Sign in</button>
              )
            )}
            {remaining === 0 ? (
              <button onClick={() => setShowUpgrade(true)} className="text-xs font-semibold text-green-400 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-400/10 transition-colors ml-1">Upgrade →</button>
            ) : (
              <span className="hidden sm:inline text-xs font-mono ml-1 text-white/30">{remaining} free uses left</span>
            )}
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Rewrite &amp; Improve</h1>
            <p className="text-white/40 text-sm">Paste your draft hook. Get your score, your main weakness, and 3 stronger rewrites — each targeting a different psychological angle.</p>
          </div>

          <div className="mb-7">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${platform === p ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">NICHE</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${niche === n ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">YOUR DRAFT HOOK</p>
            <textarea
              value={hook}
              onChange={e => { setHook(e.target.value); setError(null); }}
              placeholder={'Paste your hook draft here...\n\nE.g. "I saved money this year by changing my habits"'}
              rows={4}
              maxLength={500}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 focus:bg-white/[0.06] transition-all leading-relaxed"
            />
            {hook.length > 0 && <span className={`text-xs font-mono mt-1 block text-right ${hook.length > 400 ? 'text-yellow-400' : 'text-white/20'}`}>{hook.length}/500</span>}
          </div>

          {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

          <button
            onClick={improve}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : remaining === 0 ? 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                Rewriting your hook...
              </span>
            ) : remaining === 0 ? '🔒 Upgrade to improve more' : '✍ Improve My Hook'}
          </button>
          {!session && <p className="text-center text-xs text-white/20 mt-3">{FREE_LIMIT} free rewrites per month · <button onClick={() => setShowAuth(true)} className="underline hover:text-white/40 transition-colors">Sign in</button> to track usage</p>}

          {results && !loading && (
            <div className="mt-14 space-y-6">
              <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-5">
                <p className="text-xs font-mono text-white/30 tracking-widest mb-4">YOUR ORIGINAL</p>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="text-white/70 text-base font-medium leading-snug flex-1">&ldquo;{results.original.text}&rdquo;</p>
                  <div className="text-right shrink-0">
                    <div className={`text-4xl font-black font-mono leading-none ${scoreColor(results.original.overallScore)}`}>{results.original.overallScore}</div>
                    <div className="text-white/25 text-xs mt-0.5">/100</div>
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  <ScoreBar label="Curiosity Gap" score={results.original.scores.curiosityGap} delay={0} />
                  <ScoreBar label="Clarity" score={results.original.scores.clarity} delay={40} />
                  <ScoreBar label="Emotional Trigger" score={results.original.scores.emotionalTrigger} delay={80} />
                  <ScoreBar label="Platform Fit" score={results.original.scores.platformFit} delay={120} />
                  <ScoreBar label="Niche Relevance" score={results.original.scores.nicheRelevance} delay={160} />
                </div>
                {results.original.mainIssue && (
                  <div className="bg-red-500/[0.06] border border-red-400/15 rounded-xl px-4 py-3">
                    <p className="text-xs font-mono text-red-400/70 mb-1 tracking-wide">MAIN ISSUE</p>
                    <p className="text-white/65 text-sm leading-relaxed">{results.original.mainIssue}</p>
                  </div>
                )}
              </div>

              {bestRewrite && (
                <div className="border border-green-400/30 bg-gradient-to-b from-green-400/10 to-green-400/[0.04] rounded-2xl p-6 text-center">
                  <p className="text-xs font-mono text-green-400 tracking-widest mb-3">BEST REWRITE</p>
                  <p className="text-white font-bold text-xl mb-2 leading-snug">&ldquo;{bestRewrite.text}&rdquo;</p>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className={`text-5xl font-black font-mono ${scoreColor(bestRewrite.overallScore)}`}>{bestRewrite.overallScore}</span>
                    <span className="text-white/25 text-lg">/100</span>
                    {results.original.overallScore < bestRewrite.overallScore && (
                      <span className="ml-2 text-green-400 text-sm font-bold">+{bestRewrite.overallScore - results.original.overallScore} pts</span>
                    )}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(bestRewrite.text).then(() => { setBestCopied(true); setTimeout(() => setBestCopied(false), 2000); })}
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${bestCopied ? 'bg-green-400/20 text-green-400 border border-green-400/40' : 'bg-green-400 hover:bg-green-300 text-black'}`}
                  >
                    {bestCopied ? '✓ Copied!' : 'Copy best rewrite'}
                  </button>
                </div>
              )}

              <div>
                <p className="text-xs font-mono text-white/25 tracking-widest mb-4">ALL 3 REWRITES</p>
                <div className="space-y-4">
                  {results.rewrites.map((r, i) => <RewriteCard key={i} rewrite={r} rank={i + 1} delay={i * 100} />)}
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white/40 text-sm mb-3">Want to generate hooks from scratch?</p>
                <Link href="/generate" className="inline-block px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-all">Try the Generator →</Link>
              </div>
            </div>
          )}
        </main>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); pendingImproveRef.current = false; }} onSuccess={handleAuthSuccess} />}
    </>
  );
}
