import Head from 'next/head';
import Link from 'next/link';

const EXAMPLES = [
  { before: "I reviewed 10 budget laptops", after: "I spent 3 months testing 10 cheap laptops so you don't have to. Here's the only one worth buying." },
  { before: "Productivity tips for 2024", after: "I deleted every productivity app for 30 days. My output went up 40%. Here's why." },
  { before: "How I built my business", after: "I built a €10K/month business from my bedroom with €0 in ad spend. Here's the exact playbook." },
  { before: "Travel vlog intro", after: "I moved to Lisbon with no job, no apartment, and €800 to my name. This is what happened." },
];

const FAQS = [
  { q: "What makes a YouTube hook different from TikTok?", a: "YouTube viewers are slightly more patient but have infinite other videos competing for their attention. A great YouTube hook creates an open loop — a promise or question that can only be resolved by watching the full video. Think 'results up front' or 'story-driven openers' rather than pure pattern interrupts." },
  { q: "How long should a YouTube hook be?", a: "The hook should land within the first 30 seconds. The first 5–10 seconds must justify why the viewer should stay. State the payoff, create an open loop, or start with a surprising or counterintuitive claim." },
  { q: "Does the hook matter for YouTube watch time?", a: "Yes — enormously. Watch time is YouTube's core ranking signal. A weak hook increases early drop-off, which tanks the algorithm's confidence in your video. A 10% improvement in 30-second retention can significantly improve a video's distribution." },
  { q: "Is the YouTube hook generator free?", a: "Yes. 3 free hook generations per month with no account needed. You get 3 scored hook variations with AI analysis of Curiosity Gap, Clarity, Emotional Trigger, Platform Fit, and more." },
];

export default function YouTubeHookGenerator() {
  return (
    <>
      <Head>
        <title>YouTube Hook Generator — Free AI Tool | HookLab</title>
        <meta name="description" content="Generate AI-scored YouTube video hooks in seconds. Get 3 hook variations rated for Curiosity Gap, Clarity & Watch-Time Retention. Free to start — no signup." />
        <meta property="og:title" content="YouTube Hook Generator — Free AI Tool | HookLab" />
        <meta property="og:description" content="Generate scroll-stopping YouTube hooks with AI. Scored across Curiosity Gap, Clarity, and Platform Fit. Free to start." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app/youtube-hook-generator" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/generate?platform=YouTube" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>

        <main>
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; Built for YouTube creators
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              YouTube Hook Generator<br /><span className="text-green-400">Free AI Tool</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Generate 3 AI-scored YouTube hooks from your video idea in seconds. Each hook is rated for Curiosity Gap, Clarity, and Watch-Time Retention potential — so your viewer never clicks away.
            </p>
            <Link href="/generate?platform=YouTube" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate YouTube hooks free
            </Link>
            <p className="text-white/25 text-sm mt-4">No signup &middot; 3 free uses/month &middot; Results in 10 seconds</p>
          </section>

          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">HOW IT WORKS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">01</div>
                  <h2 className="font-bold mb-2">Describe your video</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Paste your title idea, script intro, or a description of the video content. The AI identifies the strongest angle for a YouTube audience.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">02</div>
                  <h2 className="font-bold mb-2">Get 3 hook options</h2>
                  <p className="text-white/35 text-sm leading-relaxed">You receive 3 hook variations built for YouTube — open loops, results-first openers, story-driven hooks, and bold claim formats.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">03</div>
                  <h2 className="font-bold mb-2">See the scores</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Each hook is scored 0–100 with breakdowns for Curiosity Gap, Clarity, Emotional Trigger, Platform Fit, and Niche Relevance.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">BEFORE & AFTER</p>
                <h2 className="text-3xl font-black mb-4">Average topic → Magnetic hook</h2>
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

          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-3xl mx-auto px-5 py-20">
              <h2 className="text-3xl font-black mb-6">Why your YouTube hook is your most important line</h2>
              <div className="space-y-5 text-white/60 text-base leading-relaxed">
                <p>YouTube's algorithm distributes videos based on click-through rate and watch time. Your hook directly affects both. A compelling hook earns the click from the thumbnail. A gripping opening line earns the watch time that gets your video recommended.</p>
                <p>Studies show 60% of YouTube viewers decide to leave within the first 30 seconds. If your hook doesn't make a promise — or deliver a surprise — in the first 10 seconds, most of your audience is already gone.</p>
                <p>HookLab's YouTube hook generator writes openings designed for this format: results up front, open loops, and story-driven hooks that force the viewer to stay to find out what happens.</p>
              </div>
            </div>
          </section>

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

          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-16">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">MORE HOOK GENERATORS</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'TikTok Hooks', href: '/tiktok-hook-generator' },
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

          <section className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl font-black mb-4">Start generating YouTube hooks free</h2>
            <p className="text-white/40 mb-8">3 free uses per month. No signup, no credit card.</p>
            <Link href="/generate?platform=YouTube" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
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
            <Link href="/linkedin-hook-generator" className="hover:text-white/50 transition-colors">LinkedIn Hooks</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookLab</p>
        </footer>
      </div>
    </>
  );
}
