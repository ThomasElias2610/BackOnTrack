'use client';

import { useState, useEffect } from 'react';
import { getMilestones, saveMilestones } from '@/lib/storage';
import { DEFAULT_MILESTONES } from '@/lib/data';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import type { Milestone } from '@/lib/types';

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const stored = getMilestones();
    if (stored.length === 0) {
      saveMilestones(DEFAULT_MILESTONES);
      setMilestones(DEFAULT_MILESTONES);
    } else {
      setMilestones(stored);
    }
  }, []);

  const handleComplete = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setMilestones((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, completed: true, completedDate: today } : m
      );
      saveMilestones(updated);
      return updated;
    });
  };

  const handleAddMilestone = (milestone: Milestone) => {
    setMilestones((prev) => [...prev, milestone]);
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const total = milestones.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div
      style={{
        padding: '24px 16px 100px',
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>
          Your Milestones
        </h1>
        <p style={{ fontSize: 15, color: 'var(--gray-dark)', margin: 0 }}>
          Every step forward matters
        </p>
      </div>

      {/* Progress summary card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)',
          border: '1px solid #FFE082',
          borderRadius: 16,
          padding: '18px 20px',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: '#E65100', marginBottom: 10 }}>
          {completedCount} of {total} milestones reached 🌟
        </div>
        <div
          style={{
            height: 7,
            borderRadius: 4,
            background: '#FFE082',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'var(--green-primary)',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <MilestoneTimeline
        milestones={milestones}
        onComplete={handleComplete}
        onAddMilestone={handleAddMilestone}
      />
    </div>
  );
}
