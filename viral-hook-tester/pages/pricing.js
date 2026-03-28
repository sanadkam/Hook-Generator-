import Head from 'next/head';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Try all tools with no signup required.',
    cta: 'Start free',
    ctaHref: '/generate',
    highlight: false,
    features: [
      '3 uses per tool per month',
      'Generate, Analyze & Improve hooks',
      'Swipe File access',
      'All 6 platforms supported',
      'No credit card needed',
    ],
  },
  {
    name: 'Starter',
    price: '$9',
    period: '/mo',
    desc: 'More volume for solo creators.',
    cta: 'Get Starter',
    ctaHref: '/checkout?plan=starter',
    highlight: false,
    features: [
      '30 uses per tool per month',
      'Everything in Free',
      'Priority AI generation',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    desc: 'Unlimited for serious creators.',
    cta: 'Get Pro',
    ctaHref: '/checkout?plan=pro',
    highlight: true,
    features: [
      'Unlimited uses on all tools',
      'Everything in Starter',
      'Faster response times',
      'Early access to new features',
      'Priority support',
    ],
  },
  {
    name: 'Agency',
    price: '$49',
    period: '/mo',
    desc: 'For teams managing multiple creators.',
    cta: 'Get Agency',
    ctaHref: '/checkout?plan=agency',
    highlight: false,
    features: [
      'Unlimited uses on all tools',
      'Up to 5 team seats',
      'Everything in Pro',
      'Bulk hook generation',
      'Dedicated support',
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing | HookScore</title>
        <meta name="description" content="Free to start. Upgrade when you need more. HookScore plans for solo creators, pros, and agencies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight">HookScore</Link>
          <div className="hidden sm:flex items-center gap-5">
            <Link href="/generate" className="text-sm text-white/40 hover:text-white transition-colors">Generate</Link>
            <Link href="/analyze" className="text-sm text-white/40 hover:text-white transition-colors">Analyze</Link>
            <Link href="/improve" className="text-sm text-white/40 hover:text-white transition-colors">Improve</Link>
            <Link href="/swipe" className="text-sm text-white/40 hover:text-white transition-colors">Swipe File</Link>
            <Link href="/pricing" className="text-sm font-semibold text-white transition-colors">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">
              Try free &rarr;
            </Link>
          </div>
          <div className="flex sm:hidden items-center gap-3">
            <Link href="/pricing" className="text-sm text-white transition-colors font-semibold">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">
              Try free &rarr;
            </Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-24">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest text-green-400/70 mb-3">PRICING</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto">
              Start free &mdash; no signup needed. Upgrade when you&apos;re ready for more.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-green-400/10 border-2 border-green-400'
                    : 'bg-white/[0.03] border border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-black text-xs font-black px-3 py-0.5 rounded-full tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-xs font-mono text-white/30 tracking-widest mb-1">{plan.name.toUpperCase()}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-white/30 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? 'bg-green-400 hover:bg-green-300 text-black'
                      : 'bg-white/8 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">FAQ</p>
            <div className="space-y-5">
              {[
                {
                  q: 'Do I need to sign up for the free tier?',
                  a: 'No. You get 3 free uses per tool per month with no account required. Just visit any tool and start.',
                },
                {
                  q: 'When does my free usage reset?',
                  a: 'Free usage resets at the start of each calendar month, automatically.',
                },
                {
                  q: 'Which tools count toward the free limit?',
                  a: 'Generate, Analyze, and Improve each have their own separate 3-use monthly limit. Swipe File is always free.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel at any time. You keep access until the end of your billing period.',
                },
                {
                  q: 'What platforms are supported?',
                  a: 'TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Twitter/X, and Facebook &mdash; on all plans.',
                },
              ].map((item, i) => (
                <div key={i} className="border border-white/8 rounded-xl p-5">
                  <p className="font-semibold text-sm mb-2">{item.q}</p>
                  <p className="text-white/40 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.a }} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 border border-white/8 rounded-2xl p-10 bg-white/[0.02]">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to stop guessing?</h2>
            <p className="text-white/40 text-sm mb-7 max-w-sm mx-auto">
              3 free uses per tool per month. No signup, no credit card.
            </p>
            <Link
              href="/generate"
              className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]"
            >
              &#9889; Try it free
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-5 mb-4 text-sm text-white/25">
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/analyze" className="hover:text-white/50 transition-colors">Analyze</Link>
            <Link href="/improve" className="hover:text-white/50 transition-colors">Improve</Link>
            <Link href="/swipe" className="hover:text-white/50 transition-colors">Swipe File</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
          </div>
          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} HookScore
          </p>
        </footer>

      </div>
    </>
  );
}
