import Head from 'next/head';
import Link from 'next/link';

const EXAMPLES = [
  { before: "My morning routine", after: "I wake up at 4:30am every day. Here's the one thing I do first that changed everything." },
  { before: "How I lost weight", after: "I lost 12kg in 90 days without a gym. Here's what fitness influencers won't tell you." },
  { before: "Money saving tips", after: "I saved €20,000 in one year on a €35,000 salary. The trick nobody talks about." },
  { before: "Cooking hack video", after: "This one pan change cut my cooking time in half. I can't believe I didn't know this sooner." },
];

const FAQS = [
  { q: "What makes a TikTok hook different?", a: "TikTok hooks must work within the first 1–3 seconds and create an immediate pattern interrupt. Unlike long-form content, you have almost no time — your opener must be visually or verbally jarring enough to stop the scroll reflex." },
  { q: "How long should a TikTok hook be?", a: "The hook line itself should be 10–15 words maximum. Anything longer loses attention before the video even starts. The first spoken word should arrive within 0–0.5 seconds of the video starting." },
  { q: "What hook styles work best on TikTok?", a: "Curiosity gaps ('Here's what nobody tells you'), bold claims ('I tried X for 30 days'), relatable pain ('If you've ever felt like...'), and pattern interrupts that start mid-action or mid-sentence all perform consistently well." },
  { q: "Is HookLab's TikTok hook generator free?", a: "Yes. You get 3 free hook generations per month with no signup required. Each generation gives you 3 hook variations scored across Curiosity Gap, Clarity, Emotional Trigger, Platform Fit, and Niche Relevance." },
];

export default function TikTokHookGenerator() {
  return (
    <>
      <Head>
        <title>TikTok Hook Generator — Free AI Tool | HookLab</title>
        <meta name="description" content="Generate scroll-stopping TikTok hooks in seconds with AI. Get 3 hook variations scored for Curiosity Gap, Emotional Trigger & Platform Fit. Free to start." />
        <meta property="og:title" content="TikTok Hook Generator — Free AI Tool | HookLab" />
        <meta property="og:description" content="Generate scroll-stopping TikTok hooks with AI. Scored for Curiosity Gap, Emotional Trigger, Platform Fit and more. Free to start." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app/tiktok-hook-generator" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/generate?platform=TikTok" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>

        <main>

          {/* Hero */}
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; Built for TikTok creators
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              TikTok Hook Generator<br /><span className="text-green-400">Free AI Tool</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Generate 3 AI-scored TikTok hooks from your content in seconds. Each hook is rated for Curiosity Gap, Emotional Trigger, and Platform Fit — so you know exactly which one will stop the scroll.
            </p>
            <Link href="/generate?platform=TikTok" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate TikTok hooks free
            </Link>
            <p className="text-white/25 text-sm mt-4">No signup &middot; 3 free uses/month &middot; Results in 10 seconds</p>
          </section>

          {/* How it works */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">HOW IT WORKS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">01</div>
                  <h2 className="font-bold mb-2">Paste your content</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Describe your video idea, paste your script draft, or drop in a caption. HookLab reads the core idea and finds the best angle for TikTok.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">02</div>
                  <h2 className="font-bold mb-2">AI generates 3 hooks</h2>
                  <p className="text-white/35 text-sm leading-relaxed">You get 3 different hook variations — each using a different psychological trigger: Curiosity Gap, Bold Claim, Pattern Interrupt, and more.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">03</div>
                  <h2 className="font-bold mb-2">Pick your winner</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Each hook is scored 0–100 across 5 dimensions. Pick the highest-scoring one and post with confidence.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Before / After examples */}
          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">REAL RESULTS</p>
                <h2 className="text-3xl font-black mb-4">Weak hook → Scroll-stopper</h2>
                <p className="text-white/40 text-base max-w-xl mx-auto">Here's what HookLab does to ordinary content topics.</p>
              </div>
              <div className="space-y-4">
                {EXAMPLES.map((ex, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                      <p className="text-xs font-mono text-white/25 tracking-widest mb-2">BEFORE</p>
                      <p className="text-white/50 text-sm italic">&ldquo;{ex.before}&rdquo;</p>
                    </div>
                    <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-5">
                      <p className="text-xs font-mono text-green-400/60 tracking-widest mb-2">AFTER (AI-generated)</p>
                      <p className="text-white text-sm font-medium">&ldquo;{ex.after}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why TikTok hooks matter */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-3xl mx-auto px-5 py-20">
              <h2 className="text-3xl font-black mb-6">Why TikTok hooks matter more than anything else</h2>
              <div className="space-y-5 text-white/60 text-base leading-relaxed">
                <p>TikTok's algorithm is ruthless. If your video doesn't hold attention in the first 1–3 seconds, it gets buried. The hook — the very first thing someone sees or hears — determines whether they keep watching or swipe away.</p>
                <p>Most creators focus on editing, audio, or posting times. But the single highest-leverage change you can make is writing a better hook. A 10-word improvement to your opening line can double your completion rate.</p>
                <p>HookLab's TikTok hook generator is built specifically for short-form video. It understands the psychological patterns that make TikTok hooks work: curiosity gaps, bold claims, relatable pain, and pattern interrupts.</p>
                <p>Every hook is scored across five dimensions so you don't have to guess — you can see exactly why a hook will or won't work before you post.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-white/[0.06]">
            <div className="max-w-2xl mx-auto px-5 py-20">
              <h2 className="text-2xl font-black text-center mb-10">Frequently asked questions</h2>
              <div className="space-y-6">
                {FAQS.map(faq => (
                  <div key={faq.q} className="border-b border-white/[0.07] pb-6">
                    <p className="font-semibold mb-2">{faq.q}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Internal links */}
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-16">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">MORE HOOK GENERATORS</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'YouTube Hooks', href: '/youtube-hook-generator' },
                  { label: 'Instagram Hooks', href: '/instagram-hook-generator' },
                  { label: 'LinkedIn Hooks', href: '/linkedin-hook-generator' },
                  { label: 'All Platforms', href: '/generate' },
                ].map(l => (
                  <Link key={l.label} href={l.href} className="text-center px-4 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl text-sm text-white/50 hover:text-white transition-all">
                    {l.label} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl font-black mb-4">Start generating TikTok hooks free</h2>
            <p className="text-white/40 mb-8">3 free uses per month. No signup, no credit card.</p>
            <Link href="/generate?platform=TikTok" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate hooks now
            </Link>
          </section>

        </main>

        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center flex-wrap gap-4 mb-4 text-sm text-white/25">
            <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/youtube-hook-generator" className="hover:text-white/50 transition-colors">YouTube Hooks</Link>
            <Link href="/linkedin-hook-generator" className="hover:text-white/50 transition-colors">LinkedIn Hooks</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookLab</p>
        </footer>
      </div>
    </>
  );
}
