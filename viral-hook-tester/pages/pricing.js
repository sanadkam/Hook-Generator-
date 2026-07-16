import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../lib/AuthContext';

const PLANS = [
  {
    name: 'Free',
    price: '€0',
    period: '',
    description: 'Try it out — no signup needed',
    features: [
      '3 Hook Generations / month',
      '3 Polish uses / month',
      'Blueprints always free',
      'All platforms supported',
    ],
    cta: 'Start free',
    ctaHref: '/generate',
    plan: null,
    highlight: false,
  },
  {
    name: 'Creator',
    price: '€5.99',
    period: '/mo',
    description: 'For creators who post weekly',
    features: [
      '30 Hook Generations / month',
      '30 Polish uses / month',
      'Blueprints always free',
      'All platforms supported',
      'Image upload for AI hooks',
      'Priority support',
    ],
    cta: 'Get Creator',
    ctaHref: null,
    plan: 'creator',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '€11.99',
    period: '/mo',
    description: 'For serious daily creators',
    badge: 'Most Popular',
    features: [
      'Unlimited Hook Generations',
      'Unlimited Polish uses',
      'Blueprints always free',
      'All platforms supported',
      'Image upload for AI hooks',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Get Pro',
    ctaHref: null,
    plan: 'pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '€20.99',
    period: '/mo',
    description: 'For teams & content agencies',
    features: [
      'Unlimited Hook Generations',
      'Unlimited Polish uses',
      'Blueprints always free',
      'All platforms supported',
      'Image upload for AI hooks',
      'Priority support',
      'Early access to new features',
      'Multi-account management',
    ],
    cta: 'Get Agency',
    ctaHref: null,
    plan: 'agency',
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: "Jake M.", role: "YouTube · 340K subscribers", text: "Won't post a video until my hook hits 80/100. Pro plan pays for itself 100x in views." },
  { name: "Priya R.", role: "LinkedIn · 50K followers", text: "My average impressions went from 200 to 4,000 per post. This is the best €11.99 I spend." },
  { name: "Nadia C.", role: "Content Agency", text: "We run 8 client accounts. Agency plan saves us hours every week and keeps quality consistent." },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime with no questions asked. Your plan continues until the end of the billing period.' },
  { q: 'Do limits reset monthly?', a: 'Yes. Usage resets on the 1st of each month. Unused generations don\'t roll over.' },
  { q: 'What counts as a generation?', a: 'Each time you generate hooks for a piece of content counts as one use. Each Polish run is counted separately.' },
  { q: 'Are Blueprints always free?', a: 'Yes. The Blueprints library is completely free on every plan, forever.' },
  { q: 'Can I upgrade or downgrade?', a: 'Yes. You can change your plan at any time from your account settings. Changes take effect at the next billing cycle.' },
];

function PlanButton({ plan }) {
  const { session } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!plan.plan) {
    return (
      <Link href={plan.ctaHref} className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${plan.highlight ? 'bg-green-400 hover:bg-green-300 text-black' : 'bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.1]'}`}>
        {plan.cta}
      </Link>
    );
  }

  const handleCheckout = async () => {
    if (!session) { router.push('/login?redirect=/pricing'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan: plan.plan }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Something went wrong. Please try again.'); setLoading(false); return; }
      window.location.href = data.url;
    } catch { alert('Something went wrong. Please try again.'); setLoading(false); }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${plan.highlight ? 'bg-green-400 hover:bg-green-300 text-black' : 'bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.1]'}`}
    >
      {loading ? 'Redirecting...' : plan.cta}
    </button>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Pricing | HookLab</title>
        <meta name="description" content="Start free. Upgrade when you need more. HookLab plans start at €5.99/month with unlimited hooks, image upload, and priority support." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-3">
            <Link href="/generate" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Generate</Link>
            <Link href="/polish" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Polish</Link>
            <Link href="/blueprints" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Blueprints</Link>
            <Link href="/generate" className="ml-2 px-3 py-1.5 bg-green-400 hover:bg-green-300 text-black text-sm font-semibold rounded-lg transition-colors">Try free &rarr;</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Start free. Upgrade when you need more. Cancel anytime.</p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${plan.highlight ? 'bg-green-400/[0.06] border-green-400/40 ring-1 ring-green-400/20' : 'bg-white/[0.03] border-white/[0.08]'}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{plan.badge}</span>
                </div>
              )}
              <div className="mb-5 mt-2">
                <p className={`text-sm font-medium uppercase tracking-widest mb-1 ${plan.highlight ? 'text-green-400' : 'text-white/40'}`}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-white/40 text-sm mb-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <span className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-green-400' : 'text-green-400'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <PlanButton plan={plan} />
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-10">WHAT CREATORS SAY</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <p className="text-white/65 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/35 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
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

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">No credit card required to start</p>
          <Link href="/generate" className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl transition-colors">
            &#9889; Start generating free &rarr;
          </Link>
        </div>

      </main>
    </div>
  );
}
