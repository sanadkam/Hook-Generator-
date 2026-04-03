import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_KEY = 'hooklab_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem(COOKIE_KEY, 'accepted'); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(COOKIE_KEY, 'declined'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-[#111] border border-white/10 rounded-2xl px-5 py-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-white/50 leading-relaxed flex-1">
            We use cookies to keep you signed in and improve your experience.{' '}
            <Link href="/privacy" className="text-white/70 underline hover:text-white transition-colors">Privacy Policy</Link>
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={decline} className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors rounded-xl">
              Decline
            </button>
            <button onClick={accept} className="px-5 py-2 bg-green-400 hover:bg-green-300 text-black text-sm font-bold rounded-xl transition-all">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
