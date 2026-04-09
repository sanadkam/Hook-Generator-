import { useState } from 'react';
  'PERSONAL STORY':   'text-blue-400 border-blue-400/30 bg-blue-400/10',
  'CONTRARIAN':       'text-orange-400 border-orange-400/30 bg-orange-400/10',
  'STATISTIC':        'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'PATTERN INTERRUPT':'text-pink-400 border-pink-400/30 bg-pink-400/10',
  'RELATABLE PAIN':   'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  'CHALLENGE':        'text-green-400 border-green-400/30 bg-green-400/10',
};


function TemplateCard({ t }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(t.skeleton).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };


  return (
    <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-mono border px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[t.type] || 'text-white/40 border-white/10'}`}>{t.type}</span>
        <span className="text-xs font-mono text-white/25 shrink-0">~{t.scoreRange}</span>
      </div>


      <p className="text-white font-semibold text-base mb-1.5 leading-snug">{t.skeleton}</p>
      <p className="text-white/35 text-sm italic mb-4 leading-snug">e.g. "{t.example}"</p>


      <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs font-mono text-white/25 mb-1 tracking-wide">WHY IT WORKS</p>
        <p className="text-white/55 text-sm leading-relaxed">{t.why}</p>
      </div>


      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {t.platforms.map(p => (
            <span key={p} className="text-xs font-mono text-white/30 border border-white/8 px-2 py-0.5 rounded-full">{p}</span>
          ))}
        </div>
        <button
          onClick={copy}
          className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${copied ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-white/35 border-white/10 hover:border-white/25 hover:text-white/60'}`}
        >
          {copied ? '✓ Copied' : 'Copy skeleton'}
        </button>
      </div>
    </div>
  );
}


export default function Swipe() {
  const [typeFilter,     setTypeFilter]     = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [search,         setSearch]         = useState('');


  const filtered = TEMPLATES.filter(t => {
    const matchType     = typeFilter === 'All'     || t.type === typeFilter;
    const matchPlatform = platformFilter === 'All' || t.platforms.includes(platformFilter);
    const matchSearch   = !search || t.skeleton.toLowerCase().includes(search.toLowerCase()) || t.example.toLowerCase().includes(search.toLowerCase()) || t.why.toLowerCase().includes(search.toLowerCase());
    return matchType && matchPlatform && matchSearch;
  });


  return (
    <>
      <Head>
        <title>Hook Blueprints | HookLab</title>
        <meta name="description" content="Study proven hook skeleton frameworks. Understand the structure behind viral hooks and apply it to your content." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="min-h-screen bg-black text-white">


        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link href="/generate" className="hidden sm:block px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Generate</Link>
            <Link href="/polish" className="hidden sm:block px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Polish</Link>
            <Link href="/blueprints" className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-white/[0.08]">Blueprints</Link>
            <Link href="/pricing" className="px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
          </div>
        </nav>


        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-20">
