import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>HookLab - AI Hook Tools for Creators</title>
        <meta name="description" content="Generate scroll-stopping hooks, polish your drafts, and study proven hook blueprints. Free to start, no signup." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hook-generator-tau.vercel.app" />
        <meta property="og:title" content="HookLab - AI Hook Tools for Creators" />
        <meta property="og:description" content="Generate scroll-stopping hooks, polish your drafts, and study proven hook blueprints. Free to start, no signup." />
        <meta property="og:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HookLab - AI Hook Tools for Creators" />
        <meta name="twitter:description" content="Generate scroll-stopping hooks, polish your drafts, and study proven hook blueprints. Free to start, no signup." />
        <meta name="twitter:image" content="https://hook-generator-tau.vercel.app/og.png" />
        <link rel="canonical" href="https://hook-generator-tau.vercel.app" />
      </Head>
      <div className="min-h-screen bg-black text-white">
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
          <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-green-400/70 border border-green-400/20 rounded-full px-4 py-1.5 mb-8">
              &#9889; 3 free uses/month &middot; No signup needed
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Hooks that make<br /><span className="text-green-400">people stop scrolling</span>
            </h1>
            <p className="text-white/40 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              AI tools built for creators. Generate hooks from scratch, polish your drafts, and study what makes them work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/generate" className="w-full sm:w-auto px-8 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">Generate hooks &rarr;</Link>
              <Link href="/blueprints" className="w-full sm:w-auto px-8 py-4 bg-white/[0.06] hover:bg-white/10 text-white font-semibold rounded-2xl text-base transition-all border border-white/10">Browse blueprints</Link>
            </div>
          </section>
          <section className="max-w-5xl mx-auto px-5 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/generate" className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/30 rounded-2xl p-7 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mb-5 text-xl">&#9889;</div>
                <h2 className="text-lg font-bold mb-2">Generate</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Pick your platform, drop in your topic, and get 5 scroll-stopping hooks in seconds. TikTok, Instagram, YouTube and more.</p>
                <span className="text-green-400 text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">Generate hooks &rarr;</span>
              </Link>
              <Link href="/polish" className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/30 rounded-2xl p-7 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mb-5 text-xl">&#9997;</div>
                <h2 className="text-lg font-bold mb-2">Polish</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Already have a rough idea? Paste it in and get a sharper, punchier version back. No more second-guessing your wording.</p>
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
          <section className="border-t border-white/[0.06] bg-white/[0.01]">
            <div className="max-w-4xl mx-auto px-5 py-20">
              <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-12">HOW IT WORKS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">01</div>
                  <h3 className="font-bold mb-2">Pick your platform</h3>
                  <p className="text-white/35 text-sm leading-relaxed">TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Twitter/X, or Facebook.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">02</div>
                  <h3 className="font-bold mb-2">Describe your content</h3>
                  <p className="text-white/35 text-sm leading-relaxed">Tell us your topic or paste in a rough hook you already have.</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-3">03</div>
                  <h3 className="font-bold mb-2">Get your hooks</h3>
                  <p className="text-white/35 text-sm leading-relaxed">Pick the one that feels right and post it. Simple as that.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to stop guessing?</h2>
            <p className="text-white/40 mb-8 text-base">3 free uses per tool per month. No account, no card.</p>
            <Link href="/generate" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">&#9889; Start generating</Link>
          </section>
        </main>
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-4 text-sm text-white/25">
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/polish" className="hover:text-white/50 transition-colors">Polish</Link>
            <Link href="/blueprints" className="hover:text-white/50 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookLab</p>
        </footer>
      </div>
    </>
  );
}
