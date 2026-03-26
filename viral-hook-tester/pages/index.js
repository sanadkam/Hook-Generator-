import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];
const NICHES = ['Finance', 'Fitness', 'Beauty', 'Tech', 'Food', 'Gaming', 'Business', 'Lifestyle', 'Education', 'Comedy'];
const FREE_LIMIT = 3;
const STORAGE_KEY = 'hookscore_usage_v3'; // bumped version resets existing users
const HISTORY_KEY = 'hookscore_history_v2';
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_MB = 8;

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
    reader.onload = () => {
      const result = reader.result;
      // Strip the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${scoreBarColor(score)}`}
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

// ─── Hook Card ────────────────────────────────────────────────────────────────

function HookCard({ hook, index, isWinner, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

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

  if (!visible) return <div className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />;

  return (
    <div className={`border rounded-2xl p-5 animate-fade-in ${
      isWinner ? 'border-green-400/40 bg-green-400/[0.06]' : 'border-white/10 bg-white/[0.025]'
    }`}>
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
          {/* The hook text — big and usable */}
          <p className="text-white text-base font-semibold leading-snug">
            "{hook.text}"
          </p>
        </div>

        {/* Score badge */}
        <div className="text-right shrink-0">
          <div className={`text-4xl font-black font-mono leading-none ${scoreColor(hook.overallScore)}`}>
            {hook.overallScore}
          </div>
          <div className="text-white/25 text-xs mt-0.5">/100</div>
          <div className={`text-xs font-mono mt-1 ${scoreColor(hook.overallScore)}`}>
            {scoreLabel(hook.overallScore)}
          </div>
        </div>
      </div>

      {/* Copy button — primary CTA */}
      <button
        onClick={copy}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all ${
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
        <ScoreBar label="Curiosity Gap"      score={hook.scores.curiosityGap}     delay={60} />
        <ScoreBar label="Clarity"            score={hook.scores.clarity}           delay={100} />
        <ScoreBar label="Emotional Trigger"  score={hook.scores.emotionalTrigger}  delay={140} />
        <ScoreBar label="Platform Fit"       score={hook.scores.platformFit}       delay={180} />
        <ScoreBar label="Niche Relevance"    score={hook.scores.nicheRelevance}    delay={220} />
      </div>

      {/* Why it works */}
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
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }, [onFile]);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFile(f);
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img src={preview} alt="Upload preview" className="w-full max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/70 hover:bg-black/90 border border-white/20 rounded-full text-white/70 hover:text-white transition-all text-lg leading-none"
          >
            ×
          </button>
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
            dragging
              ? 'border-green-400/60 bg-green-400/5'
              : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'
          }`}
        >
          <div className="text-4xl mb-3">📎</div>
          <p className="text-white/60 text-sm font-medium mb-1">
            Drop a screenshot, image, or file
          </p>
          <p className="text-white/25 text-xs">
            PNG, JPG, WEBP, GIF · Max {MAX_FILE_MB}MB
          </p>
          <p className="text-white/20 text-xs mt-1">or click to browse</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="hidden"
      />
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
        <h3 className="text-2xl font-bold mb-2">Free limit reached</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          You've used all {FREE_LIMIT} free generations. Upgrade to Pro for unlimited access.
        </p>
        <div className="space-y-3">
          {stripeLink && (
            <a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-green-400 hover:bg-green-300 text-black font-bold rounded-2xl text-sm transition-colors"
            >
              Upgrade to Pro — $9/month
            </a>
          )}
          <Link
            href="/pricing"
            className="block w-full py-3 border border-white/10 hover:border-white/25 text-white/50 hover:text-white rounded-2xl text-sm transition-all"
          >
            See all plans
          </Link>
        </div>
        <button onClick={onClose} className="mt-5 text-sm text-white/25 hover:text-white/50 transition-colors">
          Maybe tomorrow
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [platform, setPlatform] = useState('TikTok');
  const [niche, setNiche] = useState('Finance');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'upload'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setUsageCount(getUsageData().count);
    setHistory(loadHistory());
  }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  // Handle file selection
  const handleFile = (f) => {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError('Unsupported file type. Please upload a PNG, JPG, WEBP, or GIF.');
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File too large. Max ${MAX_FILE_MB}MB.`);
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileError(null);
  };

  // Cleanup object URL
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, []);

  const generate = async () => {
    const hasText = inputMode === 'text' && text.trim().length > 10;
    const hasFile = inputMode === 'upload' && file;

    if (!hasText && !hasFile) {
      setError(
        inputMode === 'text'
          ? 'Paste your content — a draft post, caption, script, or a few notes about what you want to say.'
          : 'Upload a screenshot or image of your content.'
      );
      return;
    }

    if (usageCount >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let body = { platform, niche };

      if (hasText) {
        body.text = text.trim();
      } else {
        const base64 = await fileToBase64(file);
        body.imageBase64 = base64;
        body.imageMimeType = file.type;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setResults(data);
      const newCount = incrementUsage();
      setUsageCount(newCount);
      saveHistory({ platform, niche, inputMode, preview: inputMode === 'upload' ? null : null, results: data });
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
        <title>HookScore — Turn your content into viral hooks instantly</title>
        <meta name="description" content="Paste your post, upload a screenshot, or describe your video — HookScore generates 3 platform-optimized viral hooks in seconds." />
        <meta property="og:title" content="HookScore — AI Viral Hook Generator" />
        <meta property="og:description" content="Paste your content. Get 3 viral hooks. Pick the winner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tight">HookScore</span>
            <span className="hidden sm:inline text-xs font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded">
              AI-POWERED
            </span>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors"
              >
                History
              </button>
            )}
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">
              Pricing
            </Link>
            {remaining === 0 ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-xs font-mono text-green-400 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-400/10 transition-colors"
              >
                Upgrade →
              </button>
            ) : (
              <span className="hidden sm:inline text-xs font-mono text-white/25">{remaining} free uses left</span>
            )}
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* History panel */}
          {showHistory && history.length > 0 && (
            <div className="mb-10 border border-white/10 rounded-2xl overflow-hidden animate-fade-in">
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
                      onClick={() => {
                        setResults(item.results);
                        setPlatform(item.platform);
                        setNiche(item.niche);
                        setShowHistory(false);
                        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs text-white/35 font-mono">{item.platform} · {item.niche}</span>
                          <p className="text-sm text-white/65 mt-0.5 truncate">
                            {best ? `"${best.text}"` : 'No preview'}
                          </p>
                        </div>
                        {best && (
                          <span className={`text-lg font-black font-mono shrink-0 ${scoreColor(best.overallScore)}`}>
                            {best.overallScore}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-3 leading-none">
              Viral Hook<br />Generator
            </h1>
            <p className="text-white/40 text-base sm:text-lg max-w-sm mx-auto">
              Paste your content or upload a screenshot — get 3 scroll-stopping hooks instantly
            </p>
          </div>

          {/* Platform */}
          <div className="mb-7">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm border font-medium transition-all ${
                    platform === p
                      ? 'bg-green-400 text-black border-green-400'
                      : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'
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
            <div className="flex flex-wrap gap-2">
              {NICHES.map(n => (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  className={`px-4 py-2 rounded-full text-sm border font-medium transition-all ${
                    niche === n
                      ? 'bg-green-400 text-black border-green-400'
                      : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'
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
              {/* Input mode toggle */}
              <div className="flex bg-white/[0.05] border border-white/10 rounded-xl p-0.5 w-full sm:w-auto">
                {[['text', '✏️ Paste text'], ['upload', '📎 Upload image']].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => { setInputMode(mode); setError(null); }}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                      inputMode === mode
                        ? 'bg-white/15 text-white'
                        : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {inputMode === 'text' ? (
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
            ) : (
              <div>
                <UploadZone file={file} preview={preview} onFile={handleFile} onClear={clearFile} />
                {fileError && (
                  <p className="mt-2 text-sm text-red-400">{fileError}</p>
                )}
                <p className="mt-2 text-xs text-white/25 text-center">
                  Works with screenshots of your draft post, notes, or content brief
                </p>
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
              loading
                ? 'bg-green-400/40 text-black/50 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-300 text-black active:scale-[0.99]'
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
            ) : (
              '⚡ Generate My Hooks'
            )}
          </button>

          {remaining <= 2 && remaining > 0 && (
            <p className="text-center text-xs text-white/20 mt-3">
              {remaining} free generation{remaining !== 1 ? 's' : ''} remaining today
            </p>
          )}

          {/* ── Results ── */}
          {results && (
            <div ref={resultsRef} className="mt-14 space-y-5 animate-fade-in">

              {/* AI understood your content */}
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
                  <p className="text-white font-bold text-xl mb-2 leading-snug">
                    "{results.hooks[results.winner].text}"
                  </p>
                  <p className="text-white/45 text-sm mb-5">{results.winnerReason}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-6xl font-black font-mono ${scoreColor(results.hooks[results.winner].overallScore)}`}>
                      {results.hooks[results.winner].overallScore}
                    </span>
                    <span className="text-white/25 text-xl">/100</span>
                  </div>
                  {/* Quick copy on winner */}
                  <button
                    onClick={() => navigator.clipboard.writeText(results.hooks[results.winner].text)}
                    className="mt-4 px-6 py-2.5 bg-green-400 hover:bg-green-300 text-black text-sm font-bold rounded-xl transition-colors"
                  >
                    Copy winning hook
                  </button>
                </div>
              )}

              {/* All 3 hooks */}
              <div>
                <p className="text-xs font-mono text-white/25 tracking-widest mb-4">ALL 3 OPTIONS</p>
                <div className="space-y-4">
                  {results.hooks.map((hook, i) => (
                    <HookCard
                      key={i}
                      hook={hook}
                      index={i}
                      isWinner={i === results.winner}
                      delay={i * 100}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white/40 text-sm mb-4">
                  {remaining === 0
                    ? "You've used all your free generations."
                    : `${remaining} free generation${remaining !== 1 ? 's' : ''} remaining`}
                </p>
                <Link
                  href="/pricing"
                  className="inline-block px-6 py-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                >
                  Go unlimited with Pro →
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] px-6 py-8 text-center mt-20">
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
