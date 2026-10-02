import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { GROQ_MODEL, getGroq } from '@/lib/openai';
import { buildPrompt } from '@/lib/prompts';
import { rateLimit } from '@/lib/rateLimit';
import { ApiResponse } from '@/lib/types';

// Whole-word match so e.g. "hackathon" isn't refused.
const DISALLOWED = /\b(bombs?|hack(ing|ed)?|malware|explosives?)\b/i;

const schema = z.object({
  input: z.string().trim().min(1, 'Please enter some text').max(8000, 'Input too long'),
  mode: z.enum(['summarize', 'explain', 'quiz'] as const),
  explainLevel: z.enum(['eli5', 'highschool', 'university'] as const).optional(),
  quizCount: z.enum(['5', '10'] as const).optional(),
  quizDifficulty: z.enum(['easy', 'medium', 'hard'] as const).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests — please wait a minute and try again.' }, { status: 429 });
  }

  const requestId = uuidv4();
  console.log(JSON.stringify({ requestId, ip, event: 'request_start' }));

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Input validation failed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { input, mode, explainLevel, quizCount, quizDifficulty } = parsed.data;

    if (mode === 'explain' && !explainLevel) {
      return NextResponse.json({ error: 'Missing explain level' }, { status: 400 });
    }
    if (mode === 'quiz' && (!quizCount || !quizDifficulty)) {
      return NextResponse.json({ error: 'Missing quiz options' }, { status: 400 });
    }

    // Simple safety check before anything reaches the model
    if (DISALLOWED.test(input)) {
      return NextResponse.json({ error: 'This request isn’t allowed.' }, { status: 403 });
    }

    const prompt = buildPrompt(mode, input, explainLevel, quizCount, quizDifficulty);

    const completion = await getGroq().chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: prompt.system }, { role: 'user', content: prompt.user }],
    }).catch((e) => { throw new Error(`Groq error: ${e.message}`); });

    const output = completion.choices[0].message.content || '';

    console.log(JSON.stringify({ requestId, event: 'request_end', mode }));

    return NextResponse.json<ApiResponse>({ requestId, mode, outputMarkdown: output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ requestId, error: message }));
    // Don't leak upstream/provider details to the browser.
    return NextResponse.json({ error: 'The AI service failed to respond. Please try again.', requestId }, { status: 502 });
  }
}