'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getExerciseScores, saveExerciseScore } from '@/lib/storage';
import type { ExerciseScore } from '@/lib/types';

const EMOJIS = ['🌟', '🌈', '🌸', '🦋', '🌙', '🎵', '🌺', '🍀'];

interface Card {
  uid: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

interface CompletionData {
  time: number;
  attempts: number;
  score: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    uid: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [historyScores, setHistoryScores] = useState<ExerciseScore[]>([]);

  const loadHistory = useCallback(() => {
    setHistoryScores(getExerciseScores().filter(s => s.gameType === 'memory').slice(-10));
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  const handleCardClick = useCallback((uid: number) => {
    if (locked) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched || selected.includes(uid)) return;

    if (selected.length === 0) {
      setCards(prev => prev.map(c => c.uid === uid ? { ...c, flipped: true } : c));
      setSelected([uid]);
      return;
    }

    const firstUid = selected[0];
    const firstCard = cards.find(c => c.uid === firstUid)!;
    const newAttempts = attempts + 1;
    setSelected([]);
    setAttempts(newAttempts);
    setLocked(true);

    if (firstCard.emoji === card.emoji) {
      const updatedCards = cards.map(c =>
        c.uid === firstUid || c.uid === uid ? { ...c, flipped: true, matched: true } : c
      );
      setCards(updatedCards);
      setLocked(false);

      if (updatedCards.every(c => c.matched)) {
        const score = Math.max(100, 1000 - 10 * newAttempts - 2 * elapsed);
        setGameOver(true);
        setCompletion({ time: elapsed, attempts: newAttempts, score });
        saveExerciseScore({
          id: `mem-${Date.now()}`,
          date: new Date().toISOString(),
          gameType: 'memory',
          score,
          duration: elapsed,
        });
        loadHistory();
      }
    } else {
      setCards(prev => prev.map(c => c.uid === uid ? { ...c, flipped: true } : c));
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.uid === firstUid || c.uid === uid ? { ...c, flipped: false } : c
        ));
        setLocked(false);
      }, 1000);
    }
  }, [cards, selected, locked, attempts, elapsed, loadHistory]);

  const handlePlayAgain = () => {
    setCards(createDeck());
    setSelected([]);
    setLocked(false);
    setAttempts(0);
    setElapsed(0);
    setGameOver(false);
    setCompletion(null);
  };

  const chartData = historyScores.map((s, i) => ({ game: i + 1, score: s.score }));

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
        <div style={statPillStyle}>⏱ {elapsed}s</div>
        <div style={statPillStyle}>🎯 {attempts} attempts</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        maxWidth: 380,
        margin: '0 auto',
      }}>
        {cards.map(card => (
          <MemoryCard
            key={card.uid}
            card={card}
            onClick={() => handleCardClick(card.uid)}
            disabled={locked}
          />
        ))}
      </div>

      {gameOver && completion && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'var(--warm-white)',
            borderRadius: 20,
            padding: 32,
            maxWidth: 300,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--foreground)' }}>
              Puzzle Solved!
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <ResultRow label="Time" value={`${completion.time}s`} />
              <ResultRow label="Attempts" value={String(completion.attempts)} />
              <ResultRow label="Score" value={String(completion.score)} highlight />
            </div>
            <button onClick={handlePlayAgain} style={primaryBtnStyle}>
              Play Again
            </button>
          </div>
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
              <YAxis domain={[0, 1000]} tick={{ fontSize: 11, fill: 'var(--gray-mid)' }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--warm-white)',
                  border: '1px solid var(--gray-soft)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [v as number, 'Score']}
              />
              <Bar dataKey="score" fill="var(--green-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function MemoryCard({
  card,
  onClick,
  disabled,
}: {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}) {
  const isRevealed = card.flipped || card.matched;
  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: '1',
        perspective: 600,
        cursor: card.matched || disabled ? 'default' : 'pointer',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Back face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--green-muted) 0%, var(--green-light) 100%)',
            border: '2px solid var(--green-light)',
          }}
        />
        {/* Front face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 12,
            background: card.matched ? 'var(--green-subtle)' : 'var(--warm-white)',
            border: `2px solid ${card.matched ? 'var(--green-primary)' : 'var(--gray-soft)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            transition: 'background 0.3s, border-color 0.3s',
          }}
        >
          {card.emoji}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: highlight ? 'var(--green-subtle)' : 'transparent',
        borderRadius: highlight ? 8 : 0,
        padding: highlight ? '10px 14px' : '4px 0',
        fontSize: 15,
      }}
    >
      <span style={{ color: 'var(--gray-dark)' }}>{label}</span>
      <span
        style={{
          fontWeight: 700,
          color: highlight ? 'var(--green-primary)' : 'var(--foreground)',
          fontSize: highlight ? 20 : 15,
        }}
      >
        {value}
      </span>
    </div>
  );
}

const statPillStyle: React.CSSProperties = {
  background: 'var(--warm-cream)',
  border: '1px solid var(--gray-soft)',
  borderRadius: 20,
  padding: '6px 16px',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--foreground)',
};

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
