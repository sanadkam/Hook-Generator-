import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 2200, triggered = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);
  return count;
}

// ─── Intersection observer helper ────────────────────────────────────────────
function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Marcus T.", role: "Finance Creator · 180K TikTok", text: "Went from 2% to 8% hook retention in two weeks. The scoring system actually teaches you what makes a hook land.", av: "MT" },
  { name: "Priya R.", role: "LinkedIn Thought Leader · 50K", text: "My LinkedIn posts used to get 200 views. After a month of HookLab, I'm averaging 4,000+. The platform-specific hooks are scary accurate.", av: "PR" },
  { name: "Jake M.", role: "Fitness Creator · 340K YouTube", text: "I won't post a video until my hook hits at least 80/100. The scoring became my quality gate.", av: "JM" },
  { name: "Sofia L.", role: "Lifestyle · 95K Instagram", text: "Finally an AI that understands short-form. Tried 4 other tools — nothing came close to the quality of hooks HookLab outputs.", av: "SL" },
  { name: "Alex K.", role: "Business Coach · 12K newsletter", text: "I use the Polish tool on every email subject line and LinkedIn opener. Open rates are up 40% since I started.", av: "AK" },
  { name: "Nadia C.", role: "Content Agency Owner", text: "We run 8 client accounts through HookLab. The Agency plan pays for itself 20x over in saved time and better results.", av: "NC" },
];

export default function Home() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef);
  const hooksCount = useCountUp(51284, 2200, statsInView);
  const creatorsCount = useCountUp(3200, 1800, statsInView);
  const avgScore = useCountUp(79, 1400, statsInView);

  return (
    <>
      <Head>
        <title>HookLab — AI Hook Generator for Creators</title>
        <meta name="description" content="Generate scroll-stopping hooks for TikTok, YouTube, Instagram, LinkedIn & more. AI-scored, platform-optimised. Free to start — no signup needed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hook-generator-tau.vercel.app" />
        <meta property="og:title" content="HookLab — AI Hook Generator for Creators" />
        <meta property="og:description" content="Generate scroll-stopping hooks for TikTok, YouTube, Instagram & LinkedIn. AI-scored with Curiosity Gap, Clarity, and Emotional Trigger ratings." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HookLab — AI Hook Generator for Creators" />
        <meta name="twitter:description" content="Generate scroll-stopping hooks for TikTok, YouTube, Instagram & LinkedIn. Free to start." />
        <meta name="twitter:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* ── Nav ── */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight">HookLab</span>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/generate" className="text-sm text-white/40 hover:text-white transition-colors">Generate</Link>
            <Link href="/polish" className="text-sm text-white/40 hover:text-white transition-colors">Polish</Link>
            <Link href="/blueprints" className="text-sm text-white/40 hover:text-white transition-colors">Blueprints</Link>
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
          <div className="flex sm:hidden items-center gap-3">
            <Link href="/pricing" className="text-sm text-white/50">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>

        <main>

          {/* ── Hero ── */}
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; 3 free uses &middot; No signup needed &middot; Results in seconds
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Hooks that make<br /><span className="text-green-400">people stop scrolling</span>
            </h1>
            <p className="text-white/40 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              AI tools built for creators. Generate hooks from scratch, polish your drafts, and study what makes them work — across every major platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link href="/generate" className="w-full sm:w-auto px-8 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">&#9889; Generate hooks &rarr;</Link>
              <Link href="/blueprints" className="w-full sm:w-auto px-8 py-4 bg-white/[0.06] hover:bg-white/10 text-white font-semibold rounded-2xl text-base transition-all border border-white/10">Browse blueprints</Link>
            </div>
            {/* Social proof pill */}
            <div className="flex items-center justify-center gap-2 text-sm text-white/30">
              <div className="flex -space-x-2">
                {['MT','PR','JM','SL','AK'].map((av, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/40 to-green-600/40 border border-black flex items-center justify-center text-[9px] font-bold text-green-400">{av}</div>
                ))}
              </div>
              <span>Trusted by <span className="text-white/60 font-semibold">3,200+</span> creators</span>
            </div>
          </section>

          {/* ── Stats bar ── */}
          <section ref={statsRef} className="border-y border-white/[0.06] bg-white/[0.015]">
            <div className="max-w-4xl mx-auto px-5 py-10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-black font-mono text-green-400">{statsInView ? hooksCount.toLocaleString() : '0'}</p>
                <p className="text-white/35 text-xs sm:text-sm mt-1">hooks generated</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black font-mono text-white">{statsInView ? creatorsCount.toLocaleString() : '0'}+</p>
                <p className="text-white/35 text-xs sm:text-sm mt-1">active creators</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black font-mono text-yellow-400">{statsInView ? avgScore : '0'}<span className="text-2xl text-white/30">/100</span></p>
                <p className="text-white/35 text-xs sm:text-sm mt-1">avg hook score</p>
              </div>
            </div>
          </section>

          {/* ── Tools ── */}
          <section className="max-w-5xl mx-auto px-5 py-20">
            <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">THREE TOOLS, ONE MISSION</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/generate" className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/30 rounded-2xl p-7 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mb-5 text-xl">&#9889;</div>
                <h2 className="text-lg font-bold mb-2">Generate</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Pick your platform, drop in your topic, and get 3 AI-scored hooks in seconds. TikTok, Instagram, YouTube, LinkedIn and more.</p>
                <span className="text-green-400 text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">Generate hooks &rarr;</span>
              </Link>
              <Link href="/polish" className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/30 rounded-2xl p-7 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mb-5 text-xl">&#9997;</div>
                <h2 className="text-lg font-bold mb-2">Polish</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Already have a rough idea? Paste it in and get a sharper, punchier version back. No more second-guessing your opening line.</p>
                <span className="text-green-400 text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">Polish a hook &rarr;</span>
              </Link>
              <Link href="/blueprints" className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/30 rounded-2xl p-7 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mb-5 text-xl">&#128196;</div>
                <h2 className="text-lg font-bold mb-2">Blueprints</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Study skeleton frameworks of hooks that actually went viral. Understand the structure, then apply it to your own content.</p>
                <span className="text-green-400 text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">Browse blueprints &rarr;</span>
              </Link>
            </div>
          </section>

          {/* ── Platforms ── */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-14 text-center">
              <p className="text-xs font-mono tracking-widest text-white/25 mb-6">BUILT FOR EVERY PLATFORM</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: 'TikTok', href: '/tiktok-hook-generator' },
                  { label: 'YouTube', href: '/youtube-hook-generator' },
                  { label: 'Instagram', href: '/instagram-hook-generator' },
                  { label: 'LinkedIn', href: '/linkedin-hook-generator' },
                  { label: 'Twitter / X', href: '/generate' },
                  { label: 'Facebook', href: '/generate' },
                ].map(p => (
                  <Link key={p.label} href={p.href} className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-green-400/25 rounded-full text-sm text-white/50 hover:text-white transition-all">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">HOW IT WORKS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">01</div>
                  <h3 className="font-bold mb-2">Pick your platform</h3>
                  <p className="text-white/35 text-sm leading-relaxed">TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Twitter/X, or Facebook. Each platform gets custom-tuned hooks.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">02</div>
                  <h3 className="font-bold mb-2">Describe your content</h3>
                  <p className="text-white/35 text-sm leading-relaxed">Tell us your topic, paste a draft, or upload a screenshot. The AI extracts the core idea and finds the best angle.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">03</div>
                  <h3 className="font-bold mb-2">Get scored hooks</h3>
                  <p className="text-white/35 text-sm leading-relaxed">Each hook is rated across Curiosity Gap, Clarity, Emotional Trigger, Platform Fit, and Niche Relevance — so you know exactly why it works.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Score preview ── */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-3xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">THE HOOKSCORE SYSTEM</p>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">Don&rsquo;t guess. Know.</h2>
                <p className="text-white/40 text-base max-w-xl mx-auto">Every hook gets a score from 0–100 across 5 dimensions. Stop posting weak openers and start knowing which hooks will actually retain viewers.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-mono text-white/30 mb-2">CURIOSITY GAP · EXAMPLE HOOK</p>
                    <p className="text-white font-semibold text-lg leading-snug">"I tried intermittent fasting for 90 days. Here's what nobody tells you."</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-5xl font-black font-mono text-green-400 leading-none">87</div>
                    <div className="text-white/25 text-xs mt-0.5">/100</div>
                    <div className="text-green-400 text-xs font-mono mt-1">Strong</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Curiosity Gap', score: 92 },
                    { label: 'Clarity', score: 85 },
                    { label: 'Emotional Trigger', score: 88 },
                    { label: 'Platform Fit', score: 81 },
                    { label: 'Niche Relevance', score: 89 },
                  ].map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/35 font-mono">{label}</span>
                        <span className="text-xs font-bold font-mono text-green-400">{score}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Polish before/after ── */}
          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">HOOK POLISH</p>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">Rough hook? Fix it in seconds.</h2>
                <p className="text-white/40 text-base max-w-xl mx-auto">Paste in a draft and get 3 sharper, punchier rewrites — each targeting a different psychological angle.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  { before: "I tried this diet for 30 days", after: "I ate nothing but rice for 30 days. Here's what happened to my body." },
                  { before: "How to make money online in 2024", after: "I make €4K/month from 3 side projects. Here's the boring one nobody talks about." },
                  { before: "Tips for growing on LinkedIn", after: "I gained 10K LinkedIn followers in 60 days doing the opposite of what every guru says." },
                ].map((ex, i) => (
                  <div key={i}>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-2">
                      <p className="text-xs font-mono text-white/25 tracking-widest mb-2">BEFORE</p>
                      <p className="text-white/50 text-sm italic">&ldquo;{ex.before}&rdquo;</p>
                    </div>
                    <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-5">
                      <p className="text-xs font-mono text-green-400/60 tracking-widest mb-2">AFTER</p>
                      <p className="text-white text-sm font-medium">&ldquo;{ex.after}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/polish" className="inline-block px-8 py-3.5 bg-white/[0.06] hover:bg-white/10 text-white font-semibold rounded-2xl text-sm transition-all border border-white/10">&#9997; Polish a hook &rarr;</Link>
              </div>
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-5xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">WHAT CREATORS ARE SAYING</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                    <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400/30 to-green-600/20 border border-green-400/20 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">{t.av}</div>
                      <div>
                        <p className="text-white text-sm font-semibold">{t.name}</p>
                        <p className="text-white/35 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <section className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to stop guessing?</h2>
            <p className="text-white/40 mb-8 text-base">3 free generations per month. No account, no card. Start in 30 seconds.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/generate" className="w-full sm:w-auto inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">&#9889; Start generating free</Link>
              <Link href="/pricing" className="w-full sm:w-auto inline-block px-8 py-4 bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold rounded-2xl text-base transition-all">See pricing</Link>
            </div>
          </section>

        </main>

        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 mb-4 text-sm text-white/25">
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/polish" className="hover:text-white/50 transition-colors">Polish</Link>
            <Link href="/blueprints" className="hover:text-white/50 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/tiktok-hook-generator" className="hover:text-white/50 transition-colors">TikTok Hooks</Link>
            <Link href="/youtube-hook-generator" className="hover:text-white/50 transition-colors">YouTube Hooks</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookLab</p>
        </footer>

      </div>
    </>
  );
}
