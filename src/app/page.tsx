'use client';

import { useState } from 'react';
import { Presets } from '@/components/Presets';
import { Selectors } from '@/components/Selectors';
import { Output } from '@/components/Output';
import { History } from '@/components/History';
import { ApiRequest, ApiResponse, Mode } from '@/lib/types';
import { saveToHistory } from '@/lib/utils';

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('summarize');
  const [explainLevel, setExplainLevel] = useState<'eli5' | 'highschool' | 'university'>('eli5');
  const [quizCount, setQuizCount] = useState<'5' | '10'>('5');
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');

    const body: ApiRequest = { input, mode };
    if (mode === 'explain') body.explainLevel = explainLevel;
    if (mode === 'quiz') {
      body.quizCount = quizCount;
      body.quizDifficulty = quizDifficulty;
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const data: ApiResponse = await res.json();
      setOutput(data.outputMarkdown);
      saveToHistory({ mode: data.mode, timestamp: Date.now(), preview: input.slice(0, 60) + '...' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Academai
          </h1>
          <p className="text-gray-400 text-lg">AI-powered • Summarize • Explain • Quiz</p>
        </div>

        {/* Main glass card */}
        <div className="glass-panel p-8 md:p-10 space-y-8 glow-on-hover">
          <Presets setInput={setInput} />

          <textarea
            className="w-full h-40 p-5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all resize-none font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text or enter a topic..."
          />

          <Selectors
            mode={mode}
            setMode={setMode}
            explainLevel={explainLevel}
            setExplainLevel={setExplainLevel}
            quizCount={quizCount}
            setQuizCount={setQuizCount}
            quizDifficulty={quizDifficulty}
            setQuizDifficulty={setQuizDifficulty}
          />

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Generate'
              )}
            </button>

            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-300 p-4 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Output Area */}
        {output && (
          <div className="glass-panel p-8 glow-on-hover">
            <Output output={output} />
          </div>
        )}

        {/* History */}
        <div className="glass-panel p-6">
          <History />
        </div>
      </div>

      {/* Subtle footer */}
      <footer className="mt-16 text-gray-600 text-sm">
        Made in Lagos • {new Date().getFullYear()}
      </footer>
    </div>
  );
}