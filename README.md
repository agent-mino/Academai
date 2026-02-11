#                   Academai
# AI Academic Assistant

Next.js (App Router) + TypeScript + Tailwind CSS application that uses **Groq** (OpenAI-compatible API) to:

- Summarize text
- Explain topics at different levels (ELI5, High School, University)
- Generate quizzes (5 or 10 questions, easy/medium/hard)

Single-page UI, server-side API calls only (no API key exposed to client).

## Features

- Textarea input with clickable prompt presets
- Mode selector: Summarize | Explain | Quiz
- Explain mode: level selector (ELI5 / High School / University)
- Quiz mode: question count (5/10) + difficulty (easy/medium/hard)
- Submit button with loading state + error handling
- Markdown-rendered output area with **Copy** and **Clear** buttons
- Local history (last 10 requests stored in localStorage: mode, timestamp, preview)
- Server-side: Zod input validation (max 8000 chars), simple in-memory rate limiting, request ID logging
- Safety check: refuses disallowed/harmful requests

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (v3)
- Groq API (fast & free tier available)
- Zod, react-markdown, uuid

## Setup (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/Academic-Assistant.git
cd Academic-Assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create and configure environment variables

```bash
cp .env.example .env
```

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your free key at: https://console.groq.com/keys

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables (.env.example)

```env
# Required - Get free key from https://console.groq.com/keys
GROQ_API_KEY=gsk_...

# Optional (for future use)
# GROQ_MODEL=llama-3.1-70b-versatile
```

**Security note:** Never commit `.env` to Git. It should already be in `.gitignore`.

## Usage

1. Enter text or a topic in the textarea (or click a preset)
2. Choose mode (Summarize / Explain / Quiz) and any sub-options
3. Click **Generate**
4. View formatted markdown output
5. Use **Copy** button or **Clear** to reset
6. Recent requests appear in the History section (local only)

## Deployment to Vercel (Recommended)

Vercel provides automatic deployments, preview branches, and is optimized for Next.js.

### Steps

**1. Push your code to GitHub (if not already done)**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Go to https://vercel.com → sign in with GitHub.**

**3. Click Add New → Project.**

**4. Import your GitHub repository (Academic-Assistant).**

**5. Configure:**
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** leave as default (or `./src` if your code is inside `src/`)
- **Add environment variable:**
  - Key: `GROQ_API_KEY`
  - Value: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Everything else can stay default.

**6. Click Deploy.**

**7. After ~1–2 minutes:**
- Production URL: `https://academic-assistant.vercel.app` (or similar)
- Every future `git push` to `main` automatically deploys.

### Optional: CLI Deploy (One-time Manual)

```bash
npm i -g vercel
vercel login
vercel
vercel --prod    # promote to production
```

The GitHub integration method above is better for ongoing development.

## Future Improvements

- User authentication (e.g. NextAuth / Clerk) for persistent history
- Redis / Upstash for production-grade rate limiting
- Model selector in UI (switch between Groq models)
- Image/diagram generation support in explanations (e.g. via Flux or DALL·E)
- Better error handling & user feedback for rate limits

## Example Inputs & Expected Outputs

### 1. Summarize

**Input:** "Photosynthesis process"  
**Mode:** Summarize  
**Expected:** Bullet points of stages, bold key terms, 3 takeaways

### 2. Explain

**Input:** "Theory of relativity"  
**Mode:** Explain  
**Level:** University  
**Expected:** Sections with math concepts, analogy (e.g. spacetime fabric), quick recap

### 3. Quiz

**Input:** "American Civil War"  
**Mode:** Quiz  
**Count:** 5  
**Difficulty:** Medium  
**Expected:** 5 numbered questions, followed by answers + short explanations

---

Enjoy building and learning with Groq-powered AI! 🚀