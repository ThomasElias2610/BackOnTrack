import { Lightbulb } from 'lucide-react';
import { generateInsights } from '@/lib/insights';
import type { CheckinEntry, ExerciseScore } from '@/lib/types';

interface Props {
  checkins: CheckinEntry[];
  scores: ExerciseScore[];
}

export default function WeeklyInsights({ checkins, scores }: Props) {
  if (checkins.length < 7) return null;

  const insights = generateInsights(checkins, scores);
  if (insights.length === 0) return null;

  return (
    <div
      style={{
        background: '#FFFBEB',
        border: '1px solid #FEF3C7',
        borderRadius: 16,
        padding: '20px',
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--foreground)',
          marginBottom: 16,
          marginTop: 0,
        }}
      >
        Weekly Insights ✨
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((insight, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Lightbulb
              size={18}
              style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                fontSize: 14,
                color: 'var(--foreground)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
