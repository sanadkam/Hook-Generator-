import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

const PLANS = [
  {
    name: 'Free',
    price: '&#8364;0',
    period: '',
    description: 'Try it out, no signup needed',
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
    price: '&#8364;5.99',
    period: '/mo',
    description: 'Built for serious creators',
    features: [
      '30 Hook Generations / month',
      '30 Polish uses / month',
      'Blueprints always free',
      'All platforms supported',
      'Priority support',
    ],
    cta: 'Get Creator',
    ctaHref: null,
    plan: 'creator',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '&#8364;11.99',
    period: '/mo',
    description: 'For serious content creators',
    features: [
      'Unlimited Hook Generations',
      'Unlimited Polish uses',
      'Blueprints always free',
      'All platforms supported',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Get Pro',
    ctaHref: null,
    plan: 'pro',
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel anytime with no questions asked. Your plan continues until the end of the billing period.',
  },
  {
    q: 'Do limits reset monthly?',
    a: 'Yes. Free, Starter, and Pro limits reset on the 1st of each month.',
  },
  {
    q: 'What counts as a generation?',
    a: 'Each time you generate hooks for a piece of content counts as one use. Each Polish run is counted separately.',
  },
  {
    q: 'Are Blueprints always free?',
    a: 'Yes! The Blueprints library of hook frameworks and skeleton templates is completely free on every plan.',
  },
];

function PlanButton({ plan, highlight }) {
  const { session } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Free plan
  if (!plan.plan) {
    return (
      <Link
        href={plan.ctaHref}
        className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.1]"
      >
        {plan.cta}
      </Link>
    );
  }

  // Paid plan
  const handleCheckout = async () => {
    if (!session) {
      router.push('/login?redirect=/pricing');
      return;
    }
    setLoading(true);
    try {
      const token = session.access_token;
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: plan.plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.1]"
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
        <meta name="description" content="Simple, transparent pricing for HookLab." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">
            HookLab
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/generate" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Generate</Link>
            <Link href="/polish" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Polish</Link>
            <Link href="/blueprints" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Blueprints</Link>
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            <Link href="/generate" className="ml-2 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-lg transition-colors">Try free &#8594;</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-20 max-w-4xl mx-auto">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className="relative rounded-2xl border p-6 flex flex-col bg-white/[0.03] border-white/[0.08]"
            >
              <div className="mb-5">
                <p className="text-sm text-white/40 font-medium uppercase tracking-widest mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black" dangerouslySetInnerHTML={{ __html: plan.price }} />
                  {plan.period && <span className="text-white/40 text-sm mb-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-green-400 mt-0.5 shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <PlanButton plan={plan} highlight={plan.highlight} />
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
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
        <div className="text-center mt-20">
          <p className="text-white/40 text-sm mb-4">No credit card required to start</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors"
          >
            Start generating free &#8594;
          </Link>
        </div>
      </main>
    </div>
  );
                }
