'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getExerciseScores, saveExerciseScore } from '@/lib/storage';
import { WORD_LIST } from '@/lib/data';
import type { ExerciseScore } from '@/lib/types';

const WORD_COUNT = 6;
const STUDY_TIME = 10;

type Phase = 'study' | 'recall' | 'results';

interface WordResult {
  word: string;
  correct: boolean;
}

function pickWords(): string[] {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, WORD_COUNT);
}

export default function WordRecall() {
  const [phase, setPhase] = useState<Phase>('study');
  const [words, setWords] = useState<string[]>(pickWords);
  const [countdown, setCountdown] = useState(STUDY_TIME);
  const [inputs, setInputs] = useState<string[]>(Array(WORD_COUNT).fill(''));
  const [recallStart, setRecallStart] = useState(0);
  const [results, setResults] = useState<WordResult[]>([]);
  const [score, setScore] = useState(0);
  const [historyScores, setHistoryScores] = useState<ExerciseScore[]>([]);

  const loadHistory = useCallback(() => {
    setHistoryScores(getExerciseScores().filter(s => s.gameType === 'wordrecall').slice(-10));
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (phase !== 'study') return;
    if (countdown <= 0) {
      setPhase('recall');
      setRecallStart(Date.now());
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  const handleSubmit = () => {
    const duration = Math.round((Date.now() - recallStart) / 1000);
    const given = new Set(inputs.map(i => i.trim().toLowerCase()).filter(Boolean));

    const wordResults: WordResult[] = words.map(word => ({
      word,
      correct: given.has(word.toLowerCase()),
    }));

    const correctCount = wordResults.filter(r => r.correct).length;
    setResults(wordResults);
    setScore(correctCount);
    setPhase('results');

    saveExerciseScore({
      id: `wr-${Date.now()}`,
      date: new Date().toISOString(),
      gameType: 'wordrecall',
      score: correctCount,
      duration,
    });
    loadHistory();
  };

  const handlePlayAgain = () => {
    setWords(pickWords());
    setPhase('study');
    setCountdown(STUDY_TIME);
    setInputs(Array(WORD_COUNT).fill(''));
    setResults([]);
    setScore(0);
  };

  const chartData = historyScores.map((s, i) => ({ game: i + 1, score: s.score }));

  return (
    <div>
      {phase === 'study' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: 'var(--gray-dark)', marginBottom: 10 }}>
              Memorize these words — {countdown}s remaining
            </p>
            <div style={{
              background: 'var(--gray-soft)',
              borderRadius: 4,
              height: 6,
              overflow: 'hidden',
              maxWidth: 320,
              margin: '0 auto',
            }}>
              <div style={{
                height: '100%',
                background: 'var(--green-primary)',
                width: `${(countdown / STUDY_TIME) * 100}%`,
                transition: 'width 1s linear',
                borderRadius: 4,
              }} />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            maxWidth: 380,
            margin: '0 auto',
          }}>
            {words.map((word, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--green-subtle)',
                  border: '2px solid var(--green-muted)',
                  borderRadius: 12,
                  padding: '18px 12px',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div style={{ maxWidth: 380, margin: '0 auto' }}>
          <p style={{ fontSize: 14, color: 'var(--gray-dark)', marginBottom: 16, textAlign: 'center' }}>
            Type the words you remember — order doesn&apos;t matter
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inputs.map((val, i) => (
              <div key={i}>
                <label
                  htmlFor={`word-input-${i}`}
                  style={{
                    fontSize: 12,
                    color: 'var(--gray-dark)',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Word {i + 1}
                </label>
                <input
                  id={`word-input-${i}`}
                  type="text"
                  value={val}
                  onChange={e => {
                    const next = [...inputs];
                    next[i] = e.target.value;
                    setInputs(next);
                  }}
                  placeholder="Type a word…"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--gray-soft)',
                    borderRadius: 10,
                    fontSize: 15,
                    background: 'var(--warm-white)',
                    color: 'var(--foreground)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            style={{ ...primaryBtnStyle, width: '100%', marginTop: 20 }}
          >
            Submit
          </button>
        </div>
      )}

      {phase === 'results' && (
        <div style={{ maxWidth: 380, margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            background: 'var(--warm-cream)',
            border: '1px solid var(--gray-soft)',
            borderRadius: 16,
            padding: '20px',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--green-primary)', marginBottom: 4 }}>
              {score}/{WORD_COUNT}
            </div>
            <div style={{ fontSize: 15, color: 'var(--gray-dark)' }}>words recalled</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: r.correct ? '#E8F5E9' : '#FFEBEE',
                  border: `1px solid ${r.correct ? '#A5D6A7' : '#EF9A9A'}`,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: r.correct ? '#2E7D32' : '#C62828' }}>
                  {r.correct ? '✓' : '✗'}
                </span>
                <span style={{ fontWeight: 600, color: r.correct ? '#2E7D32' : '#C62828', flex: 1 }}>
                  {r.word}
                </span>
                {!r.correct && (
                  <span style={{ fontSize: 12, color: '#B71C1C' }}>missed</span>
                )}
              </div>
            ))}
          </div>

          <button onClick={handlePlayAgain} style={{ ...primaryBtnStyle, width: '100%' }}>
            Play Again
          </button>
        </div>
      )}

      {chartData.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-dark)', marginBottom: 8 }}>
            Last {chartData.length} scores
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="game" tick={{ fontSize: 11, fill: 'var(--gray-mid)' }} />
              <YAxis
                domain={[0, 6]}
                ticks={[0, 2, 4, 6]}
                tick={{ fontSize: 11, fill: 'var(--gray-mid)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--warm-white)',
                  border: '1px solid var(--gray-soft)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [v as number, 'Words recalled']}
              />
              <Bar dataKey="score" fill="var(--green-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  background: 'var(--green-primary)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '12px 32px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
};
