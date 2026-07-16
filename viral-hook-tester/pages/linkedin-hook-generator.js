import Head from 'next/head';
import Link from 'next/link';

const EXAMPLES = [
  { before: "Lessons from my career", after: "I got promoted twice in 18 months without ever asking. Here's the counterintuitive reason why." },
  { before: "Remote work tips", after: "I've worked fully remote for 4 years. The one habit that separates the high performers from everyone else is not what you think." },
  { before: "Entrepreneurship story", after: "I quit my €90K job at 28 to build a startup. 3 years later, I have no regrets — and here's what I'd do differently." },
  { before: "Leadership advice", after: "The worst manager I ever had taught me more about leadership than all my best ones combined. Here's why." },
];

const FAQS = [
  { q: "What makes a LinkedIn hook effective?", a: "LinkedIn feeds are text-heavy, so your first 2–3 lines — before the 'see more' cut-off — must be compelling enough to make someone stop and expand. The best LinkedIn hooks are contrarian, personal, or contain a surprising claim that challenges conventional wisdom." },
  { q: "How do LinkedIn hooks differ from TikTok or YouTube?", a: "LinkedIn readers are professionals. They're drawn to career insights, counterintuitive business lessons, and credibility-based claims. Hooks that start with 'I did X for Y days' or 'The one thing nobody talks about' consistently outperform generic tips." },
  { q: "How long should a LinkedIn hook be?", a: "The opening hook — before 'see more' — is approximately 140–250 characters. Your hook must earn the click to expand. After that, you have far more space for the actual content." },
  { q: "Is the LinkedIn hook generator free?", a: "Yes. 3 free hook generations per month with no account needed. Select LinkedIn as your platform and describe your post idea — you'll get 3 scored hook variations in seconds." },
];

export default function LinkedInHookGenerator() {
  return (
    <>
      <Head>
        <title>LinkedIn Hook Generator — Free AI Tool | HookLab</title>
        <meta name="description" content="Generate AI-scored LinkedIn post hooks that expand reach and engagement. Get 3 hook variations optimised for the LinkedIn algorithm. Free to start — no signup." />
        <meta property="og:title" content="LinkedIn Hook Generator — Free AI Tool | HookLab" />
        <meta property="og:description" content="Generate AI-scored LinkedIn hooks in seconds. Scored for Curiosity Gap, Clarity, and Platform Fit. Free to start." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app/linkedin-hook-generator" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/generate?platform=LinkedIn" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>

        <main>
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; Built for LinkedIn creators & professionals
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              LinkedIn Hook Generator<br /><span className="text-green-400">Free AI Tool</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Generate 3 AI-scored LinkedIn post hooks that earn the "see more" click. Each hook is rated for Curiosity Gap, Clarity, and Platform Fit — built specifically for how professionals scroll.
            </p>
            <Link href="/generate?platform=LinkedIn" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
              &#9889; Generate LinkedIn hooks free
            </Link>
            <p className="text-white/25 text-sm mt-4">No signup &middot; 3 free uses/month &middot; Results in 10 seconds</p>
          </section>

          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">HOW IT WORKS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">01</div>
                  <h2 className="font-bold mb-2">Describe your post idea</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Paste your draft, describe your insight, or share a story you want to tell. HookLab finds the strongest professional angle.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">02</div>
                  <h2 className="font-bold mb-2">Get 3 LinkedIn hooks</h2>
                  <p className="text-white/35 text-sm leading-relaxed">You get 3 hook variations — contrarian takes, personal story openers, bold career claims, and more — all optimised for the LinkedIn audience.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">03</div>
                  <h2 className="font-bold mb-2">Pick your winner</h2>
                  <p className="text-white/35 text-sm leading-relaxed">Each hook is scored 0–100. Use the highest-scoring hook as your first line and watch your impressions grow.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <div className="text-center mb-12">
                <p className="text-xs font-mono tracking-widest text-white/25 mb-4">BEFORE & AFTER</p>
                <h2 className="text-3xl font-black mb-4">Ordinary post → High-impressions opener</h2>
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
              <h2 className="text-3xl font-black mb-6">Why your LinkedIn opener determines everything</h2>
              <div className="space-y-5 text-white/60 text-base leading-relaxed">
                <p>LinkedIn shows every post with a "see more" cutoff. Your entire post lives or dies based on whether your opening line convinces someone to click. If you lose them in the first 2–3 lines, your content simply isn't seen — regardless of how valuable the rest is.</p>
                <p>The posts that get 10,000+ impressions on LinkedIn almost always follow the same formula: they start with a counterintuitive claim, a personal story with a surprising outcome, or a question that makes the reader feel like they're missing something.</p>
                <p>HookLab's LinkedIn hook generator is trained on what works for professionals. It understands that LinkedIn readers respond to vulnerability + credibility, career insights, and opinions that challenge the status quo.</p>
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
                  { label: 'YouTube Hooks', href: '/youtube-hook-generator' },
                  { label: 'Instagram Hooks', href: '/instagram-hook-generator' },
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
            <h2 className="text-3xl font-black mb-4">Start generating LinkedIn hooks free</h2>
            <p className="text-white/40 mb-8">3 free uses per month. No signup, no credit card.</p>
            <Link href="/generate?platform=LinkedIn" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
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
