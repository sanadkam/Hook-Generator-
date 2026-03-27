import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];
const NICHES    = ['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy'];
const FREE_LIMIT  = 7;
const STORAGE_KEY = 'hookscore_usage_v4'; // bumped — resets all existing users
const HISTORY_KEY = 'hookscore_history_v2';
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_MB    = 8;

// ─── Demo data (hero preview) ─────────────────────────────────────────────────
const DEMO_EXAMPLES = [
  {
    platform: 'TikTok', niche: 'Finance',
    input: 'I saved $20k in one year by cutting 3 subscriptions and switching to index funds',
    hooks: [
      { style: 'Curiosity Gap',  text: 'I saved $20k last year doing one thing my bank never told me about', score: 94 },
      { style: 'Personal Story', text: 'I was broke at 23. Here\'s the exact system I used to save $20k by 25',  score: 91 },
      { style: 'Bold Claim',     text: 'Stop budgeting. Do this instead — I saved $20k without thinking about money', score: 88 },
    ],
  },
  {
    platform: 'YouTube', niche: 'Fitness',
    input: 'How I transformed my body in 90 days training only 3 days a week with no gym',
    hooks: [
      { style: 'Personal Story', text: 'I trained 3 days a week for 90 days. Here\'s exactly what changed', score: 93 },
      { style: 'Bold Claim',     text: 'You don\'t need 6 days in the gym. My 90-day proof', score: 89 },
      { style: 'Curiosity Gap',  text: 'The 3-day training split fitness influencers don\'t post about', score: 87 },
    ],
  },
  {
    platform: 'LinkedIn', niche: 'Business',
    input: 'I got promoted twice in 18 months without directly asking for it by focusing on visibility',
    hooks: [
      { style: 'Personal Story', text: 'I got promoted twice in 18 months without asking once. Here\'s what I did', score: 95 },
      { style: 'Curiosity Gap',  text: 'The promotion strategy no one talks about — and why it works', score: 90 },
      { style: 'Bold Claim',     text: 'Stop asking for promotions. Do this instead', score: 87 },
    ],
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
function getUsageData() {
  if (typeof window === 'undefined') return { count: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0 };
    return JSON.parse(raw);
  } catch { return { count: 0 }; }
}
function incrementUsage() {
  const current = getUsageData();
  const count = current.count + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ count }));
  return count;
}
function saveHistory(entry) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({ id: Date.now(), timestamp: new Date().toISOString(), ...entry });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 15)));
  } catch {}
}
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 75) return 'text-green-400';
  if (s >= 55) return 'text-yellow-400';
  return 'text-red-400';
}
function scoreBarColor(s) {
  if (s >= 75) return 'bg-green-400';
  if (s >= 55) return 'bg-yellow-400';
  return 'bg-red-400';
}
function scoreLabel(s) {
  if (s >= 88) return 'Exceptional';
  if (s >= 75) return 'Strong';
  if (s >= 60) return 'Decent';
  if (s >= 45) return 'Weak';
  return 'Skip it';
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Credits colour helper ─────────────────────────────────────────────────────
function creditsColor(remaining) {
  if (remaining >= 5) return 'text-green-400';
  if (remaining >= 2) return 'text-yellow-400';
  return 'text-red-400';
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);
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

// ─── Hook Card Skeleton ────────────────────────────────────────────────────────
function HookCardSkeleton({ delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded w-24 mb-3" />
          <div className="h-4 bg-white/10 rounded w-full mb-1.5" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </div>
        <div className="shrink-0 text-right">
          <div className="h-10 w-12 bg-white/10 rounded" />
        </div>
      </div>
      <div className="h-9 bg-white/10 rounded-xl mb-4" />
      <div className="space-y-2.5">
        {[1,2,3,4,5].map(i => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <div className="h-2.5 bg-white/10 rounded w-24" />
              <div className="h-2.5 bg-white/10 rounded w-6" />
            </div>
            <div className="h-1.5 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hook Card ────────────────────────────────────────────────────────────────
function HookCard({ hook, index, isWinner, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied]   = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const copy = () => {
    navigator.clipboard.writeText(hook.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div
      className={`border rounded-2xl p-5 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${isWinner ? 'border-green-400/40 bg-green-400/[0.06]' : 'border-white/10 bg-white/[0.025]'}`}
      style={{ transitionDelay: visible ? '0ms' : `${delay}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-white/30">{hook.style?.toUpperCase()}</span>
            {isWinner && (
              <span className="text-xs font-mono text-green-400 border border-green-400/30 px-2 py-0.5 rounded-full">
                🏆 WINNER
              </span>
            )}
          </div>
          <p className="text-white text-base font-semibold leading-snug">"{hook.text}"</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-4xl font-black font-mono leading-none ${scoreColor(hook.overallScore)}`}>{hook.overallScore}</div>
          <div className="text-white/25 text-xs mt-0.5">/100</div>
          <div className={`text-xs font-mono mt-1 ${scoreColor(hook.overallScore)}`}>{scoreLabel(hook.overallScore)}</div>
        </div>
      </div>
      {/* Copy button */}
      <button
        onClick={copy}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all active:scale-[0.98] ${
          copied
            ? 'bg-green-400/20 text-green-400 border border-green-400/30'
            : isWinner
            ? 'bg-green-400 hover:bg-green-300 text-black'
            : 'bg-white/8 hover:bg-white/12 text-white/70 hover:text-white border border-white/10'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy hook'}
      </button>
      {/* Score bars */}
      <div className="space-y-2.5 mb-4">
        <ScoreBar label="Curiosity Gap"     score={hook.scores.curiosityGap}    delay={60} />
        <ScoreBar label="Clarity"           score={hook.scores.clarity}          delay={100} />
        <ScoreBar label="Emotional Trigger" score={hook.scores.emotionalTrigger} delay={140} />
        <ScoreBar label="Platform Fit"      score={hook.scores.platformFit}      delay={180} />
        <ScoreBar label="Niche Relevance"   score={hook.scores.nicheRelevance}   delay={220} />
      </div>
      {/* Why it works + delivery tip */}
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
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }, [onFile]);
  const handleChange = (e) => { const f = e.target.files[0]; if (f) onFile(f); };
  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img src={preview} alt="Upload preview" className="w-full max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/70 hover:bg-black/90 border border-white/20 rounded-full text-white/70 hover:text-white transition-all text-lg"
          >×</button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white/60 text-xs font-mono">{file?.name}</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl px-6 py-12 text-center cursor-pointer transition-all ${
            dragging ? 'border-green-400/60 bg-green-400/5' : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'
          }`}
        >
          <div className="text-4xl mb-3">📎</div>
          <p className="text-white/60 text-sm font-medium mb-1">Drop a screenshot, image, or file</p>
          <p className="text-white/25 text-xs">PNG, JPG, WEBP, GIF · Max {MAX_FILE_MB}MB</p>
          <p className="text-white/20 text-xs mt-1">or click to browse</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleChange} className="hidden" />
    </div>
  );
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose }) {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold mb-2">You're out of free uses</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-2">
          You've used all {FREE_LIMIT} free generations.
        </p>
        <p className="text-white/35 text-sm mb-8">
          Upgrade to Pro for <span className="text-green-400 font-semibold">unlimited hooks</span>, priority AI, and new features.
        </p>
        <div className="space-y-3">
          {stripeLink && (
            <a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-colors"
            >
              Upgrade to Pro — €4.99/month
            </a>
          )}
          <Link href="/pricing" className="block w-full py-3 border border-white/10 hover:border-white/25 text-white/50 hover:text-white rounded-2xl text-sm transition-all">
            See what's included →
          </Link>
        </div>
        <button onClick={onClose} className="mt-5 text-sm text-white/25 hover:text-white/50 transition-colors">
          Not now
        </button>
      </div>
    </div>
  );
}

// ─── Demo Widget (hero preview) ────────────────────────────────────────────────
function DemoWidget() {
  const [exIdx, setExIdx] = useState(0);
  const [hookIdx, setHookIdx] = useState(0);
  const [typed, setTyped]   = useState('');
  const [phase, setPhase]   = useState('typing'); // 'typing' | 'show'

  const ex   = DEMO_EXAMPLES[exIdx];
  const hook = ex.hooks[hookIdx];

  // Typewriter effect
  useEffect(() => {
    setTyped('');
    setPhase('typing');
    let i = 0;
    const text = hook.text;
    const interval = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setPhase('show');
      }
    }, 28);
    return () => clearInterval(interval);
  }, [hook.text]);

  // Cycle through hooks then examples
  useEffect(() => {
    if (phase !== 'show') return;
    const t = setTimeout(() => {
      const nextHook = (hookIdx + 1) % ex.hooks.length;
      if (nextHook === 0) {
        setExIdx((exIdx + 1) % DEMO_EXAMPLES.length);
      }
      setHookIdx(nextHook);
    }, 2800);
    return () => clearTimeout(t);
  }, [phase, hookIdx, exIdx, ex.hooks.length]);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-left w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/30">{ex.platform}</span>
          <span className="text-white/15">·</span>
          <span className="text-xs font-mono text-white/30">{ex.niche}</span>
        </div>
        <div className="flex gap-1">
          {ex.hooks.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === hookIdx ? 'w-6 bg-green-400' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
      </div>
      {/* Style badge */}
      <p className="text-xs font-mono text-white/25 mb-2">{hook.style.toUpperCase()}</p>
      {/* Hook text with typewriter */}
      <p className="text-white font-semibold text-sm leading-snug min-h-[3rem] mb-4">
        "{typed}<span className={`inline-block w-0.5 h-4 bg-green-400 ml-0.5 align-middle ${phase === 'typing' ? 'animate-pulse' : 'opacity-0'}`} />"
      </p>
      {/* Score */}
      <div className={`flex items-baseline gap-1 mb-3 transition-opacity duration-500 ${phase === 'show' ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`text-3xl font-black font-mono ${scoreColor(hook.score)}`}>{hook.score}</span>
        <span className="text-white/30 text-sm">/100</span>
        <span className={`text-xs font-mono ml-1 ${scoreColor(hook.score)}`}>{scoreLabel(hook.score)}</span>
      </div>
      {/* Mini score bar */}
      <div className={`h-1 bg-white/10 rounded-full overflow-hidden transition-opacity duration-500 ${phase === 'show' ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(hook.score)}`}
          style={{ width: phase === 'show' ? `${hook.score}%` : '0%' }}
        />
      </div>
      <p className="text-white/20 text-xs mt-3 font-mono">AI-GENERATED · LIVE DEMO</p>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  { icon: '🎯', title: 'Pick your platform & niche', desc: 'TikTok, YouTube, Instagram, LinkedIn or Twitter — each platform gets a tailored hook style.' },
  { icon: '📝', title: 'Paste your content or upload', desc: 'Drop in a caption draft, video script, content idea, or screenshot. Even a few sentences works.' },
  { icon: '⚡', title: 'Get 3 scored hooks instantly', desc: 'AI generates a Curiosity Gap, Bold Claim, and Personal Story hook — each scored across 5 dimensions.' },
];

function HowItWorks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
      {HOW_STEPS.map((step, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <div className="text-3xl mb-3">{step.icon}</div>
          <div className="text-xs font-mono text-white/25 mb-1">STEP {i + 1}</div>
          <p className="text-white font-semibold text-sm mb-1.5">{step.title}</p>
          <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Credit Bar ────────────────────────────────────────────────────────────────
function CreditBar({ remaining, total, onUpgrade }) {
  const pct = (remaining / total) * 100;
  return (
    <div className="mb-6 bg-white/[0.03] border border-white/8 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-white/40">FREE USES</span>
        <span className={`text-xs font-bold font-mono ${creditsColor(remaining)}`}>
          {remaining} / {total} remaining
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            remaining >= 5 ? 'bg-green-400' : remaining >= 2 ? 'bg-yellow-400' : 'bg-red-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining <= 3 && remaining > 0 && (
        <p className="text-xs text-white/30 mt-2">
          Running low —{' '}
          <button onClick={onUpgrade} className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors">
            upgrade for unlimited
          </button>
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [platform, setPlatform] = useState('TikTok');
  const [niche,    setNiche]    = useState('Finance');
  const [inputMode, setInputMode] = useState('text');
  const [text,      setText]      = useState('');
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [fileError, setFileError] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [results,   setResults]   = useState(null);
  const [error,     setError]     = useState(null);
  const [showUpgrade,  setShowUpgrade]  = useState(false);
  const [usageCount,   setUsageCount]   = useState(0);
  const [history,      setHistory]      = useState([]);
  const [showHistory,  setShowHistory]  = useState(false);
  const [winnerCopied, setWinnerCopied] = useState(false);

  const resultsRef = useRef(null);
  const formRef    = useRef(null);

  useEffect(() => {
    setUsageCount(getUsageData().count);
    setHistory(loadHistory());
  }, []);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // File handling
  const handleFile = (f) => {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) { setFileError('Unsupported file type. Please upload PNG, JPG, WEBP, or GIF.'); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) { setFileError(`File too large. Max ${MAX_FILE_MB}MB.`); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileError(null);
  };

  // Generate
  const generate = async () => {
    const hasText  = inputMode === 'text'   && text.trim().length > 10;
    const hasFile  = inputMode === 'upload' && file;
    if (!hasText && !hasFile) {
      setError(inputMode === 'text'
        ? 'Paste your content — a draft post, caption, script, or a few notes about what you want to say.'
        : 'Upload a screenshot or image of your content.');
      return;
    }
    if (usageCount >= FREE_LIMIT) { setShowUpgrade(true); return; }

    setLoading(true); setError(null); setResults(null);
    try {
      let body = { platform, niche };
      if (hasText) { body.text = text.trim(); }
      else         { body.imageBase64 = await fileToBase64(file); body.imageMimeType = file.type; }

      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      // Client-side winner derivation — ensures banner & cards always match
      if (data.hooks?.length > 0) {
        let bestIdx = 0, bestScore = -1;
        data.hooks.forEach((h, idx) => { if (h.overallScore > bestScore) { bestScore = h.overallScore; bestIdx = idx; } });
        data.winner = bestIdx;
      }

      setWinnerCopied(false);
      setResults(data);
      const newCount = incrementUsage();
      setUsageCount(newCount);
      saveHistory({ platform, niche, inputMode, results: data });
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
        <title>HookScore — Turn Any Content Into a Viral Hook</title>
        <meta name="description" content="Paste your post, upload a screenshot, or describe your video — HookScore generates 3 platform-optimized viral hooks in seconds." />
        <meta property="og:title" content="HookScore — AI Viral Hook Generator" />
        <meta property="og:description" content="Paste your content. Get 3 AI-scored viral hooks. Pick the winner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* ── Nav ── */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tight">HookScore</span>
            <span className="hidden sm:inline text-xs font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded">AI-POWERED</span>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button onClick={() => setShowHistory(!showHistory)} className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">
                History
              </button>
            )}
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            {remaining === 0 ? (
              <button onClick={() => setShowUpgrade(true)} className="text-xs font-mono text-green-400 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-400/10 transition-colors">
                Upgrade →
              </button>
            ) : (
              <span className={`hidden sm:inline text-xs font-mono ${creditsColor(remaining)}`}>{remaining} free left</span>
            )}
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-green-400 border border-green-400/20 bg-green-400/5 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            AI Hook Generator · Free to try
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
            Turn Any Content<br />
            <span className="text-green-400">Into a Viral Hook</span>
          </h1>
          <p className="text-white/50 text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Paste your post, script, or idea — get 3 platform-optimised, AI-scored hooks in seconds. Stop guessing what works.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-all active:scale-[0.98]"
            >
              ⚡ Generate my hooks free
            </button>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-3.5 border border-white/15 hover:border-white/30 text-white/60 hover:text-white rounded-2xl text-sm transition-all text-center">
              See pricing →
            </Link>
          </div>

          {/* Animated demo */}
          <DemoWidget />
          <p className="text-white/20 text-xs mt-4 font-mono">LIVE PREVIEW · HOOKS GENERATED IN REAL-TIME ABOVE</p>
        </section>

        {/* ── Main content ── */}
        <main ref={formRef} className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">

          {/* How it works */}
          <div className="mb-10">
            <p className="text-xs font-mono tracking-widest text-white/25 text-center mb-6">HOW IT WORKS</p>
            <HowItWorks />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <p className="text-xs font-mono text-white/25">START GENERATING</p>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* History panel */}
          {showHistory && history.length > 0 && (
            <div className="mb-10 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Generations</h3>
                <button onClick={() => setShowHistory(false)} className="text-white/30 hover:text-white/60 text-xl">×</button>
              </div>
              <div className="divide-y divide-white/[0.05] max-h-64 overflow-y-auto">
                {history.map((item) => {
                  const best = item.results?.hooks?.[item.results?.winner];
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setResults(item.results); setPlatform(item.platform); setNiche(item.niche); setShowHistory(false); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                      className="w-full text-left px-5 py-3 hover:bg-white/[0.04] transition-colors"
                    >
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

          {/* Credit bar — only show after first use */}
          {usageCount > 0 && remaining > 0 && (
            <CreditBar remaining={remaining} total={FREE_LIMIT} onUpgrade={() => setShowUpgrade(true)} />
          )}

          {/* Platform */}
          <div className="mb-7">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    platform === p ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'
                  }`}
                >
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
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  className={`px-4 py-2 rounded-full text-sm border font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    niche === n ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'
                  }`}
                >
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
                {[['text', '✏️ Paste text'], ['upload', '📎 Upload image']].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => { setInputMode(mode); setError(null); }}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                      inputMode === mode ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
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
                      ? "Paste your LinkedIn post draft or describe what you want to share...\n\nE.g. \"I want to write about how I got promoted without asking for it by focusing on visibility over hard work\""
                      : "Paste your content, post draft, or describe what you want to say...\n\nE.g. \"A post about the 3 tools I use to 10x my productivity as a solo founder\""
                  }
                  rows={7}
                  maxLength={3000}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 focus:bg-white/[0.06] transition-all leading-relaxed"
                />
                {/* Character counter */}
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                  {text.length > 0 && (
                    <span className={`text-xs font-mono transition-colors ${text.length > 2500 ? 'text-yellow-400' : 'text-white/20'}`}>
                      {text.length}/3000
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <UploadZone file={file} preview={preview} onFile={handleFile} onClear={clearFile} />
                {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
                <p className="mt-2 text-xs text-white/25 text-center">Works with screenshots of your draft post, notes, or content brief</p>
              </div>
            )}
            {inputMode === 'text' && text.trim().length > 0 && text.trim().length < 10 && (
              <p className="mt-1.5 text-xs text-white/30">Add a bit more detail for better hooks</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
              loading ? 'bg-green-400/40 text-black/50 cursor-not-allowed' : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Generating your hooks...
              </span>
            ) : remaining === 0 ? '🔒 Upgrade to generate' : '⚡ Generate My Hooks'}
          </button>

          {/* First-use nudge */}
          {remaining > 0 && usageCount === 0 && (
            <p className="text-center text-xs text-white/20 mt-3">
              {FREE_LIMIT} free generations · No signup needed
            </p>
          )}

          {/* ── Results ── */}
          {(loading || results) && (
            <div ref={resultsRef} className="mt-14 space-y-5">

              {/* Loading skeletons */}
              {loading && (
                <>
                  <div className="h-24 rounded-2xl bg-white/[0.04] border border-white/8 animate-pulse" />
                  <HookCardSkeleton delay={0}   />
                  <HookCardSkeleton delay={100} />
                  <HookCardSkeleton delay={200} />
                </>
              )}

              {/* Actual results */}
              {results && !loading && (
                <>
                  {/* AI summary */}
                  {results.contentSummary && (
                    <div className="flex items-start gap-3 px-4 py-3 bg-white/[0.04] border border-white/8 rounded-2xl">
                      <span className="text-base shrink-0 mt-0.5">🤖</span>
                      <div>
                        <p className="text-xs font-mono text-white/30 mb-1">AI UNDERSTOOD YOUR CONTENT AS:</p>
                        <p className="text-white/70 text-sm leading-relaxed">{results.contentSummary}</p>
                      </div>
                    </div>
                  )}

                  {/* Winner highlight */}
                  {results.hooks[results.winner] && (
                    <div className="border border-green-400/30 bg-gradient-to-b from-green-400/10 to-green-400/[0.04] rounded-2xl p-6 text-center">
                      <p className="text-xs font-mono text-green-400 tracking-widest mb-3">🏆 TOP HOOK</p>
                      <p className="text-white font-bold text-xl mb-2 leading-snug">"{results.hooks[results.winner].text}"</p>
                      <p className="text-white/45 text-sm mb-5">{results.winnerReason}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-6xl font-black font-mono ${scoreColor(results.hooks[results.winner].overallScore)}`}>
                          {results.hooks[results.winner].overallScore}
                        </span>
                        <span className="text-white/25 text-xl">/100</span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(results.hooks[results.winner].text).then(() => { setWinnerCopied(true); setTimeout(() => setWinnerCopied(false), 2000); })}
                        className={`mt-4 px-6 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${
                          winnerCopied ? 'bg-green-400/20 text-green-400 border border-green-400/40' : 'bg-green-400 hover:bg-green-300 text-black'
                        }`}
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
                        <HookCard key={i} hook={hook} index={i} isWinner={i === results.winner} delay={i * 120} />
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-white/40 text-sm mb-1">
                      {remaining === 0 ? "You've used all your free generations." : `${remaining} free generation${remaining !== 1 ? 's' : ''} remaining`}
                    </p>
                    {remaining === 0 && (
                      <p className="text-white/25 text-xs mb-4">Go unlimited for €4.99/month</p>
                    )}
                    <Link href="/pricing" className="inline-block px-6 py-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white/60 hover:text-white transition-all">
                      {remaining === 0 ? 'Upgrade to Pro →' : 'Go unlimited with Pro →'}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center mt-4">
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} HookScore ·{' '}
            <Link href="/pricing" className="hover:text-white/40 transition-colors">Pricing</Link>
          </p>
        </footer>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
