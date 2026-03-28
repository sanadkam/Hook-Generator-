import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ─── Hook Templates Data ───────────────────────────────────────────────────────
const TEMPLATES = [
  // ── CURIOSITY GAP ──────────────────────────────────────────────────────────
  { id: 1, type: 'CURIOSITY GAP', skeleton: 'The [thing] nobody in [niche] talks about', example: 'The investment nobody in personal finance talks about', platforms: ['TikTok', 'YouTube', 'LinkedIn'], scoreRange: '80–92', why: 'Implies you hold insider knowledge. "Nobody talks about" triggers FOMO and positions you as the insider.' },
  { id: 2, type: 'CURIOSITY GAP', skeleton: 'Why your [common thing] isn\'t working (it\'s not what you think)', example: 'Why your workout routine isn\'t working (it\'s not what you think)', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '78–90', why: 'Addresses pain directly, then withholds the answer. The parenthetical creates a second curiosity loop.' },
  { id: 3, type: 'CURIOSITY GAP', skeleton: 'The reason [audience] stay [negative outcome] forever', example: 'The reason most people stay broke forever', platforms: ['TikTok', 'YouTube', 'Twitter/X'], scoreRange: '75–88', why: 'Threatens a permanent, feared outcome. Viewer stays to avoid it.' },
  { id: 4, type: 'CURIOSITY GAP', skeleton: 'What [trusted source] doesn\'t tell you about [topic]', example: 'What your financial advisor doesn\'t tell you about index funds', platforms: ['YouTube', 'LinkedIn', 'Twitter/X'], scoreRange: '76–89', why: 'Authority + betrayal creates distrust that demands resolution. "Doesn\'t tell you" implies hidden truth.' },
  { id: 5, type: 'CURIOSITY GAP', skeleton: '[Number] years of [doing thing] taught me one thing nobody mentions', example: '5 years of investing taught me one thing nobody mentions', platforms: ['LinkedIn', 'YouTube', 'TikTok'], scoreRange: '74–87', why: 'Time investment implies earned wisdom. "Nobody mentions" creates the gap that drives completion.' },
  { id: 6, type: 'CURIOSITY GAP', skeleton: 'The [niche] secret hiding in plain sight', example: 'The fitness secret hiding in plain sight', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '70–85', why: 'Classic information gap. Short, punchy, and works across all formats.' },
  { id: 7, type: 'CURIOSITY GAP', skeleton: 'I discovered something about [topic] that changed everything', example: 'I discovered something about sleep that changed everything', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '72–85', why: 'Personal discovery narrative with a transformation promise. "Everything" raises stakes.' },
  { id: 8, type: 'CURIOSITY GAP', skeleton: 'The [timeframe] experiment that proved everything I knew wrong', example: 'The 30-day experiment that proved everything I knew about dieting wrong', platforms: ['YouTube', 'TikTok', 'Instagram'], scoreRange: '79–91', why: 'Evidence-based curiosity. Sets up a reversal that the viewer must witness.' },

  // ── BOLD CLAIM ─────────────────────────────────────────────────────────────
  { id: 9, type: 'BOLD CLAIM', skeleton: 'I [achieved result] in [timeframe] without [common method]', example: 'I lost 20lbs in 90 days without counting a single calorie', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '82–95', why: 'Specific numbers + contrarian method = irresistible proof claim. The "without" subverts expectations.' },
  { id: 10, type: 'BOLD CLAIM', skeleton: 'Stop [common advice]. Do this instead', example: 'Stop saving money. Do this instead', platforms: ['TikTok', 'Twitter/X', 'Instagram'], scoreRange: '78–90', why: 'Two-part command that first disrupts, then promises a better path. Short enough to land in 1 second.' },
  { id: 11, type: 'BOLD CLAIM', skeleton: '[Popular thing] is a waste of [money/time]. Here\'s proof', example: 'Expensive gym memberships are a waste of money. Here\'s proof', platforms: ['TikTok', 'YouTube', 'Twitter/X'], scoreRange: '75–88', why: '"Here\'s proof" converts a claim into a promise of evidence — much stronger than a bare opinion.' },
  { id: 12, type: 'BOLD CLAIM', skeleton: 'Most [experts] are wrong about [topic]', example: 'Most nutritionists are wrong about protein intake', platforms: ['YouTube', 'LinkedIn', 'Twitter/X'], scoreRange: '76–89', why: 'Authority challenge. If you can back it up, this positions you as the real expert.' },
  { id: 13, type: 'BOLD CLAIM', skeleton: '[Popular belief] is keeping you [stuck/broke/unhealthy]', example: '"Work harder" advice is keeping you broke', platforms: ['TikTok', 'Twitter/X', 'LinkedIn'], scoreRange: '80–91', why: 'Turns common wisdom into the villain. Forces the viewer to question beliefs they hold.' },
  { id: 14, type: 'BOLD CLAIM', skeleton: 'I fired my [expensive professional] and got better results', example: 'I fired my financial advisor and grew my portfolio 3x', platforms: ['YouTube', 'TikTok', 'LinkedIn'], scoreRange: '77–90', why: 'Anti-authority personal story. Specific professional + specific better result = high credibility.' },

  // ── PERSONAL STORY ─────────────────────────────────────────────────────────
  { id: 15, type: 'PERSONAL STORY', skeleton: 'I [extreme negative start]. [Timeframe] later: [surprising result]', example: 'I was $60k in debt at 26. 18 months later: debt-free with $15k saved', platforms: ['TikTok', 'YouTube', 'Instagram', 'LinkedIn'], scoreRange: '85–96', why: 'Full transformation arc in two sentences. Numbers make it real. Extreme contrast drives engagement.' },
  { id: 16, type: 'PERSONAL STORY', skeleton: '[Age] and [difficult situation]. This is how I changed it', example: '24 and living paycheck to paycheck. This is how I changed it', platforms: ['TikTok', 'Instagram', 'LinkedIn'], scoreRange: '82–93', why: 'Age anchors relatability. "This is how" makes a direct promise. Short, punchy, human.' },
  { id: 17, type: 'PERSONAL STORY', skeleton: 'I quit [safe thing] to [risky thing]. Here\'s what happened', example: 'I quit my $90k job to start a business. Here\'s what happened after 1 year', platforms: ['YouTube', 'TikTok', 'LinkedIn'], scoreRange: '83–94', why: '"Here\'s what happened" is one of the strongest curiosity triggers in storytelling. Stakes are obvious.' },
  { id: 18, type: 'PERSONAL STORY', skeleton: 'Nobody believed I could [goal]. I proved them wrong', example: 'Nobody believed I could build a 6-figure business at 22. I proved them wrong', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '78–90', why: 'Underdog arc. Viewer roots for you from the first sentence. Aspirational and emotional.' },
  { id: 19, type: 'PERSONAL STORY', skeleton: 'I tried [thing] for [time]. My honest results:', example: 'I tried intermittent fasting for 90 days. My honest results:', platforms: ['YouTube', 'TikTok', 'Instagram'], scoreRange: '79–91', why: '"Honest" signals authenticity in a world of fake reviews. The colon creates the gap.' },
  { id: 20, type: 'PERSONAL STORY', skeleton: 'The [worst/best] mistake I ever made in [niche]', example: 'The worst mistake I ever made investing (and how I recovered)', platforms: ['YouTube', 'LinkedIn', 'TikTok'], scoreRange: '76–88', why: 'Failure stories outperform success stories in engagement because they\'re more believable and relatable.' },
  { id: 21, type: 'PERSONAL STORY', skeleton: 'From [bad state] to [good state] in [timeframe]. The exact steps:', example: 'From 0 to 10k followers in 60 days. The exact strategy:', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '82–93', why: 'Clear transformation + "exact steps" promise. Specificity in timeframe makes it credible.' },

  // ── CONTRARIAN ─────────────────────────────────────────────────────────────
  { id: 22, type: 'CONTRARIAN', skeleton: '[Popular advice] is actually terrible. Here\'s what works', example: '"Post every day" is actually terrible advice. Here\'s what works', platforms: ['TikTok', 'LinkedIn', 'Twitter/X'], scoreRange: '78–91', why: 'Directly attacks a belief the viewer probably holds. Challenges them to defend or reconsider.' },
  { id: 23, type: 'CONTRARIAN', skeleton: 'Everyone is doing [niche thing] wrong', example: 'Everyone is building their morning routine wrong', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '76–89', why: '"Everyone" creates immediate audience. If they do the thing, they want to know if they\'re doing it wrong.' },
  { id: 24, type: 'CONTRARIAN', skeleton: 'Hot take: [defensible unpopular opinion]', example: 'Hot take: saving money is a terrible financial strategy', platforms: ['Twitter/X', 'TikTok', 'LinkedIn'], scoreRange: '74–88', why: '"Hot take" primes the viewer to engage or argue. Perfect for reply-bait and discussion-driving content.' },
  { id: 25, type: 'CONTRARIAN', skeleton: 'I did the opposite of what everyone recommends. It worked', example: 'I did the opposite of every diet I was told to follow. Best shape of my life', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '77–89', why: 'Anti-herd psychology. "It worked" turns contrarianism into proof rather than just opinion.' },
  { id: 26, type: 'CONTRARIAN', skeleton: '[Thing] doesn\'t matter as much as [thing nobody focuses on]', example: 'Your workout doesn\'t matter as much as what you do in the 23 other hours', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '78–90', why: 'Reframes effort allocation. Viewer wants to know what they\'ve been getting wrong this whole time.' },

  // ── STATISTIC / PROOF ──────────────────────────────────────────────────────
  { id: 27, type: 'STATISTIC', skeleton: '[Shocking %] of [group] never [achieve outcome]. Here\'s why', example: '92% of people who start a diet fail within 2 weeks. Here\'s why', platforms: ['TikTok', 'YouTube', 'LinkedIn'], scoreRange: '80–92', why: 'Numbers create instant credibility. High failure rate + "here\'s why" = they must watch to not be in that 92%.' },
  { id: 28, type: 'STATISTIC', skeleton: 'I tracked [metric] for [time]. The results shocked me', example: 'I tracked every dollar I spent for a year. The results shocked me', platforms: ['YouTube', 'TikTok', 'Instagram'], scoreRange: '79–90', why: '"Shocked me" from a first-person narrator feels authentic, not clickbaity. Sets up a reveal.' },
  { id: 29, type: 'STATISTIC', skeleton: 'After [number] [content/clients/attempts], this is what actually works', example: 'After 200 YouTube videos, this is what actually gets views', platforms: ['YouTube', 'LinkedIn', 'TikTok'], scoreRange: '82–93', why: 'Volume creates authority. "Actually works" implies everything else they\'ve heard is wrong.' },
  { id: 30, type: 'STATISTIC', skeleton: 'Tested [number] [methods]. Only [number] actually worked', example: 'Tested 14 passive income streams. Only 2 actually worked', platforms: ['YouTube', 'TikTok', 'LinkedIn'], scoreRange: '81–92', why: 'Research framing. High test volume + low success rate = high-value information. They need those 2.' },
  { id: 31, type: 'STATISTIC', skeleton: '[Surprising stat] that most [audience] don\'t know', example: 'The average 30-year-old has 12 subscription services they forgot about', platforms: ['TikTok', 'Twitter/X', 'LinkedIn'], scoreRange: '76–88', why: 'Specific, relatable stat. "Most don\'t know" positions the viewer as about to receive an advantage.' },

  // ── PATTERN INTERRUPT ──────────────────────────────────────────────────────
  { id: 32, type: 'PATTERN INTERRUPT', skeleton: 'Wait — before you [common action], watch this', example: 'Wait — before you start another diet, watch this', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '75–88', why: 'Commands the viewer mid-scroll with urgency. "Wait" is one of the most effective stop-scroll words.' },
  { id: 33, type: 'PATTERN INTERRUPT', skeleton: 'I don\'t usually share this, but [confession/insight]', example: 'I don\'t usually share this, but here\'s exactly how I make money online', platforms: ['TikTok', 'Instagram', 'LinkedIn'], scoreRange: '78–90', why: 'Manufactured scarcity + intimacy. Makes the viewer feel they\'re getting something reserved and exclusive.' },
  { id: 34, type: 'PATTERN INTERRUPT', skeleton: 'Unpopular opinion: [statement that challenges the norm]', example: 'Unpopular opinion: hustle culture is making you worse at your job', platforms: ['TikTok', 'LinkedIn', 'Twitter/X'], scoreRange: '76–89', why: 'Frame-sets a polarizing position. People who agree share it; people who disagree engage.' },
  { id: 35, type: 'PATTERN INTERRUPT', skeleton: 'POV: You just discovered [solution to widespread problem]', example: 'POV: You just discovered you\'ve been paying 3x too much for groceries', platforms: ['TikTok', 'Instagram'], scoreRange: '74–87', why: 'POV format creates immersion. Places the viewer inside the revelation moment.' },
  { id: 36, type: 'PATTERN INTERRUPT', skeleton: 'This is the [niche] video you didn\'t know you needed', example: 'This is the money video you didn\'t know you needed', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '70–83', why: 'Meta-curiosity. The viewer wonders what they\'ve been missing, which creates engagement before they even know the topic.' },

  // ── RELATABLE PAIN ─────────────────────────────────────────────────────────
  { id: 37, type: 'RELATABLE PAIN', skeleton: 'If you\'ve ever [struggled with specific thing], this is for you', example: 'If you\'ve ever felt like you\'re working hard but going nowhere financially, this is for you', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '76–89', why: 'Direct audience call-out. Creates immediate "that\'s me" moment before any content is delivered.' },
  { id: 38, type: 'RELATABLE PAIN', skeleton: 'Nobody talks about how hard [common experience] actually is', example: 'Nobody talks about how hard the first year of business actually is', platforms: ['TikTok', 'LinkedIn', 'Instagram'], scoreRange: '78–90', why: 'Validates a hidden struggle. Creates strong emotional resonance and shareability.' },
  { id: 39, type: 'RELATABLE PAIN', skeleton: 'Me at [age]: [relatable mistake]. Me now: [what I know]', example: 'Me at 22: spending everything I made. Me at 28: here\'s what changed', platforms: ['TikTok', 'Instagram', 'LinkedIn'], scoreRange: '80–91', why: 'Dual timeline creates before/after narrative. Relatable younger self draws the audience in.' },
  { id: 40, type: 'RELATABLE PAIN', skeleton: 'Why [common experience] feels impossible (and what\'s actually going on)', example: 'Why losing weight feels impossible (and what\'s actually going on)', platforms: ['YouTube', 'TikTok', 'Instagram'], scoreRange: '77–89', why: 'Validates the struggle ("feels impossible"), then promises a real explanation instead of platitudes.' },
  { id: 41, type: 'RELATABLE PAIN', skeleton: 'The [niche] struggle nobody prepares you for', example: 'The entrepreneurship struggle nobody prepares you for', platforms: ['TikTok', 'LinkedIn', 'YouTube'], scoreRange: '76–88', why: '"Nobody prepares you" triggers both validation and curiosity. Viewer wants to know the unspoken truth.' },

  // ── TIME-BOUND CHALLENGE ───────────────────────────────────────────────────
  { id: 42, type: 'CHALLENGE', skeleton: 'I did [thing] every day for [time]. Here are the results', example: 'I woke up at 5am every day for 30 days. Here are the results', platforms: ['TikTok', 'YouTube', 'Instagram'], scoreRange: '82–93', why: '"Every day" shows commitment. "Here are the results" is a direct promise of payoff. One of the most reliable hook formats.' },
  { id: 43, type: 'CHALLENGE', skeleton: 'I gave myself [time] to [ambitious goal]. This is what happened', example: 'I gave myself 90 days to make $10k online. This is what happened', platforms: ['YouTube', 'TikTok', 'Instagram'], scoreRange: '83–94', why: 'Tight deadline + ambitious goal = high-stakes story. "This is what happened" creates result anticipation.' },
  { id: 44, type: 'CHALLENGE', skeleton: '[Timeframe] of [challenge]: [before state] → now', example: '6 months of daily content: 0 followers → 47k', platforms: ['TikTok', 'Instagram', 'LinkedIn'], scoreRange: '85–95', why: 'Clean data format. Numbers tell the whole transformation story at a glance. Extremely scroll-stopping.' },
  { id: 45, type: 'CHALLENGE', skeleton: 'Day [number] of [challenge]: [unexpected update]', example: 'Day 47 of posting daily: I had a breakdown and almost quit', platforms: ['TikTok', 'Instagram', 'YouTube'], scoreRange: '79–90', why: 'Serialized content with a mid-journey twist. The vulnerability makes it real and drives follow-up viewing.' },
];

const TYPES = ['All', 'CURIOSITY GAP', 'BOLD CLAIM', 'PERSONAL STORY', 'CONTRARIAN', 'STATISTIC', 'PATTERN INTERRUPT', 'RELATABLE PAIN', 'CHALLENGE'];
const PLATFORMS_FILTER = ['All', 'TikTok', 'YouTube', 'Instagram', 'Twitter/X', 'LinkedIn'];

const TYPE_COLORS = {
  'CURIOSITY GAP':    'text-purple-400 border-purple-400/30 bg-purple-400/10',
  'BOLD CLAIM':       'text-red-400 border-red-400/30 bg-red-400/10',
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
        <title>Hook Blueprints | HookScore</title>
        <meta name="description" content="Study proven hook skeleton frameworks. Understand the structure behind viral hooks and apply it to your content." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-black tracking-tight hover:text-white/80 transition-colors">HookScore</Link>
            <span className="hidden sm:inline text-xs font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded">SWIPE FILE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/generate" className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Generate</Link>
            <Link 
            <Link href="/polish"  className="hidden sm:block text-sm text-white/35 hover:text-white/65 transition-colors">Polish</Link>
            <Link href="/pricing"  className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-20">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Hook Blueprints</h1>
            <p className="text-white/40 text-sm">{TEMPLATES.length} proven hook skeletons. Filter by type or platform, copy the structure, fill in your content.</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-400/40 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="mb-4">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">HOOK TYPE</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all whitespace-nowrap flex-shrink-0 ${typeFilter === t ? 'bg-white text-black border-white' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Platform filter */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-white/25 mb-3">PLATFORM</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PLATFORMS_FILTER.map(p => (
                <button key={p} onClick={() => setPlatformFilter(p)} className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all whitespace-nowrap flex-shrink-0 ${platformFilter === p ? 'bg-green-400 text-black border-green-400' : 'border-white/15 text-white/50 hover:border-white/35 hover:text-white/80'}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-xs font-mono text-white/25 mb-5">{filtered.length} template{filtered.length !== 1 ? 's' : ''} {typeFilter !== 'All' || platformFilter !== 'All' || search ? 'matching' : 'total'}</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/30 text-sm">No templates match your filters.</p>
              <button onClick={() => { setTypeFilter('All'); setPlatformFilter('All'); setSearch(''); }} className="mt-3 text-xs text-green-400 hover:text-green-300 underline underline-offset-2">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(t => <TemplateCard key={t.id} t={t} />)}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-white font-bold mb-1">Found a structure you like?</p>
            <p className="text-white/40 text-sm mb-4">Paste your content into the generator and get 3 scored versions built on that exact framework.</p>
            <Link href="/generate" className="inline-block px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl text-sm transition-all">Generate My Hooks →</Link>
          </div>
        </main>
      </div>
    </>
  );
}
