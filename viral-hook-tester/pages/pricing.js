import Head from 'next/head';
import Link from 'next/link';

const features = {
  free: [
    '5 analyses per day',
    'Up to 6 hooks per analysis',
    'All platforms & niches',
    'Score breakdown (5 dimensions)',
    'Weakness detection',
    'Improved hook suggestion',
    'Last 20 analyses saved locally',
  ],
  pro: [
    'Unlimited analyses',
    'Up to 6 hooks per analysis',
    'All platforms & niches',
    'Score breakdown (5 dimensions)',
    'Weakness detection',
    'Improved hook suggestion',
    'Full analysis history',
    'Priority AI scoring',
    'Export results',
    'Early access to new features',
  ],
};

function Check({ green }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 mt-0.5 ${green ? 'text-green-400' : 'text-white/30'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Pricing() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  return (
    <>
      <Head>
        <title>Pricing — HookScore</title>
        <meta name="description" content="Free and Pro plans for HookScore. Unlimited AI hook analysis for content creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Nav */}
        <nav className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">
            HookScore
          </Link>
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Back to analyzer
          </Link>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Simple pricing</h1>
            <p className="text-white/40 text-lg">
              Start free. Upgrade when you're ready to go unlimited.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* Free */}
            <div className="border border-white/10 rounded-3xl p-7 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-mono text-white/40 tracking-widest mb-2">FREE</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">$0</span>
                  <span className="text-white/30 text-sm">/month</span>
                </div>
                <p className="text-white/40 text-sm mt-2">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {features.free.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/60">
                    <Check green />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/"
                className="block w-full py-3.5 text-center border border-white/15 hover:border-white/30 text-white/60 hover:text-white rounded-2xl text-sm font-semibold transition-all"
              >
                Start for free
              </Link>
            </div>

            {/* Pro */}
            <div className="border border-green-400/40 rounded-3xl p-7 flex flex-col bg-green-400/5 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-mono text-green-400 tracking-widest">PRO</p>
                  <span className="text-xs font-mono text-black bg-green-400 px-2 py-0.5 rounded-full">
                    POPULAR
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">€4.99</span>
                  <span className="text-white/30 text-sm">/month</span>
                </div>
                <p className="text-white/40 text-sm mt-2">For serious content creators</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {features.pro.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                    <Check green />
                    {f}
                  </li>
                ))}
              </ul>

              {stripeLink ? (
                <a
                  href={stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 text-center bg-green-400 hover:bg-green-300 text-black rounded-2xl text-sm font-bold transition-colors"
                >
                  Get Pro — €4.99/month
                </a>
              ) : (
                <div className="block w-full py-3.5 text-center bg-green-400/20 text-green-400/60 border border-green-400/20 rounded-2xl text-sm font-bold cursor-not-allowed">
                  Coming soon
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">FAQ</h2>
            <div className="space-y-8">
              {[
                {
                  q: 'How does the hook scoring work?',
                  a: "Each hook is analyzed by Claude (Anthropic's AI) against 5 dimensions: Curiosity Gap, Clarity, Emotional Trigger, Platform Fit, and Niche Relevance. Scores reflect real engagement psychology, not random numbers.",
                },
                {
                  q: 'Does it use real social media data?',
                  a: "The AI is trained on patterns from millions of viral posts. It doesn't pull live data per analysis, but its scoring is based on deep knowledge of what drives engagement on each platform.",
                },
                {
                  q: 'Can I cancel my Pro subscription?',
                  a: 'Yes, cancel anytime from your Stripe billing portal. You keep Pro access until the end of your billing period.',
                },
                {
                  q: 'What platforms are supported?',
                  a: 'TikTok, YouTube, Instagram, Twitter/X, and LinkedIn — each with platform-specific scoring calibrated to that platform\'s audience behavior.',
                },
                {
                  q: 'Is my data stored anywhere?',
                  a: 'Your hook analyses are saved locally in your browser only (localStorage). We don\'t store your hooks on any server.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-white/[0.07] pb-8">
                  <h3 className="font-semibold text-white mb-2">{q}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <p className="text-white/30 text-sm mb-4">
              Questions? Reach out at{' '}
              <a href="mailto:hello@hookscore.app" className="text-white/50 hover:text-white underline transition-colors">
                hello@hookscore.app
              </a>
            </p>
            <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors">
              ← Back to hook analyzer
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
