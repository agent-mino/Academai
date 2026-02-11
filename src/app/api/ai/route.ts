import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { getOpenAI } from '@/lib/openai';
import { buildPrompt } from '@/lib/prompts';
import { rateLimit } from '@/lib/rateLimit';
import { ApiRequest, ApiResponse, Mode } from '@/lib/types';

const schema = z.object({
  input: z.string().max(8000, 'Input too long'),
  mode: z.enum(['summarize', 'explain', 'quiz'] as const),
  explainLevel: z.enum(['eli5', 'highschool', 'university'] as const).optional(),
  quizCount: z.enum(['5', '10'] as const).optional(),
  quizDifficulty: z.enum(['easy', 'medium', 'hard'] as const).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const requestId = uuidv4();
  console.log(JSON.stringify({ requestId, ip, event: 'request_start' }));

  try {
    const body: ApiRequest = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error;
      const msg = error.issues[0]?.message || error.message || 'Input validation failed';
      throw new Error(msg);
    }

    const { input, mode, explainLevel, quizCount, quizDifficulty } = parsed.data;

    if (mode === 'explain' && !explainLevel) throw new Error('Missing explain level');
    if (mode === 'quiz' && (!quizCount || !quizDifficulty)) throw new Error('Missing quiz params');

    // Simple safety check
    if (input.toLowerCase().includes('bomb') || input.toLowerCase().includes('hack')) {
      return NextResponse.json({ error: 'Request disallowed' }, { status: 403 });
    }

    const openai = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,          // ← use GROQ key
        baseURL: "https://api.groq.com/openai/v1", // ← critical: Groq's endpoint
      });
    const prompt = buildPrompt(mode, input, explainLevel, quizCount, quizDifficulty);

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: prompt.system }, { role: 'user', content: prompt.user }],
    }).catch((e) => { throw new Error(`Groq error: ${e.message}`); });

    const output = completion.choices[0].message.content || '';

    console.log(JSON.stringify({ requestId, event: 'request_end', mode }));

    return NextResponse.json<ApiResponse>({ requestId, mode, outputMarkdown: output });
  } catch (error: any) {
    console.error(JSON.stringify({ requestId, error: error.message }));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}