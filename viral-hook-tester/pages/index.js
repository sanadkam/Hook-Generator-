import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_EXAMPLES = [
  {
    platform: 'TikTok', niche: 'Finance',
    hooks: [
      { style: 'Curiosity Gap',  text: 'I saved $20k last year doing one thing my bank never told me about', score: 94 },
      { style: 'Personal Story', text: "I was broke at 23. Here's the exact system I used to save $20k by 25", score: 91 },
      { style: 'Bold Claim',     text: 'Stop budgeting. Do this instead — I saved $20k without thinking about money', score: 88 },
    ],
  },
  {
    platform: 'YouTube', niche: 'Fitness',
    hooks: [
      { style: 'Personal Story', text: "I trained 3 days a week for 90 days. Here's exactly what changed", score: 93 },
      { style: 'Bold Claim',     text: "You don't need 6 days in the gym. My 90-day proof", score: 89 },
      { style: 'Curiosity Gap',  text: "The 3-day training split fitness influencers don't post about", score: 87 },
    ],
  },
  {
    platform: 'LinkedIn', niche: 'Business',
    hooks: [
      { style: 'Personal Story', text: "I got promoted twice in 18 months without asking once. Here's what I did", score: 95 },
      { style: 'Curiosity Gap',  text: "The promotion strategy no one talks about — and why it works", score: 90 },
      { style: 'Bold Claim',     text: 'Stop asking for promotions. Do this instead', score: 87 },
    ],
  },
];

function scoreColor(s) {
  if (s >= 75) return 'text-green-400';
  if (s >= 55) return 'text-yellow-400';
  return 'text-red-400';
}
function scoreBarColor(s) {
  if (s >= 75) return 'bg-green-400';
  if (s >= 55) return 'bg-yellow-400';
  return 'bg-red-400';
}
function scoreLabel(s) {
  if (s >= 88) return 'Exceptional';
  if (s >= 75) return 'Strong';
  if (s >= 60) return 'Decent';
  return 'Weak';
}

// ─── Animated Demo Widget ─────────────────────────────────────────────────────
function DemoWidget() {
  const [exIdx,   setExIdx]   = useState(0);
  const [hookIdx, setHookIdx] = useState(0);
  const [typed,   setTyped]   = useState('');
  const [phase,   setPhase]   = useState('typing');

  const ex   = DEMO_EXAMPLES[exIdx];
  const hook = ex.hooks[hookIdx];

  useEffect(() => {
    setTyped(''); setPhase('typing');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(hook.text.slice(0, i));
      if (i >= hook.text.length) { clearInterval(interval); setPhase('show'); }
    }, 26);
    return () => clearInterval(interval);
  }, [hook.text]);

  useEffect(() => {
    if (phase !== 'show') return;
    const t = setTimeout(() => {
      const nextHook = (hookIdx + 1) % ex.hooks.length;
      if (nextHook === 0) setExIdx((exIdx + 1) % DEMO_EXAMPLES.length);
      setHookIdx(nextHook);
    }, 2600);
    return () => clearTimeout(t);
  }, [phase, hookIdx, exIdx, ex.hooks.length]);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-left w-full max-w-lg mx-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/40">{ex.platform}</span>
          <span className="text-white/15">·</span>
          <span className="text-xs font-mono text-white/40">{ex.niche}</span>
        </div>
        <div className="flex gap-1">
          {ex.hooks.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === hookIdx ? 'w-6 bg-green-400' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
      </div>
      <p className="text-xs font-mono text-white/25 mb-2">{hook.style.toUpperCase()}</p>
      <p className="text-white font-semibold text-sm leading-snug min-h-[3.5rem] mb-4">
        "{typed}
        <span className={`inline-block w-0.5 h-4 bg-green-400 ml-0.5 align-middle ${phase === 'typing' ? 'animate-pulse' : 'opacity-0'}`} />"
      </p>
      <div className={`flex items-baseline gap-2 mb-2 transition-opacity duration-500 ${phase === 'show' ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`text-2xl font-black font-mono ${scoreColor(hook.score)}`}>{hook.score}</span>
        <span className="text-white/30 text-sm">/100</span>
        <span className={`text-xs font-mono ${scoreColor(hook.score)}`}>{scoreLabel(hook.score)}</span>
      </div>
      <div className={`h-1.5 bg-white/10 rounded-full overflow-hidden transition-opacity duration-500 ${phase === 'show' ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(hook.score)}`} style={{ width: phase === 'show' ? `${hook.score}%` : '0%' }} />
      </div>
      <p className="text-white/20 text-xs mt-3 font-mono">LIVE PREVIEW · AI-GENERATED EXAMPLES</p>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  { icon: '🎯', title: 'Pick platform & niche', desc: 'TikTok, YouTube, Instagram, LinkedIn or Twitter — each gets a tailored hook style.' },
  { icon: '📝', title: 'Paste your content', desc: 'Drop in a caption draft, video idea, or script. Even a few sentences works.' },
  { icon: '⚡', title: 'Get 3 scored hooks', desc: 'AI generates 3 hooks in different styles, each scored across 5 psychological dimensions.' },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Head>
        <title>HookScore — Turn Any Content Into a Viral Hook</title>
        <meta name="description" content="Paste your content and get 3 AI-generated, platform-optimised viral hooks in seconds. Free to try." />
        <meta property="og:title" content="HookScore — AI Viral Hook Generator" />
        <meta property="og:description" content="Paste your content. Get 3 AI-scored viral hooks. Pick the winner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight">HookScore</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">
              Try free →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-green-400 border border-green-400/20 bg-green-400/5 px-3 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            AI Hook Generator · 3 free tries · No signup
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Turn Any Content<br />
            <span className="text-green-400">Into a Viral Hook</span>
          </h1>

          <p className="text-white/50 text-base sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
            Paste your post, script, or idea — get 3 platform-optimised, AI-scored hooks in seconds. Stop guessing what stops the scroll.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/generate"
              className="w-full sm:w-auto px-8 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]"
            >
              ⚡ Generate my hooks free
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 border border-white/15 hover:border-white/30 text-white/60 hover:text-white rounded-2xl text-base transition-all text-center"
            >
              See pricing →
            </Link>
          </div>

          {/* Demo */}
          <DemoWidget />
          <p className="text-white/20 text-xs mt-4 font-mono tracking-wider">EXAMPLES · REAL OUTPUT FROM THE GENERATOR</p>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">HOW IT WORKS</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-mono text-white/25 mb-1">STEP {i + 1}</div>
                <p className="text-white font-semibold text-sm mb-1.5">{step.title}</p>
                <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center border border-white/8 rounded-2xl p-10 bg-white/[0.02]">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to stop guessing?</h2>
            <p className="text-white/40 text-sm mb-7 max-w-sm mx-auto">3 free generations. No signup, no credit card. Takes 10 seconds.</p>
            <Link
              href="/generate"
              className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]"
            >
              ⚡ Try it free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} HookScore ·{' '}
            <Link href="/pricing" className="hover:text-white/40 transition-colors">Pricing</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
