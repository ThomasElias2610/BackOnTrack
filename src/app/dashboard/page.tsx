'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCheckins, getExerciseScores, calculateStreak } from '@/lib/storage';
import type { CheckinEntry, ExerciseScore } from '@/lib/types';
import MoodChart from '@/components/MoodChart';
import WeeklyInsights from '@/components/WeeklyInsights';
import ExportPDF from '@/components/ExportPDF';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--warm-cream)',
        border: '1px solid var(--warm-sand)',
        borderRadius: 12,
        padding: '14px 10px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--foreground)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--gray-dark)',
          marginTop: 6,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [checkins, setCheckins] = useState<CheckinEntry[]>([]);
  const [scores, setScores] = useState<ExerciseScore[]>([]);

  useEffect(() => {
    setCheckins(getCheckins());
    setScores(getExerciseScores());
  }, []);

  const streak = calculateStreak(checkins);

  const today = new Date().toISOString().slice(0, 10);
  const todayCheckin = checkins.find((c) => c.date.slice(0, 10) === today);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thisWeekCheckins = checkins.filter(
    (c) => new Date(c.date) >= sevenDaysAgo
  );
  const avgEnergyThisWeek =
    thisWeekCheckins.length > 0
      ? thisWeekCheckins.reduce((s, c) => s + c.energy, 0) / thisWeekCheckins.length
      : null;

  const exerciseSessions = scores.filter(
    (s) => new Date(s.date) >= sevenDaysAgo
  ).length;

  return (
    <div
      style={{
        padding: '24px 16px 32px',
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--foreground)',
          margin: 0,
        }}
      >
        Dashboard
      </h1>

      {/* Streak */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
          border: '1px solid #FFCC80',
          borderRadius: 16,
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#E65100',
            lineHeight: 1,
          }}
        >
          🔥 {streak} day streak
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#BF360C',
            marginTop: 6,
          }}
        >
          {streak === 0
            ? 'Check in today to start your streak!'
            : streak === 1
            ? 'Great start — come back tomorrow!'
            : 'Keep the momentum going!'}
        </div>
      </div>

      {/* Today's check-in status */}
      {todayCheckin ? (
        <div
          style={{
            background: 'var(--green-subtle)',
            border: '1px solid var(--green-muted)',
            borderRadius: 16,
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--gray-dark)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Today
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--green-primary)',
                  lineHeight: 1,
                }}
              >
                {todayCheckin.energy}
              </div>
              <div
                style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4 }}
              >
                Energy
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#78909C',
                  lineHeight: 1,
                }}
              >
                {todayCheckin.brainFog}
              </div>
              <div
                style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4 }}
              >
                Brain Fog
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{todayCheckin.mood}</div>
              <div
                style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4 }}
              >
                Mood
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--warm-cream)',
            border: '1px solid var(--warm-sand)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 14, color: 'var(--gray-dark)' }}>
            You haven&apos;t checked in today yet
          </span>
          <Link
            href="/checkin"
            style={{
              background: 'var(--green-primary)',
              color: '#fff',
              padding: '9px 18px',
              borderRadius: 20,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Check in now →
          </Link>
        </div>
      )}

      {/* Quick stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        <StatCard label="Total Check-ins" value={String(checkins.length)} />
        <StatCard
          label="Avg Energy This Week"
          value={avgEnergyThisWeek !== null ? avgEnergyThisWeek.toFixed(1) : '—'}
        />
        <StatCard
          label="Exercise Sessions This Week"
          value={String(exerciseSessions)}
        />
      </div>

      {/* Chart */}
      <MoodChart checkins={checkins} />

      {/* Insights */}
      <WeeklyInsights checkins={checkins} scores={scores} />

      {/* Export */}
      <ExportPDF checkins={checkins} />
    </div>
  );
}
