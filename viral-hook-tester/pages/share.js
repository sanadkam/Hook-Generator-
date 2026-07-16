import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function scoreColor(s) { return s >= 75 ? 'text-green-400' : s >= 55 ? 'text-yellow-400' : 'text-red-400'; }
function scoreBarColor(s) { return s >= 75 ? 'bg-green-400' : s >= 55 ? 'bg-yellow-400' : 'bg-red-400'; }
function scoreLabel(s) { return s >= 88 ? 'Exceptional' : s >= 75 ? 'Strong' : s >= 60 ? 'Decent' : s >= 45 ? 'Weak' : 'Skip it'; }

function ScoreBar({ label, score }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 300); return () => clearTimeout(t); }, [score]);
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

export default function SharePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hookCopied, setHookCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    try {
      const { d } = router.query;
      if (!d) { setError(true); return; }
      const decoded = JSON.parse(atob(d));
      if (!decoded.hook || !decoded.score) { setError(true); return; }
      setData(decoded);
    } catch {
      setError(true);
    }
  }, [router.isReady, router.query]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyHook = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.hook).then(() => {
      setHookCopied(true);
      setTimeout(() => setHookCopied(false), 2000);
    });
  };

  const tweetText = data
    ? `My hook scored ${data.score}/100 on HookLab ⚡\n\n"${data.hook}"\n\nTest yours free →`
    : '';

  return (
    <>
      <Head>
        <title>{data ? `${data.score}/100 Hook Score — HookLab` : 'Shared Hook — HookLab'}</title>
        <meta name="description" content={data ? `"${data.hook.slice(0, 120)}..." — Scored ${data.score}/100 on HookLab's viral hook generator.` : 'Check out this hook score on HookLab.'} />
        <meta property="og:title" content={data ? `${data.score}/100 Hook Score — HookLab` : 'Hook Score — HookLab'} />
        <meta property="og:description" content={data ? `"${data.hook.slice(0, 120)}"` : 'See this hook score on HookLab.'} />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
        </nav>

        <main className="max-w-xl mx-auto px-4 py-14">

          {error ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔗</div>
              <h1 className="text-2xl font-bold mb-3">Link expired or invalid</h1>
              <p className="text-white/40 mb-8">This share link couldn't be decoded. Generate your own hooks below.</p>
              <Link href="/generate" className="inline-block px-8 py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl transition-colors">⚡ Generate hooks free</Link>
            </div>
          ) : !data ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-6">
                  &#9889; HookLab Score
                </div>
                {data.platform && (
                  <p className="text-white/35 text-sm mb-3 font-mono">{tata.platform}{data.niche ? ` · ${data.niche}` : ''}</p>
                )}
                <h1 className="text-2xl font-black mb-2">Hook Score Card</h1>
                <p className="text-white/40 text-sm">Scored by HookLab AI</p>
              </div>

              {/* Main card */}
              <div className="border border-green-400/30 bg-gradient-to-b from-green-400/10 to-green-400/[0.03] rounded-3xl p-7 mb-6">
                {/* Score */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className={`text-7xl font-black font-mono ${scoreColor(data.score)}`}>{data.score}</span>
                    <span className="text-white/25 text-2xl">/100</span>
                  </div>
                  <span className={`text-sm font-bold font-mono ${scoreColor(data.score)}`}>{scoreLabel(data.score)}</span>
                </div>

                {/* Hook text */}
                <div className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 mb-6">
                  <p className="text-xs font-mono text-white/30 mb-2">HOOK</p>
                  <p className="text-white font-semibold text-base leading-snug">"{data.hook}"</p>
                </div>

                {/* Score bars */}
                {data.scores && (
                  <div className="space-y-2.5 mb-5">
                    {Object.entries(data.scores).map(([key, val]) => {
                      const labels = { curiosityGap: 'Curiosity Gap', clarity: 'Clarity', emotionalTrigger: 'Emotional Trigger', platformFit: 'Platform Fit', nicheRelevance: 'Niche Relevance' };
                      return <ScoreBar key={key} label={labels[key] || key} score={val} />;
                    })}
                  </div>
                )}

                {/* Copy hook button */}
                <button
                  onClick={copyHook}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${hookCopied ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-green-400 hover:bg-green-300 text-black'}`}
                >
                  {hookCopied ? '✓ Hook copied!' : 'Copy this hook'}
                </button>
              </div>

              {/* Why it works */}
              {data.whyItWorks && (
                <div className="bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-4 mb-6">
                  <p className="text-xs font-mono text-white/30 mb-2">WHY IT WORKS</p>
                  <p className="text-white/65 text-sm leading-relaxed">{data.whyItWorks}</p>
                </div>
              )}

              {/* Share actions */}
              <div className="space-y-3 mb-10">
                <button onClick={copyLink} className={`w-full py-3 rounded-xl text-sm font-semibold border transition-all ${copied ? 'bg-white/10 border-white/30 text-white' : 'bg-white/[0.05] border-white/10 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white'}`}>
                  {copied ? '✓ Link copied!' : '🔗 Copy share link'}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Share on X (Twitter)
                </a>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-b from-green-400/10 to-transparent border border-green-400/20 rounded-2xl p-7 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h2 className="text-xl font-black mb-2">Score your own hooks</h2>
                <p className="text-white/40 text-sm mb-6 leading-relaxed">3 free generations per month. No signup needed. Get your hooks scored across Curiosity Gap, Clarity, Emotional Trigger and more.</p>
                <Link href="/generate" className="inline-block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-all active:scale-[0.98]">
                  ⚡ Generate my hooks — it&rsquo;s free
                </Link>
                <p className="text-white/25 text-xs mt-3">No credit card · 30 seconds to first result</p>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
