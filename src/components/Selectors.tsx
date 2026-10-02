import { ApiRequest, Mode } from '@/lib/types';

type ExplainLevel = NonNullable<ApiRequest['explainLevel']>;
type QuizCount = NonNullable<ApiRequest['quizCount']>;
type QuizDifficulty = NonNullable<ApiRequest['quizDifficulty']>;

export function Selectors({
  mode, setMode,
  explainLevel, setExplainLevel,
  quizCount, setQuizCount,
  quizDifficulty, setQuizDifficulty,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  explainLevel: 'eli5' | 'highschool' | 'university';
  setExplainLevel: (l: 'eli5' | 'highschool' | 'university') => void;
  quizCount: '5' | '10';
  setQuizCount: (c: '5' | '10') => void;
  quizDifficulty: 'easy' | 'medium' | 'hard';
  setQuizDifficulty: (d: 'easy' | 'medium' | 'hard') => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
        className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition-all min-w-[140px]"
      >
        <option value="summarize">Summarize</option>
        <option value="explain">Explain</option>
        <option value="quiz">Quiz</option>
      </select>

      {mode === 'explain' && (
        <select
          value={explainLevel}
          onChange={(e) => setExplainLevel(e.target.value as ExplainLevel)}
          className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition-all min-w-[160px]"
        >
          <option value="eli5">ELI5</option>
          <option value="highschool">High School</option>
          <option value="university">University</option>
        </select>
      )}

      {mode === 'quiz' && (
        <div className="flex gap-4 flex-wrap">
          <select
            value={quizCount}
            onChange={(e) => setQuizCount(e.target.value as QuizCount)}
            className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition-all"
          >
            <option value="5">5 Questions</option>
            <option value="10">10 Questions</option>
          </select>

          <select
            value={quizDifficulty}
            onChange={(e) => setQuizDifficulty(e.target.value as QuizDifficulty)}
            className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition-all"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
    </div>
  );
}