import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - HookLab</title>
        <meta name="description" content="Terms of Service for HookLab" />
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
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-sm text-white/30">Last updated: April 3, 2026</p>
          </div>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">1. Acceptance</h2>
            <p className="text-sm text-white/50 leading-relaxed">By using HookLab at hook-generator-tau.vercel.app you agree to these Terms. If you do not agree, do not use the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">2. Description</h2>
            <p className="text-sm text-white/50 leading-relaxed">HookLab is an AI-powered tool for generating, improving, and analyzing social media hooks. It is available on a free tier and paid subscription plans.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">3. Accounts</h2>
            <p className="text-sm text-white/50 leading-relaxed">You must provide accurate information and be at least 16 years old to create an account. You are responsible for all activity under your account and must notify us immediately of any unauthorized access at <span className="text-white/70">support@hooklab.io</span>.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">4. Subscriptions & Billing</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              <p>Paid plans are billed monthly. Payments are processed by Stripe. By subscribing you authorize recurring charges.</p>
              <p>You may cancel at any time via Account Settings. Access continues until the end of the billing period. EU/EEA users have a 14-day right of withdrawal for digital purchases as required by law.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">5. Acceptable Use</h2>
            <p className="text-sm text-white/50 leading-relaxed">You agree not to use HookLab to generate spam or illegal content, reverse-engineer or abuse our APIs, share your account, overburden our infrastructure, or submit sensitive personal data in hook prompts.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">6. Intellectual Property</h2>
            <p className="text-sm text-white/50 leading-relaxed">You retain ownership of content you submit. You grant us a limited license to process it to deliver the Service. AI-generated outputs are provided for your use — you are responsible for ensuring they comply with applicable laws. HookLab branding and software are our property.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">7. AI Disclaimer</h2>
            <p className="text-sm text-white/50 leading-relaxed">AI-generated hooks may be inaccurate or not suited to your purpose. You are responsible for reviewing all outputs before use. We do not guarantee any particular results (views, clicks, or engagement).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p className="text-sm text-white/50 leading-relaxed">To the maximum extent permitted by law, HookLab is not liable for indirect, incidental, or consequential damages. Our total liability to you shall not exceed amounts paid to us in the preceding 3 months.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-sm text-white/50 leading-relaxed">The Service is provided as-is without warranties of any kind. We do not warrant uninterrupted or error-free operation.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">10. Termination</h2>
            <p className="text-sm text-white/50 leading-relaxed">We may suspend or terminate accounts that violate these Terms. You may close your account by contacting us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">11. Changes</h2>
            <p className="text-sm text-white/50 leading-relaxed">We may update these Terms and will notify you by email for significant changes. Continued use after changes constitutes acceptance.</p>
          </section>

          <div className="pt-4 border-t border-white/[0.07] text-sm text-white/30">
            Questions? Contact us at <span className="text-white/50">support@hooklab.io</span>
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
