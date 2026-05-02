'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CheckinEntry } from '@/lib/types';

type TimeRange = '7' | '30' | 'all';

interface Props {
  checkins: CheckinEntry[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDayLabel(dateStr: string): string {
  return DAY_LABELS[new Date(dateStr).getDay()];
}

const RANGE_BUTTONS: { label: string; value: TimeRange }[] = [
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: 'All time', value: 'all' },
];

export default function MoodChart({ checkins }: Props) {
  const [range, setRange] = useState<TimeRange>('7');

  const data = useMemo(() => {
    const sorted = [...checkins].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sliced = range === 'all' ? sorted : sorted.slice(-(Number(range)));
    return sliced.map((c) => ({
      date: toDayLabel(c.date),
      energy: c.energy,
      brainFog: c.brainFog,
    }));
  }, [checkins, range]);

  return (
    <div
      style={{
        background: 'var(--warm-white)',
        border: '1px solid var(--gray-soft)',
        borderRadius: 16,
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {RANGE_BUTTONS.map((b) => (
          <button
            key={b.value}
            onClick={() => setRange(b.value)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1px solid var(--gray-soft)',
              background: range === b.value ? 'var(--green-primary)' : 'var(--warm-cream)',
              color: range === b.value ? '#fff' : 'var(--foreground)',
              fontSize: 13,
              fontWeight: range === b.value ? 600 : 400,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gray-mid)',
            fontSize: 15,
            textAlign: 'center',
          }}
        >
          No check-in data yet — start your first check-in!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-soft)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--gray-dark)' }} />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12, fill: 'var(--gray-dark)' }}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--warm-white)',
                border: '1px solid var(--gray-soft)',
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="energy"
              name="Energy"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 4, fill: '#4CAF50' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="brainFog"
              name="Brain Fog"
              stroke="#78909C"
              strokeWidth={2}
              dot={{ r: 4, fill: '#78909C' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
