import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// âââ Constants ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];
const NICHES = ['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy'];
const FREE_LIMIT = 3;
const STORAGE_KEY = 'hookscore_polish_v1';

function getUsage() {
  if (typeof window === 'undefined') return 0;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const month = new Date().toISOString().slice(0, 7);
    if (data.month !== month) return 0;
    return data.count || 0;
  } catch { return 0; }
}

function incrementUsage() {
  if (typeof window === 'undefined') return 0;
  try {
    const month = new Date().toISOString().slice(0, 7);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const count = (data.month === month ? data.count || 0 : 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ month, count }));
    return count;
  } catch { return 0; }
}

// âââ Utilities ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function scoreColor(s) { return s >= 75 ? 'text-green-400' : s >= 55 ? 'text-yellow-400' : 'text-red-400'; }
function scoreBarColor(s) { return s >= 75 ? 'bg-green-400' : s >= 55 ? 'bg-yellow-400' : 'bg-red-400'; }
function scoreLabel(s) { return s >= 88 ? 'Exceptional' : s >= 75 ? 'Strong' : s >= 60 ? 'Decent' : s >= 45 ? 'Weak' : 'Skip it'; }
function styleLabel(s) {
  const map = { CURIOSITY_GAP: 'Curiosity Gap', BOLD_CLAIM: 'Bold Claim', PERSONAL_STORY: 'Personal Story', CONTRARIAN: 'Contrarian', PATTERN_INTERRUPT: 'Pattern Interrupt', RELATABLE_PAIN: 'Relatable Pain', STATISTIC: 'Statistic' };
  return map[s] || s;
}

// âââ Score Bar ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function ScoreBar({ label, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);
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

// âââ Rewrite Card âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function RewriteCard({ rewrite, rank, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
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
        {copied ? '&#10003; Copied!' : 'Copy hook'}
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

// âââ Upgrade Modal ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function UpgradeModal({ onClose }) {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">&#128274;</div>
        <h3 className="text-2xl font-bold mb-2">Free limit reached</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-2">You&apos;ve used all {FREE_LIMIT} free improvements this month.</p>
        <p className="text-white/35 text-sm mb-8">Upgrade to Pro for <span className="text-green-400 font-semibold">unlimited rewrites</span> + generation.</p>
        <div className="space-y-3">
          {stripeLink && (
            <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-colors">
              Upgrade to Pro &mdash; $19/month
            </a>
          )}
          <Link href="/pricing" className="block w-full py-3 border border-white/10 hover:border-white/25 text-white/50 hover:text-white rounded-2xl text-sm transition-all">
            See what&apos;s included &rarr;
          </Link>
        </div>
        <button onClick={onClose} className="mt-5 text-sm text-white/25 hover:text-white/50 transition-colors">Not now</button>
      </div>
    </div>
  );
}

// âââ Main Page ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function Improve() {
  const [platform, setPlatform] = useState('TikTok');
  const [niche, setNiche] = useState('Finance');
  const [hook, setHook] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [bestCopied, setBestCopied] = useState(false);

  useEffect(() => { setUsageCount(getUsage()); }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  const improve = async () => {
    if (!hook || hook.trim().length < 5) { setError('Paste your hook (at least 5 characters).'); return; }
    if (usageCount >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setLoading(true); setError(null); setResults(null); setBestCopied(false);
    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hook: hook.trim(), platform, niche })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResults(data);
      const newCount = incrementUsage();
      setUsageCount(newCount);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bestRewrite = results?.rewrites?.reduce((best, r) => r.overallScore > (best?.overallScore ?? 0) ? r : best, null);

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
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
            <span className="hidden sm:inline text-xs font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded">IMPROVE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/generate" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Generate</Link>
            <Link href="/polish" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Analyze</Link>
            <Link href="/blueprints" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            {remaining === 0 ? (
              <button onClick={() => setShowUpgrade(true)} className="text-xs font-mono text-green-400 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-400/10 transition-colors">Upgrade &rarr;</button>
            ) : (
              <span className="hidden sm:inline text-xs font-mono text-white/30">{remaining} free left</span>
            )}
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Rewrite &amp; Improve</h1>
            <p className="text-white/40 text-sm">Paste your draft hook. Get your score, your main weakness, and 3 stronger rewrites &mdash; each targeting a different psychological angle.</p>
          </div>

          {/* Platform */}
          <div className="mb-7">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${platform === p ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">NICHE</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${niche === n ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{n}</button>
              ))}
            </div>
          </div>

          {/* Hook input */}
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

          {/* Error */}
          {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

          {/* Button */}
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
            ) : remaining === 0 ? '&#128274; Upgrade to improve more' : '&#9997; Improve My Hook'}
          </button>
          {usageCount === 0 && <p className="text-center text-xs text-white/20 mt-3">{FREE_LIMIT} free rewrites per month &middot; No signup needed</p>}

          {/* Results */}
          {results && !loading && (
            <div className="mt-14 space-y-6">
              {/* Original score */}
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

              {/* Best rewrite banner */}
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
                    {bestCopied ? '&#10003; Copied!' : 'Copy best rewrite'}
                  </button>
                </div>
              )}

              {/* All 3 rewrites */}
              <div>
                <p className="text-xs font-mono text-white/25 tracking-widest mb-4">ALL 3 REWRITES</p>
                <div className="space-y-4">
                  {results.rewrites.map((r, i) => <RewriteCard key={i} rewrite={r} rank={i + 1} delay={i * 100} />)}
                </div>
              </div>

              {/* CTA */}
              <div className="border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white/40 text-sm mb-3">Want to generate hooks from scratch?</p>
                <Link href="/generate" className="inline-block px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-all">Try the Generator &rarr;</Link>
              </div>
            </div>
          )}
        </main>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
