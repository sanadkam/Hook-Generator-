import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../lib/AuthContext';
import CookieBanner from '../components/CookieBanner';

if (typeof window !== 'undefined') {
  posthog.init('phc_7X74oAjFi2IWdNSncip4ut8ry6DcXKTruiwHP626iZG', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
  });
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const authEnabled = !!supabase;

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session?.user) {
        posthog.identify(session.user.id, { email: session.user.email });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        posthog.identify(session.user.id, { email: session.user.email });
      } else if (event === 'SIGNED_OUT') {
        posthog.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => posthog.capture('$pageview');
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, authLoading, authEnabled }}>
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
        <CookieBanner />
      </PostHogProvider>
    </AuthContext.Provider>
  );
}
