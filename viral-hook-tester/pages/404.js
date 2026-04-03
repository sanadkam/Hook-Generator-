import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — HookLab</title>
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <Link href="/" className="text-2xl font-bold mb-16 block">
          Hook<span className="text-green-400">Lab</span>
        </Link>
        <p className="text-green-400 text-sm font-mono mb-4">404</p>
        <h1 className="text-4xl font-bold mb-4 text-center">Page not found</h1>
        <p className="text-white/40 text-base mb-10 text-center max-w-sm">
          This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/generate"
            className="px-6 py-3 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Generate hooks
          </Link>
        </div>
      </div>
    </>
  );
}
