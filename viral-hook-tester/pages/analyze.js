import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const FREE_LIMIT = 3;
const STORAGE_KEY = 'hookscore_analyze_v1';

function getUsageCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const month = new Date().toISOString().slice(0, 7);
    if (data.month !== month) return 0;
    return data.count || 0;
  } catch { return 0; }
}

function incrementUsage() {
  if (typeof window === 'undefined') return;
  try {
    const month = new Date().toISOString().slice(0, 7);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const count = (data.month === month ? data.count || 0 : 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ month, count }));
  } catch {}
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}/10</span>
      </div>
      <div style={{ background: '#1e293b', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${value * 10}%`, background: color, height: '100%', borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function HookResultCard({ result, rank }) {
  const rankColors = ['#f59e0b', '#94a3b8', '#cd7c2f'];
  const rankLabels = ['#1 Best Hook', '#2 Runner Up', '#3 Third Place'];
  const rankEmoji = ['Gold', 'Silver', 'Bronze'];
  const scoreColor = result.overallScore >= 7 ? '#22c55e' : result.overallScore >= 5 ? '#f59e0b' : '#ef4444';
  const scores = result.scores || {};
  const curiosityGap = scores.curiosityGap != null ? Math.round(scores.curiosityGap / 10) : 0;
  const emotionalTrigger = scores.emotionalTrigger != null ? Math.round(scores.emotionalTrigger / 10) : 0;
  const clarity = scores.clarity != null ? Math.round(scores.clarity / 10) : 0;
  const platformFit = scores.platformFit != null ? Math.round(scores.platformFit / 10) : 0;
  const nicheRelevance = scores.nicheRelevance != null ? Math.round(scores.nicheRelevance / 10) : 0;

  return (
    <div style={{
      background: '#0f172a',
      border: `1px solid ${rank === 0 ? '#f59e0b' : '#1e293b'}`,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: rankColors[rank], textTransform: 'uppercase', letterSpacing: 1 }}>
          {rankLabels[rank]}
        </span>
        <span style={{ fontSize: 28, fontWeight: 900, color: scoreColor }}>
          {result.overallScore}<span style={{ fontSize: 14, color: '#475569' }}>/100</span>
        </span>
      </div>
      <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>
        &ldquo;{result.text}&rdquo;
      </p>
      <ScoreBar label="Curiosity Gap" value={curiosityGap} color="#8b5cf6" />
      <ScoreBar label="Emotional Trigger" value={emotionalTrigger} color="#ec4899" />
      <ScoreBar label="Clarity" value={clarity} color="#06b6d4" />
      <ScoreBar label="Platform Fit" value={platformFit} color="#10b981" />
      <ScoreBar label="Niche Relevance" value={nicheRelevance} color="#f59e0b" />
      {result.verdict && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: 12 }}>
          Verdict: {result.verdict}
        </p>
      )}
    </div>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#0f172a', border: '1px solid #8b5cf6', borderRadius: 16, padding: 40, maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>&#128274;</div>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Free Limit Reached</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          You have used all {FREE_LIMIT} free analyses today. Upgrade to Pro for unlimited access.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/pricing" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: 'white', padding: '12px 24px', borderRadius: 8,
            fontWeight: 700, textDecoration: 'none', fontSize: 15
          }}>View Pricing</Link>
          <button onClick={onClose} style={{
            background: '#1e293b', color: '#94a3b8', padding: '12px 24px',
            borderRadius: 8, border: '1px solid #334155', cursor: 'pointer', fontSize: 15
          }}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
}

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn', 'Twitter/X', 'Facebook'];

export default function AnalyzePage() {
  const [hooks, setHooks] = useState(['', '', '']);
  const [platform, setPlatform] = useState('TikTok');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [winner, setWinner] = useState(null);
  const [topTip, setTopTip] = useState('');
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro] = useState(false);

  useEffect(() => {
    setUsageCount(getUsageCount());
  }, []);

  const filledHooks = hooks.filter(h => h.trim().length > 0);

  async function handleAnalyze() {
    if (filledHooks.length < 2) {
      setError('Please enter at least 2 hooks to compare.');
      return;
    }
    if (!niche.trim()) {
      setError('Please enter your niche/topic.');
      return;
    }
    if (!isPro && usageCount >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setWinner(null);
    setTopTip('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hooks: filledHooks, platform, niche })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      incrementUsage();
      setUsageCount(getUsageCount());
      setResults(data.hooks || []);
      setWinner(data.winner || null);
      setTopTip(data.topTip || '');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <>
      <Head>
        <title>Compare &amp; Analyze Hooks | HookScore</title>
        <meta name="description" content="Compare up to 3 hooks side by side and find out which one wins." />
      </Head>
      <div style={{ minHeight: '100vh', background: '#020817', color: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <nav style={{ borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ color: '#8b5cf6', fontWeight: 900, fontSize: 20, textDecoration: 'none' }}>&#9889; HookScore</Link>
          <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            <Link href="/generate" style={{ color: '#94a3b8', textDecoration: 'none' }}>Generate</Link>
            <Link href="/analyze" style={{ color: '#f1f5f9', fontWeight: 600, textDecoration: 'none' }}>Analyze</Link>
            <Link href="/improve" style={{ color: '#94a3b8', textDecoration: 'none' }}>Improve</Link>
            <Link href="/swipe" style={{ color: '#94a3b8', textDecoration: 'none' }}>Swipe File</Link>
            <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pricing</Link>
          </div>
        </nav>

        <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>
              Hook <span style={{ color: '#8b5cf6' }}>Battle Mode</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>Compare up to 3 hooks and see which one wins &mdash; scored by AI.</p>
            {!isPro && (
              <p style={{ marginTop: 12, fontSize: 13, color: remaining <= 1 ? '#ef4444' : '#64748b' }}>
                {remaining} free {remaining === 1 ? 'analysis' : 'analyses'} remaining this month
              </p>
            )}
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Platform</label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14 }}
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Niche / Topic</label>
                <input
                  type="text"
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  placeholder="e.g. personal finance, fitness..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {hooks.map((hook, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Hook {i + 1} {i >= 2 && <span style={{ color: '#475569' }}>(optional)</span>}
                </label>
                <textarea
                  value={hook}
                  onChange={e => {
                    const next = [...hooks];
                    next[i] = e.target.value;
                    setHooks(next);
                  }}
                  placeholder={`Enter hook ${i + 1}...`}
                  rows={2}
                  style={{
                    width: '100%', background: '#1e293b', border: '1px solid #334155',
                    borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14,
                    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit'
                  }}
                />
              </div>
            ))}

            {error && <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>&#9888; {error}</p>}

            <button
              onClick={handleAnalyze}
              disabled={loading || filledHooks.length < 2}
              style={{
                width: '100%', padding: '14px 24px',
                background: loading || filledHooks.length < 2 ? '#1e293b' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                color: loading || filledHooks.length < 2 ? '#475569' : 'white',
                border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700,
                cursor: loading || filledHooks.length < 2 ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
              }}
            >
              {loading ? 'Analyzing...' : 'Battle â Find the Best Hook'}
            </button>
          </div>

          {results && results.length > 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#f1f5f9', textAlign: 'center' }}>
                Results &mdash; Ranked by Score
              </h2>
              {winner && (
                <div style={{ background: '#1a0f3a', border: '1px solid #8b5cf6', borderRadius: 10, padding: '12px 20px', marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ color: '#c4b5fd', fontSize: 14, margin: 0 }}>
                    <strong style={{ color: '#a78bfa' }}>Winner:</strong> &ldquo;{winner}&rdquo;
                  </p>
                  {topTip && <p style={{ color: '#64748b', fontSize: 13, marginTop: 6, marginBottom: 0 }}>Tip: {topTip}</p>}
                </div>
              )}
              {results.map((result, i) => (
                <HookResultCard key={i} result={result} rank={i} />
              ))}
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/improve" style={{
                  display: 'inline-block', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  color: 'white', padding: '12px 28px', borderRadius: 8, fontWeight: 700,
                  textDecoration: 'none', fontSize: 15
                }}>Rewrite &amp; Improve Your Best Hook</Link>
              </div>
            </div>
          )}
        </main>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
