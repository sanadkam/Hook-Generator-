import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TOOLS = [
  { href: '/generate',   title: 'Generate Hooks',  desc: 'Create high-converting hooks from your topic or video idea.' },
  { href: '/polish',     title: 'Polish a Hook',    desc: 'Paste your existing hook and get a stronger, sharper version instantly.' },
  { href: '/blueprints', title: 'Blueprints',       desc: 'Browse proven hook frameworks from top creators.' },
  { href: '/pricing',    title: 'Upgrade',          desc: 'Go unlimited — more generations, image upload, and priority support.' },
];

const PLAN_COLORS = {
  free:    'text-white/40',
  creator: 'text-green-400',
  pro:     'text-blue-400',
  agency:  'text-purple-400',
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
      const { data: profileData } = await supabase
        .from('profiles').select('plan').eq('id', session.user.id).single();
      setProfile(profileData);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const plan = profile?.plan || 'free';
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <>
      <Head>
        <title>Dashboard - HookLab</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            Hook<span className="text-green-400">Lab</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/account" className="hover:text-white transition-colors">Account</Link>
          </div>
        </nav>

        <main className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Hey, {firstName}</h1>
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] ${planColor}`}>{plan}</span>
            </div>
            <p className="text-white/40 text-sm">What do you want to create today?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all"
              >
                <p className="font-semibold text-sm text-white mb-1">{tool.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>

          {plan === 'free' && (
            <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm text-white mb-1">You are on the Free plan</p>
                <p className="text-xs text-white/40">Upgrade to unlock unlimited generations and all tools.</p>
              </div>
              <Link href="/pricing" className="flex-shrink-0 px-5 py-2.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-all">
                Upgrade
              </Link>
            </div>
          )}
        </main>

        <footer className="border-t border-white/[0.06] px-6 py-8 text-center">
          <p className="text-white/20 text-sm">
            {new Date().getFullYear()} HookLab
            {' · '}<Link href="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
            {' · '}<Link href="/terms" className="hover:text-white/40 transition-colors">Terms</Link>
          </p>
        </footer>
      </div>
    </>
  );
          }
