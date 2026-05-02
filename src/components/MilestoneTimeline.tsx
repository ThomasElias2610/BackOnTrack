'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MilestoneCard from './MilestoneCard';
import { saveMilestones } from '@/lib/storage';
import type { Milestone } from '@/lib/types';

const PARTICLE_COLORS = [
  '#4CAF50', '#81C784', '#FFB74D', '#64B5F6',
  '#F48FB1', '#CE93D8', '#80CBC4', '#A5D6A7',
];

function ParticleBurst() {
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    return {
      x: Math.cos(angle) * 60,
      y: Math.sin(angle) * 60,
      color: PARTICLE_COLORS[i],
    };
  });

  return (
    // zero-size anchor at circle center: 16px card-padding + 12px half-circle = 28px from left, 26px from top
    <div
      style={{
        position: 'absolute',
        top: 26,
        left: 28,
        width: 0,
        height: 0,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: i * 0.02 }}
          style={{
            position: 'absolute',
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: p.color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  milestones: Milestone[];
  onComplete: (id: string) => void;
  onAddMilestone?: (milestone: Milestone) => void;
}

export default function MilestoneTimeline({ milestones, onComplete, onAddMilestone }: Props) {
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleComplete = (id: string) => {
    onComplete(id);
    setJustCompletedId(id);
    setTimeout(() => setJustCompletedId(null), 1000);
  };

  const handleSaveCustom = () => {
    if (!newTitle.trim()) return;
    const milestone: Milestone = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      isCustom: true,
      order: milestones.length + 1,
    };
    saveMilestones([...milestones, milestone]);
    onAddMilestone?.(milestone);
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical connector line */}
      <div
        style={{
          position: 'absolute',
          left: 43, // card padding(16) + circle-center(12) + timeline-left-offset(15)
          top: 38,
          bottom: showAddForm ? 260 : 96,
          width: 2,
          background: 'var(--gray-soft)',
          zIndex: 0,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {milestones.map((m) => (
          <div key={m.id} style={{ position: 'relative', zIndex: 1, paddingLeft: 15 }}>
            <MilestoneCard milestone={m} onComplete={handleComplete} />
            <AnimatePresence>
              {justCompletedId === m.id && (
                <motion.div
                  key="burst"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: 0.85 }}
                >
                  <ParticleBurst />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Add Custom Milestone */}
      <div style={{ marginTop: 16, paddingLeft: 15 }}>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              background: 'var(--warm-cream)',
              border: '1.5px dashed var(--gray-mid)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 14,
              color: 'var(--gray-dark)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, color: 'var(--gray-dark)' }}>+</span>
            Add Custom Milestone
          </button>
        ) : (
          <div
            style={{
              background: 'var(--warm-cream)',
              border: '1px solid var(--warm-sand)',
              borderRadius: 12,
              padding: '16px',
            }}
          >
            <input
              type="text"
              placeholder="Milestone title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCustom()}
              autoFocus
              style={{
                width: '100%',
                border: '1px solid var(--warm-sand)',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 14,
                color: 'var(--foreground)',
                background: 'var(--warm-white)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 8,
              }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--warm-sand)',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 14,
                color: 'var(--foreground)',
                background: 'var(--warm-white)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleSaveCustom}
                disabled={!newTitle.trim()}
                style={{
                  background: newTitle.trim() ? 'var(--green-primary)' : 'var(--gray-soft)',
                  color: newTitle.trim() ? '#fff' : 'var(--gray-mid)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewTitle(''); setNewDescription(''); }}
                style={{
                  background: 'transparent',
                  color: 'var(--gray-dark)',
                  border: '1px solid var(--warm-sand)',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
