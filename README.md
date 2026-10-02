# AcademAI — AI Academic Assistant

[![CI](https://github.com/agent-mino/Academai/actions/workflows/ci.yml/badge.svg)](https://github.com/agent-mino/Academai/actions/workflows/ci.yml)

**Live:** https://academai-assistant.vercel.app

A study assistant that turns any text or topic into a summary, a level-matched explanation or a quiz.
Built with Next.js 16 (App Router), TypeScript and Tailwind CSS, using Groq's OpenAI-compatible API.

## What it does

| Mode | Options | Output |
|---|---|---|
| **Summarize** | — | Bullet-point summary with key terms in bold and three takeaways |
| **Explain** | ELI5 · High School · University | Sectioned explanation with an analogy and a recap |
| **Quiz** | 5 or 10 questions · easy / medium / hard | Numbered questions followed by answers with short explanations |

Plus one-click topic presets, Markdown-rendered output with copy/clear, and a local history of the last 10 requests.

## How it's built

```
Browser (React client)  ──POST /api/ai──▶  Route handler (server only)  ──▶  Groq API
                                             ├─ rate limit (6 req/min per IP)
                                             ├─ Zod validation (1–8,000 chars, valid options)
                                             ├─ safety filter on the input
                                             └─ request ID logged at start / end / error
```

- **The API key never reaches the browser.** All model calls happen in `src/app/api/ai/route.ts`; the client
  only talks to its own API route.
- **Input is validated before it costs anything.** Zod checks length and allowed options and returns `400`
  with a readable message; disallowed requests get `403` before reaching the model.
- **Failures are traceable but not leaky.** Each request gets a UUID that is logged server-side and returned
  on errors, while provider error details stay in the logs.
- **The model is configurable.** `GROQ_MODEL` overrides the default (`openai/gpt-oss-120b`), so a provider
  model retirement is a config change rather than a code change.

Note: the in-memory rate limiter is per server instance, which suits a demo. A multi-instance deployment
would move it to a shared store such as Redis.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Groq API (via the `openai` SDK) · Zod · react-markdown ·
Vercel (CI/CD from GitHub)

## Run locally

```bash
git clone https://github.com/agent-mino/Academai.git
cd Academai
npm install
cp .env.example .env.local   # then add your GROQ_API_KEY (free at https://console.groq.com/keys)
npm run dev                  # http://localhost:3000
```

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | yes | Groq API key, used server-side only |
| `GROQ_MODEL` | no | Override the default model |

## Scripts

```bash
npm run dev     # development server
npm run lint    # ESLint
npm run build   # production build
npm start       # serve the production build
```

Deployed on Vercel: every push to `main` builds and deploys automatically.
