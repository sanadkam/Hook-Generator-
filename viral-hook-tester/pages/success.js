import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/generate');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Payment Successful — HookLab</title>
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
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">You&apos;re all set!</h1>
            <p className="text-white/50 text-base mb-8 leading-relaxed">
              Your subscription is now active. Time to create hooks that actually convert.
            </p>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">Unlimited hook generations unlocked</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">Hook analysis and improvement tools enabled</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">A receipt has been sent to your email</p>
              </div>
            </div>
            <Link href="/generate" className="block w-full px-8 py-4 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-base transition-all text-center mb-4">
              Start Generating Hooks
            </Link>
            <p className="text-white/30 text-sm">Redirecting automatically in {countdown}s...</p>
            <p className="text-white/30 text-xs mt-6">
              Manage your subscription in{' '}
              <Link href="/account" className="text-white/50 hover:text-white underline transition-colors">Account Settings</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
