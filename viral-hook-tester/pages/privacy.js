import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - HookLab</title>
        <meta name="description" content="Privacy Policy for HookLab" />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            Hook<span className="text-green-400">Lab</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </nav>
        <main className="flex-1 px-4 py-14 max-w-2xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm text-white/30">Last updated: April 3, 2026</p>
          </div>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">1. Who we are</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>HookLab operates the website hook-generator-tau.vercel.app. This Privacy Policy explains how we collect, use, and protect your personal data.</p>
              <p>Questions? Contact us at: <span className="text-white/70">support@hooklab.io</span></p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">2. Data we collect</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>We collect: your email address when you sign up, usage data (tools used, generations, timestamps), payment data processed by Stripe (we do not store card numbers), content you submit to our AI tools, and technical data (IP address, browser type).</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">3. How we use your data</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>We use your data to provide and improve the Service, manage your account and subscription, process payments, send transactional emails, prevent fraud, and comply with legal obligations. We do not sell your personal data.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">4. Legal basis (GDPR)</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>For EEA users we process data under: contract (to deliver services), legitimate interests (improve product, prevent abuse), legal obligation, and consent (optional analytics cookies, withdrawable at any time).</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">5. Cookies</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>We use strictly necessary cookies to keep you signed in. We may use analytics cookies to understand usage. You can opt out via the cookie banner on your first visit.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">6. Third-party services</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>Supabase (auth & database), Stripe (payments), OpenAI/Anthropic (AI generation — do not submit sensitive personal data in prompts), and Vercel (hosting).</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">7. Your rights (GDPR)</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>EEA users may access, correct, delete, restrict, or port their data, and may object to processing or withdraw consent at any time. Email <span className="text-white/70">support@hooklab.io</span> and we will respond within 30 days.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">8. Data retention</h2>
            <div className="text-sm text-white/50 leading-relaxed">
              <p>We retain your data while your account is active. After deletion we remove or anonymize personal data within 30 days unless legally required to retain it longer.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">9. Children</h2>
            <div className="text-sm text-white/50 leading-relaxed">
              <p>HookLab is not directed at children under 16. We do not knowingly collect data from children.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">10. Changes</h2>
            <div className="text-sm text-white/50 leading-relaxed">
              <p>We may update this policy and will notify you by email or site notice for significant changes.</p>
            </div>
          </section>

          <div className="pt-4 border-t border-white/[0.07] text-sm text-white/30">
            Questions? Email <span className="text-white/50">support@hooklab.io</span>
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
