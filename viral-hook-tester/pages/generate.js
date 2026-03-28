import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORMS  = ['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];
const NICHES     = ['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy'];
const FREE_LIMIT  = 3;
const STORAGE_KEY = 'hookscore_usage_v5'; // bumped — resets all previous users
const HISTORY_KEY = 'hookscore_history_v2';
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_MB    = 8;

// ─── Storage ──────────────────────────────────────────────────────────────────
function getUsageData() {
  if (typeof window === 'undefined') return { count: 0 };
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const month = new Date().toISOString().slice(0, 7);
    if (data.month !== month) return { count: 0 };
    return { count: data.count || 0 };
  } catch { return { count: 0 }; }
}
function incrementUsage() {
  if (typeof window === 'undefined') return 0;
  try {
    const month = new Date().toISOString().slice(0, 7);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const count = (data.month === month ? data.count || 0 : 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ month, count }));
    return count;
  } catch { return 0; }
}
function saveHistory(entry) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift({ id: Date.now(), timestamp: new Date().toISOString(), ...entry });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 15)));
  } catch {}
}
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function scoreColor(s)    { return s >= 75 ? 'text-green-400' : s >= 55 ? 'text-yellow-400' : 'text-red-400'; }
function scoreBarColor(s) { return s >= 75 ? 'bg-green-400'   : s >= 55 ? 'bg-yellow-400'   : 'bg-red-400';   }
function scoreLabel(s)    { return s >= 88 ? 'Exceptional' : s >= 75 ? 'Strong' : s >= 60 ? 'Decent' : s >= 45 ? 'Weak' : 'Skip it'; }
function creditsColor(r)  { return r >= 2 ? 'text-green-400' : r === 1 ? 'text-yellow-400' : 'text-red-400'; }

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), delay); return () => clearTimeout(t); }, [score, delay]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-white/35 font-mono">{label}</span>
        <span className={`text-xs font-bold font-mono ${scoreColor(score)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${scoreBarColor(score)}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function HookCardSkeleton({ delay = 0 }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  if (!v) return null;
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded w-24 mb-3" />
          <div className="h-4 bg-white/10 rounded w-full mb-1.5" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </div>
        <div className="h-10 w-12 bg-white/10 rounded shrink-0" />
      </div>
      <div className="h-9 bg-white/10 rounded-xl mb-4" />
      <div className="space-y-2.5">
        {[1,2,3,4,5].map(i => (
          <div key={i}>
            <div className="flex justify-between mb-1"><div className="h-2.5 bg-white/10 rounded w-24" /><div className="h-2.5 bg-white/10 rounded w-6" /></div>
            <div className="h-1.5 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hook Card ────────────────────────────────────────────────────────────────
function HookCard({ hook, isWinner, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [copied,  setCopied]  = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const copy = () => navigator.clipboard.writeText(hook.text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });

  return (
    <div className={`border rounded-2xl p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${isWinner ? 'border-green-400/40 bg-green-400/[0.06]' : 'border-white/10 bg-white/[0.025]'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-white/30">{hook.style?.toUpperCase()}</span>
            {isWinner && <span className="text-xs font-mono text-green-400 border border-green-400/30 px-2 py-0.5 rounded-full">🏆 WINNER</span>}
          </div>
          <p className="text-white text-base font-semibold leading-snug">"{hook.text}"</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-4xl font-black font-mono leading-none ${scoreColor(hook.overallScore)}`}>{hook.overallScore}</div>
          <div className="text-white/25 text-xs mt-0.5">/100</div>
          <div className={`text-xs font-mono mt-1 ${scoreColor(hook.overallScore)}`}>{scoreLabel(hook.overallScore)}</div>
        </div>
      </div>
      <button
        onClick={copy}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all active:scale-[0.98] ${copied ? 'bg-green-400/20 text-green-400 border border-green-400/30' : isWinner ? 'bg-green-400 hover:bg-green-300 text-black' : 'bg-white/8 hover:bg-white/12 text-white/70 hover:text-white border border-white/10'}`}
      >
        {copied ? '✓ Copied!' : 'Copy hook'}
      </button>
      <div className="space-y-2.5 mb-4">
        <ScoreBar label="Curiosity Gap"     score={hook.scores.curiosityGap}    delay={60} />
        <ScoreBar label="Clarity"           score={hook.scores.clarity}          delay={100} />
        <ScoreBar label="Emotional Trigger" score={hook.scores.emotionalTrigger} delay={140} />
        <ScoreBar label="Platform Fit"      score={hook.scores.platformFit}      delay={180} />
        <ScoreBar label="Niche Relevance"   score={hook.scores.nicheRelevance}   delay={220} />
      </div>
      <div className="space-y-2">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3">
          <p className="text-xs font-mono text-white/30 mb-1 tracking-wide">WHY IT WORKS</p>
          <p className="text-white/65 text-sm leading-relaxed">{hook.whyItWorks}</p>
        </div>
        <div className="bg-blue-500/[0.07] border border-blue-400/15 rounded-xl px-4 py-3">
          <p className="text-xs font-mono text-blue-400/70 mb-1 tracking-wide">DELIVERY TIP</p>
          <p className="text-white/65 text-sm leading-relaxed">{hook.deliveryTip}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ file, preview, onFile, onClear }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);
  const handleDrop = useCallback((e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }, [onFile]);
  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img src={preview} alt="Upload preview" className="w-full max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClear} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/70 hover:bg-black/90 border border-white/20 rounded-full text-white/70 hover:text-white transition-all text-lg">×</button>
          <div className="absolute bottom-3 left-4"><p className="text-white/60 text-xs font-mono">{file?.name}</p></div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl px-6 py-12 text-center cursor-pointer transition-all ${dragging ? 'border-green-400/60 bg-green-400/5' : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'}`}
        >
          <div className="text-4xl mb-3">📎</div>
          <p className="text-white/60 text-sm font-medium mb-1">Drop a screenshot or image</p>
          <p className="text-white/25 text-xs">PNG, JPG, WEBP, GIF · Max {MAX_FILE_MB}MB</p>
          <p className="text-white/20 text-xs mt-1">or click to browse</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={e => { const f = e.target.files[0]; if (f) onFile(f); }} className="hidden" />
    </div>
  );
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, reason = 'limit' }) {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  const isProFeature = reason === 'proFeature';
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">{isProFeature ? '📎' : '🔒'}</div>
        <h3 className="text-2xl font-bold mb-2">
          {isProFeature ? 'Pro feature' : 'Free limit reached'}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-2">
          {isProFeature
            ? 'Image upload is available on Pro.'
            : `You've used all ${FREE_LIMIT} free generations.`}
        </p>
        <p className="text-white/35 text-sm mb-8">
          Upgrade to Pro for <span className="text-green-400 font-semibold">unlimited hooks</span> + image upload.
        </p>
        <div className="space-y-3">
          {stripeLink && (
            <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-colors">
              Upgrade to Pro — $19/month
            </a>
          )}
          <Link href="/pricing" className="block w-full py-3 border border-white/10 hover:border-white/25 text-white/50 hover:text-white rounded-2xl text-sm transition-all">
            See what's included →
          </Link>
        </div>
        <button onClick={onClose} className="mt-5 text-sm text-white/25 hover:text-white/50 transition-colors">Not now</button>
      </div>
    </div>
  );
}

// ─── Generator Page ───────────────────────────────────────────────────────────
export default function Generate() {
  const [platform,   setPlatform]   = useState('TikTok');
  const [niche,      setNiche]      = useState('Finance');
  const [inputMode,  setInputMode]  = useState('text');
  const [text,       setText]       = useState('');
  const [file,       setFile]       = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [fileError,  setFileError]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [results,    setResults]    = useState(null);
  const [error,      setError]      = useState(null);
  const [showUpgrade,    setShowUpgrade]    = useState(false);
  const [upgradeReason,  setUpgradeReason]  = useState('limit'); // 'limit' | 'proFeature'
  const [usageCount,   setUsageCount]   = useState(0);
  const [history,      setHistory]      = useState([]);
  const [showHistory,  setShowHistory]  = useState(false);
  const [winnerCopied, setWinnerCopied] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => { setUsageCount(getUsageData().count); setHistory(loadHistory()); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  const handleFile = (f) => {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) { setFileError('Unsupported file type. Please upload PNG, JPG, WEBP, or GIF.'); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) { setFileError(`File too large. Max ${MAX_FILE_MB}MB.`); return; }
    setFile(f); setPreview(URL.createObjectURL(f));
  };
  const clearFile = () => { setFile(null); if (preview) URL.revokeObjectURL(preview); setPreview(null); setFileError(null); };

  const generate = async () => {
    const hasText = inputMode === 'text'   && text.trim().length > 10;
    const hasFile = inputMode === 'upload' && file;
    if (!hasText && !hasFile) {
      setError(inputMode === 'text' ? 'Paste your content — a draft, caption, script, or a few notes.' : 'Upload a screenshot or image of your content.');
      return;
    }
    if (usageCount >= FREE_LIMIT) { setUpgradeReason('limit'); setShowUpgrade(true); return; }

    setLoading(true); setError(null); setResults(null);
    try {
      const body = { platform, niche };
      if (hasText) { body.text = text.trim(); }
      else         { body.imageBase64 = await fileToBase64(file); body.imageMimeType = file.type; }

      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      // Always pick winner client-side from highest score
      if (data.hooks?.length > 0) {
        let bestIdx = 0, bestScore = -1;
        data.hooks.forEach((h, i) => { if (h.overallScore > bestScore) { bestScore = h.overallScore; bestIdx = i; } });
        data.winner = bestIdx;
      }

      setWinnerCopied(false);
      setResults(data);
      const newCount = incrementUsage();
      setUsageCount(newCount);
      saveHistory({ platform, niche, results: data });
      setHistory(loadHistory());
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Generate Hooks — HookLab</title>
        <meta name="description" content="Generate 3 AI-scored viral hooks from your content in seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookLab</Link>
            <span className="hidden sm:inline text-xs font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded">GENERATOR</span>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button onClick={() => setShowHistory(!showHistory)} className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">
                History
              </button>
            )}
            <Link href="/polish" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Polish</Link>
            <Link href="/blueprints"   className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Swipe</Link>
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            {remaining === 0 ? (
              <button onClick={() => { setUpgradeReason('limit'); setShowUpgrade(true); }} className="text-xs font-mono text-green-400 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-400/10 transition-colors">
                Upgrade →
              </button>
            ) : (
              <span className={`hidden sm:inline text-xs font-mono ${creditsColor(remaining)}`}>{remaining} free left</span>
            )}
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Generate Viral Hooks</h1>
            <p className="text-white/40 text-sm">Pick your platform, paste your content, get 3 scored hooks instantly.</p>
          </div>

          {/* History panel */}
          {showHistory && history.length > 0 && (
            <div className="mb-8 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Generations</h3>
                <button onClick={() => setShowHistory(false)} className="text-white/30 hover:text-white/60 text-xl">×</button>
              </div>
              <div className="divide-y divide-white/[0.05] max-h-56 overflow-y-auto">
                {history.map((item) => {
                  const best = item.results?.hooks?.[item.results?.winner];
                  return (
                    <button key={item.id} onClick={() => { setResults(item.results); setPlatform(item.platform); setNiche(item.niche); setShowHistory(false); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full text-left px-5 py-3 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs text-white/35 font-mono">{item.platform} · {item.niche}</span>
                          <p className="text-sm text-white/65 mt-0.5 truncate">{best ? `"${best.text}"` : 'No preview'}</p>
                        </div>
                        {best && <span className={`text-lg font-black font-mono shrink-0 ${scoreColor(best.overallScore)}`}>{best.overallScore}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Credit bar — after first use */}
          {usageCount > 0 && remaining > 0 && (
            <div className="mb-6 bg-white/[0.03] border border-white/8 rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/40">FREE USES</span>
                <span className={`text-xs font-bold font-mono ${creditsColor(remaining)}`}>{remaining} / {FREE_LIMIT} remaining</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${remaining >= 2 ? 'bg-green-400' : remaining === 1 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${(remaining / FREE_LIMIT) * 100}%` }} />
              </div>
              {remaining <= 1 && (
                <p className="text-xs text-white/30 mt-2">Last free use — <button onClick={() => { setUpgradeReason('limit'); setShowUpgrade(true); }} className="text-green-400 hover:text-green-300 underline underline-offset-2">upgrade for unlimited</button></p>
              )}
            </div>
          )}

          {/* Platform */}
          <div className="mb-7">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${platform === p ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">NICHE</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)} className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${niche === n ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <p className="text-xs font-mono tracking-widest text-white/25">YOUR CONTENT</p>
              <div className="flex bg-white/[0.05] border border-white/10 rounded-xl p-0.5 w-full sm:w-auto">
                {/* Text tab — always available */}
                <button
                  onClick={() => { setInputMode('text'); setError(null); }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${inputMode === 'text' ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white/60'}`}
                >
                  ✏️ Paste text
                </button>
                {/* Upload tab — Pro only */}
                <button
                  onClick={() => { setUpgradeReason('proFeature'); setShowUpgrade(true); }}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center text-white/25 flex items-center justify-center gap-1.5"
                  title="Pro feature"
                >
                  📎 Upload image
                  <span className="text-[10px] font-mono text-green-400 border border-green-400/30 px-1.5 py-0.5 rounded-full leading-none">PRO</span>
                </button>
              </div>
            </div>

            {inputMode === 'text' ? (
              <div className="relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={
                    platform === 'TikTok' || platform === 'Instagram'
                      ? "Describe your video, paste your script, or write your caption draft...\n\nE.g. \"I'm making a video about how I saved $20k in one year by cutting 3 subscriptions and switching to index funds\""
                      : platform === 'LinkedIn'
                      ? "Paste your LinkedIn post draft or describe what you want to share...\n\nE.g. \"I got promoted twice without asking — here's how visibility beats hard work\""
                      : "Paste your content, post draft, or describe what you want to say...\n\nE.g. \"A post about the 3 tools I use to 10x my productivity as a solo founder\""
                  }
                  rows={7}
                  maxLength={3000}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 focus:bg-white/[0.06] transition-all leading-relaxed"
                />
                {text.length > 0 && (
                  <span className={`absolute bottom-3 right-4 text-xs font-mono transition-colors ${text.length > 2500 ? 'text-yellow-400' : 'text-white/20'}`}>
                    {text.length}/3000
                  </span>
                )}
              </div>
            ) : (
              <div>
                <UploadZone file={file} preview={preview} onFile={handleFile} onClear={clearFile} />
                {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
              </div>
            )}
            {inputMode === 'text' && text.trim().length > 0 && text.trim().length < 10 && (
              <p className="mt-1.5 text-xs text-white/30">Add a bit more detail for better hooks</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : remaining === 0 ? 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Generating your hooks...
              </span>
            ) : remaining === 0 ? '🔒 Upgrade to generate more' : '⚡ Generate My Hooks'}
          </button>

          {usageCount === 0 && (
            <p className="text-center text-xs text-white/20 mt-3">{FREE_LIMIT} free generations · No signup needed</p>
          )}

          {/* ── Results ── */}
          {(loading || results) && (
            <div ref={resultsRef} className="mt-14 space-y-5">
              {loading && (
                <>
                  <div className="h-20 rounded-2xl bg-white/[0.04] border border-white/8 animate-pulse" />
                  <HookCardSkeleton delay={0} />
                  <HookCardSkeleton delay={100} />
                  <HookCardSkeleton delay={200} />
                </>
              )}

              {results && !loading && (
                <>
                  {results.contentSummary && (
                    <div className="flex items-start gap-3 px-4 py-3 bg-white/[0.04] border border-white/8 rounded-2xl">
                      <span className="text-base shrink-0 mt-0.5">🤖</span>
                      <div>
                        <p className="text-xs font-mono text-white/30 mb-1">AI UNDERSTOOD YOUR CONTENT AS:</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.contentSummary}</p>
                      </div>
                    </div>
                  )}

                  {/* Winner banner */}
                  {results.hooks[results.winner] && (
                    <div className="border border-green-400/30 bg-gradient-to-b from-green-400/10 to-green-400/[0.04] rounded-2xl p-6 text-center">
                      <p className="text-xs font-mono text-green-400 tracking-widest mb-3">🏆 TOP HOOK</p>
                      <p className="text-white font-bold text-xl mb-2 leading-snug">"{results.hooks[results.winner].text}"</p>
                      <p className="text-white/45 text-sm mb-5">{results.winnerReason}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-6xl font-black font-mono ${scoreColor(results.hooks[results.winner].overallScore)}`}>{results.hooks[results.winner].overallScore}</span>
                        <span className="text-white/25 text-xl">/100</span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(results.hooks[results.winner].text).then(() => { setWinnerCopied(true); setTimeout(() => setWinnerCopied(false), 2000); })}
                        className={`mt-4 px-6 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${winnerCopied ? 'bg-green-400/20 text-green-400 border border-green-400/40' : 'bg-green-400 hover:bg-green-300 text-black'}`}
                      >
                        {winnerCopied ? '✓ Copied!' : 'Copy winning hook'}
                      </button>
                    </div>
                  )}

                  {/* All 3 hooks */}
                  <div>
                    <p className="text-xs font-mono text-white/25 tracking-widest mb-4">ALL 3 OPTIONS</p>
                    <div className="space-y-4">
                      {results.hooks.map((hook, i) => (
                        <HookCard key={i} hook={hook} isWinner={i === results.winner} delay={i * 120} />
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-white/40 text-sm mb-1">
                      {remaining === 0 ? "You've used all your free generations." : `${remaining} free generation${remaining !== 1 ? 's' : ''} remaining`}
                    </p>
                    {remaining === 0 && <p className="text-white/25 text-xs mb-4">Go unlimited for $19/month</p>}
                    <Link href="/pricing" className="inline-block px-6 py-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white/60 hover:text-white transition-all">
                      {remaining === 0 ? 'Upgrade to Pro →' : 'Go unlimited with Pro →'}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} reason={upgradeReason} />}
    </>
  );
}
