import Head from 'next/head';
import Link from 'next/link';

const EXAMPLES = [
  { before: "Skincare routine", after: "I tried 47 products in 6 months to fix my skin. Only 3 actually worked. Here's what they are." },
  { before: "Fitness transformation", after: "I trained for 6 months with zero results. Then I changed one thing — and lost 8kg in 10 weeks." },
  { before: "Travel content", after: "I spent 30 days in Bali on €800. Here's the itinerary nobody posts about." },
  { before: "Recipe video", after: "My mother's pasta recipe has 5 ingredients and it's better than any restaurant I've ever eaten at." },
];

export default function InstagramHookGenerator() {
  return (
    <>
      <Head>
        <title>Instagram Hook Generator — Free AI Tool | HookLab</title>
        <meta name="description" content="Generate AI-scored Instagram Reels hooks that stop the scroll. Get 3 hook variations scored for Curiosity Gap, Emotional Trigger & Platform Fit. Free to start." />
        <meta property="og:title" content="Instagram Hook Generator — Free AI Tool | HookLab" />
        <meta property="og:description" content="Generate scroll-stopping Instagram hooks with AI. 3 free uses, no signup needed." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app/instagram-hook-generator" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/generate?platform=Instagram" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>

        <main>
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; Built for Instagram creators
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              Instagram Hook Generator<br /><span className="text-green-400">Free AI Tool</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Generate 3 AI-scored Instagram Reels hooks in seconds. Scored for Curiosity Gap, Emotional Trigger, and Platform Fit — built for how Instagram audiences scroll and share.
            </p>
            <Link href="/generate?platform=Instagram" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate Instagram hooks free
            </Link>
            <p className="text-white/25 text-sm mt-4">No signup &middot; 3 free uses/month &middot; Results in 10 seconds</p>
          </section>

          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">BEFORE & AFTER</p>
                <h2 className="text-3xl font-black mb-4">Generic caption → Scroll-stopper</h2>
              </div>
              <div className="space-y-4">
                {EXAMPLES.map((ex, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
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
            </div>
          </section>

          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-3xl mx-auto px-5 py-20">
              <h2 className="text-3xl font-black mb-6">What makes an Instagram hook different</h2>
              <div className="space-y-5 text-white/60 text-base leading-relaxed">
                <p>Instagram Reels compete on two levels: the visual thumbnail and the first spoken or on-screen line. HookLab focuses on the verbal hook — the first thing viewers hear or read — which determines whether they keep watching.</p>
                <p>The best Instagram hooks combine relatability with surprise. They reference an experience the viewer has had ("if you've ever struggled with X") and immediately pivot to a counterintuitive outcome or claim.</p>
                <p>HookLab generates hooks that work for Reels captions, on-screen text overlays, and voice-over openers — all scored so you know which will perform best before you post.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-16">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">MORE HOOK GENERATORS</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'TikTok Hooks', href: '/tiktok-hook-generator' },
                  { label: 'YouTube Hooks', href: '/youtube-hook-generator' },
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

          <section className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl font-black mb-4">Generate Instagram hooks free</h2>
            <p className="text-white/40 mb-8">3 free uses per month. No signup, no credit card.</p>
            <Link href="/generate?platform=Instagram" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate hooks now
            </Link>
          </section>
        </main>

        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center flex-wrap gap-4 mb-4 text-sm text-white/25">
            <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/tiktok-hook-generator" className="hover:text-white/50 transition-colors">TikTok Hooks</Link>
            <Link href="/youtube-hook-generator" className="hover:text-white/50 transition-colors">YouTube Hooks</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookLab</p>
        </footer>
      </div>
    </>
  );
}
