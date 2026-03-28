import Head from 'next/head';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Try everything. No signup needed.',
    cta: 'Start free',
    ctaHref: '/generate',
    highlight: false,
    features: [
      '3 Generate uses/month',
      '3 Polish uses/month',
      'Blueprints always free',
      'All 6 platforms',
      'No credit card',
    ],
  },
  {
    name: 'Creator',
    price: '$7',
    period: '/mo',
    desc: 'For creators who post consistently.',
    cta: 'Get Creator',
    ctaHref: '/checkout?plan=creator',
    highlight: false,
    features: [
      '30 Generate uses/month',
      '30 Polish uses/month',
      'Blueprints always free',
      'All 6 platforms',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/mo',
    desc: 'Unlimited for serious creators.',
    cta: 'Get Pro',
    ctaHref: '/checkout?plan=pro',
    highlight: true,
    features: [
      'Unlimited Generate',
      'Unlimited Polish',
      'Blueprints always free',
      'All 6 platforms',
      'Priority support',
      'Early access to new tools',
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing | HookScore</title>
        <meta name="description" content="Free to start. Upgrade when you need more. Simple pricing for creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-black text-white">
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight">HookScore</Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/generate" className="text-sm text-white/40 hover:text-white transition-colors">Generate</Link>
            <Link href="/polish" className="text-sm text-white/40 hover:text-white transition-colors">Polish</Link>
            <Link href="/blueprints" className="text-sm text-white/40 hover:text-white transition-colors">Blueprints</Link>
            <Link href="/pricing" className="text-sm font-semibold text-white transition-colors">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
          <div className="flex sm:hidden items-center gap-3">
            <Link href="/pricing" className="text-sm font-semibold text-white">Pricing</Link>
            <Link href="/generate" className="text-sm font-semibold bg-green-400 hover:bg-green-300 text-black px-4 py-1.5 rounded-full transition-colors">Try free &rarr;</Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest text-green-400/70 mb-3">PRICING</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Simple, honest pricing</h1>
            <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto">Start free, no card needed. Upgrade when you want more volume.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-7 flex flex-col ${plan.highlight ? 'bg-green-400/10 border-2 border-green-400' : 'bg-white/[0.03] border border-white/10'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-black text-xs font-black px-3 py-0.5 rounded-full tracking-wide">MOST POPULAR</div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-mono text-white/30 tracking-widest mb-2">{plan.name.toUpperCase()}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-white/30 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-white/40 text-sm">{plan.desc}</p>
                </div>
                <ul className="flex-1 space-y-2.5 mb-7">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaHref} className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${plan.highlight ? 'bg-green-400 hover:bg-green-300 text-black' : 'bg-white/8 hover:bg-white/15 text-white border border-white/10'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="max-w-xl mx-auto">
            <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-8">FAQ</p>
            <div className="space-y-4">
              {[
                { q: 'Do I need an account for the free tier?', a: 'No. 3 free uses per tool per month, zero signup required.' },
                { q: 'When does free usage reset?', a: 'At the start of each calendar month, automatically.' },
                { q: 'Is Blueprints always free?', a: 'Yes. Blueprints is free on every plan, forever.' },
                { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime, keep access until end of billing period.' },
              ].map((item, i) => (
                <div key={i} className="border border-white/8 rounded-xl p-5">
                  <p className="font-semibold text-sm mb-1.5">{item.q}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-16 border border-white/8 rounded-2xl p-10 bg-white/[0.02]">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Start for free today</h2>
            <p className="text-white/40 text-sm mb-7">No account. No card. Just hooks.</p>
            <Link href="/generate" className="inline-block px-10 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all active:scale-[0.98]">&#9889; Try it free</Link>
          </div>
        </main>
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-5 mb-4 text-sm text-white/25">
            <Link href="/generate" className="hover:text-white/50 transition-colors">Generate</Link>
            <Link href="/polish" className="hover:text-white/50 transition-colors">Polish</Link>
            <Link href="/blueprints" className="hover:text-white/50 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
          </div>
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} HookScore</p>
        </footer>
      </div>
    </>
  );
}
