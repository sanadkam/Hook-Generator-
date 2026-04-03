import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PLAN_LABELS = {
  free: { label: 'Free', color: 'text-white/50', badge: 'bg-white/10' },
  creator: { label: 'Creator', color: 'text-green-400', badge: 'bg-green-400/10 border border-green-400/30' },
  pro: { label: 'Pro', color: 'text-blue-400', badge: 'bg-blue-400/10 border border-blue-400/30' },
  agency: { label: 'Agency', color: 'text-purple-400', badge: 'bg-purple-400/10 border border-purple-400/30' },
};

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, stripe_customer_id, created_at')
        .eq('id', session.user.id)
        .single();
      setProfile(profileData);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleManageBilling() {
    setPortalLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const plan = profile?.plan || 'free';
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free;
  const isPaid = plan !== 'free';

  return (
    <>
      <Head>
        <title>Account - HookLab</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            Hook<span className="text-green-400">Lab</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link href="/generate" className="hover:text-white transition-colors">Generator</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </nav>
        <main className="flex-1 px-4 py-12 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-8">Account</h1>
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
          )}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Profile</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Email</span>
                <span className="text-sm text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Member since</span>
                <span className="text-sm text-white">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Subscription</h2>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-white/50">Current plan</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${planInfo.badge} ${planInfo.color}`}>{planInfo.label}</span>
            </div>
            {isPaid ? (
              <button onClick={handleManageBilling} disabled={portalLoading}
                className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {portalLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Opening portal...</> : 'Manage Subscription & Billing'}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-white/40 mb-4">You are on the free plan. Upgrade to unlock unlimited generations.</p>
                <Link href="/pricing" className="block w-full py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-all text-center">View Plans</Link>
              </div>
            )}
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Session</h2>
            <button onClick={handleSignOut}
              className="w-full py-3 bg-white/[0.04] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-semibold rounded-xl text-sm transition-all">
              Sign Out
            </button>
          </div>
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
