# HookScore — Viral Hook Tester

AI-powered hook analysis for TikTok, YouTube, Instagram, Twitter/X, and LinkedIn.

---

## Deploy in 10 Minutes

### Step 1 — Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account (or log in)
3. Go to **API Keys** → **Create Key**
4. Copy the key — it looks like `sk-ant-api03-...`

---

### Step 2 — Deploy to Vercel (Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → upload this folder (or push to GitHub first)
3. In the **Environment Variables** section, add:
   - `ANTHROPIC_API_KEY` = your key from Step 1
4. Click **Deploy**

That's it — your site is live in ~2 minutes.

---

### Step 3 — Add Stripe Payments (Optional but recommended)

1. Go to [stripe.com](https://stripe.com) and create a free account
2. Go to **Products** → **Create product**
   - Name: "HookScore Pro"
   - Price: $9/month (recurring)
3. Go to **Payment Links** → create a link for that product
4. Copy the payment link URL (looks like `https://buy.stripe.com/...`)
5. In Vercel → your project → **Settings** → **Environment Variables**, add:
   - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` = your payment link URL
6. Redeploy (Vercel does this automatically when you save env vars)

Now the "Upgrade" button on your site goes directly to Stripe checkout.

---

### Step 4 — Custom Domain (Optional)

1. In Vercel → your project → **Settings** → **Domains**
2. Add your domain (e.g., `hookscore.app` or `viralhooktester.com`)
3. Update your DNS nameservers as Vercel instructs

Good domain ideas: `hookscore.app`, `hooktest.ai`, `viralhooks.io`

---

## Running Locally

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
viral-hook-tester/
├── pages/
│   ├── _app.js           # App wrapper (CSS imports)
│   ├── index.js          # Main hook tester page
│   ├── pricing.js        # Pricing page
│   └── api/
│       └── analyze.js    # Backend: calls Claude API
├── styles/
│   └── globals.css       # Tailwind + global styles
├── package.json
├── next.config.js
├── tailwind.config.js
└── .env.example
```

---

## Monetization Strategy

### Phase 1 — Free tier to build trust
- 5 free analyses/day is generous enough that people actually use it
- Saves last 20 analyses locally so users build a habit
- Analysis quality makes users realize they need more

### Phase 2 — Upgrade triggers
The app shows the upgrade modal when:
- User hits the daily limit
- User clicks "See Pro features"

**Recommended price: $9/month**
- Low enough that creators don't think twice
- High enough for real revenue: 200 users = $1,800/month

### Phase 3 — Growth channels
- TikTok: Film yourself using the tool to test hooks before posting
- LinkedIn: Post "I tested 6 hooks with AI and here's what scored highest"
- Reddit: Share in r/content_strategy, r/socialmedia, r/entrepreneur
- Twitter/X: "Rate my hook" threads using the tool live

### Phase 4 — Upsell opportunities
- Agency plan ($49/month): Team seats + bulk CSV upload
- API access ($99/month): For tools that want to embed hook scoring
- Done-for-you hook packs per niche ($19 one-time)

---

## Customization

### Changing the brand name
Replace all instances of "HookScore" in:
- `pages/index.js` (nav + footer)
- `pages/pricing.js` (nav + footer)

### Adding more niches or platforms
Edit the `PLATFORMS` and `NICHES` arrays in `pages/index.js`.
Then add matching context entries in `PLATFORM_CONTEXT` and `NICHE_CONTEXT` in `pages/api/analyze.js`.

### Changing the AI model
In `pages/api/analyze.js`, change the `model` field:
- `claude-opus-4-6` — best quality (current)
- `claude-haiku-4-5-20251001` — faster and cheaper (good for high volume)

### Adjusting free tier limits
In `pages/index.js`, change `FREE_LIMIT` (currently `5`).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | No | Stripe payment link for Pro upgrades |
| `NEXT_PUBLIC_APP_URL` | No | Your production URL (for SEO) |

---

## Cost Estimate

Each analysis calls Claude claude-opus-4-6 with ~1,000 input tokens and ~1,500 output tokens.

| Volume | API Cost (approx) | At $9/user/month |
|---|---|---|
| 100 analyses/day | ~$2–3/day | Covered by ~10 paying users |
| 500 analyses/day | ~$10–15/day | Covered by ~50 paying users |
| 1,000 analyses/day | ~$20–30/day | Covered by ~100 paying users |

To reduce costs at scale, switch to `claude-haiku-4-5-20251001` in the API route.

---

Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Anthropic Claude](https://anthropic.com).
