'use client';

import { useState } from 'react';
import { Brain, Type } from 'lucide-react';
import MemoryGame from '@/components/MemoryGame';
import WordRecall from '@/components/WordRecall';

type GameId = 'memory' | 'wordrecall';

const GAMES: Array<{
  id: GameId;
  title: string;
  Icon: React.ComponentType<{ size?: number | string; color?: string }>;
  description: string;
}> = [
  {
    id: 'memory',
    title: 'Memory Cards',
    Icon: Brain,
    description: 'Match pairs of cards. Tests visual memory and concentration.',
  },
  {
    id: 'wordrecall',
    title: 'Word Recall',
    Icon: Type,
    description: 'Remember and recall words. Tests short-term verbal memory.',
  },
];

export default function ExercisesPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        paddingBottom: 80,
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>
            Brain Exercises
          </h1>
          <p style={{ fontSize: 15, color: 'var(--gray-dark)' }}>
            Keep your mind sharp — play a game
          </p>
        </div>

        {/* Game selector cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 28,
          }}
        >
          {GAMES.map(({ id, title, Icon, description }) => (
            <GameCard
              key={id}
              title={title}
              Icon={Icon}
              description={description}
              active={activeGame === id}
              onClick={() => setActiveGame(id)}
            />
          ))}
        </div>

        {/* Active game panel */}
        {activeGame !== null && (
          <div>
            <button
              onClick={() => setActiveGame(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--green-primary)',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
                padding: '0 0 18px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ← Back to games
            </button>

            <div
              style={{
                background: 'var(--warm-white)',
                border: '1px solid var(--gray-soft)',
                borderRadius: 16,
                padding: '24px 16px',
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 20,
                  textAlign: 'center',
                  color: 'var(--foreground)',
                }}
              >
                {GAMES.find(g => g.id === activeGame)?.title}
              </h2>

              {activeGame === 'memory' && <MemoryGame />}
              {activeGame === 'wordrecall' && <WordRecall />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({
  title,
  Icon,
  description,
  active,
  onClick,
}: {
  title: string;
  Icon: React.ComponentType<{ size?: number | string; color?: string }>;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--green-subtle)' : 'var(--warm-white)',
        border: `1.5px solid ${active ? 'var(--green-primary)' : 'var(--gray-soft)'}`,
        borderRadius: 16,
        padding: '22px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s, background 0.15s, border-color 0.15s',
        boxShadow: active ? '0 2px 12px rgba(76,175,80,0.15)' : 'none',
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLButtonElement).style.transform = 'none';
        }
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: active ? 'var(--green-muted)' : 'var(--green-subtle)',
          border: '1px solid var(--green-muted)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Icon size={22} color="var(--green-primary)" />
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--foreground)' }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--gray-dark)', lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </button>
  );
}
