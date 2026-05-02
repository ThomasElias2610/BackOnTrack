'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { Milestone } from '@/lib/types';

interface Props {
  milestone: Milestone;
  onComplete: (id: string) => void;
}

export default function MilestoneCard({ milestone, onComplete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const prevCompleted = useRef(milestone.completed);

  useEffect(() => {
    if (milestone.completed && !prevCompleted.current) {
      setGlowing(true);
      const t = setTimeout(() => setGlowing(false), 800);
      return () => clearTimeout(t);
    }
    prevCompleted.current = milestone.completed;
  }, [milestone.completed]);

  return (
    <div>
      <motion.div
        onClick={() => { if (!milestone.completed) setShowConfirm(true); }}
        animate={
          glowing
            ? {
                scale: [1, 1.03, 1],
                boxShadow: [
                  '0 0 0px rgba(76,175,80,0)',
                  '0 0 22px rgba(76,175,80,0.55)',
                  '0 0 0px rgba(76,175,80,0)',
                ],
              }
            : { scale: 1, boxShadow: '0 0 0px rgba(76,175,80,0)' }
        }
        transition={{ duration: 0.65 }}
        style={{
          background: milestone.completed ? 'var(--green-subtle)' : 'transparent',
          border: milestone.completed
            ? '1px solid var(--green-muted)'
            : '1.5px dashed var(--gray-soft)',
          borderRadius: 12,
          padding: '14px 16px',
          cursor: milestone.completed ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={
              milestone.completed
                ? {
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--green-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }
                : {
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid var(--gray-mid)',
                    background: 'transparent',
                    flexShrink: 0,
                  }
            }
          >
            {milestone.completed && (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5L5 9.5L11 3.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <span
            style={{
              fontSize: 15,
              fontWeight: milestone.completed ? 700 : 400,
              color: milestone.completed ? 'var(--foreground)' : 'var(--gray-mid)',
              lineHeight: 1.35,
            }}
          >
            {milestone.title}
          </span>
        </div>

        {milestone.description && (
          <div
            style={{
              fontSize: 13,
              color: milestone.completed ? 'var(--gray-dark)' : 'var(--gray-mid)',
              paddingLeft: 36,
              lineHeight: 1.4,
            }}
          >
            {milestone.description}
          </div>
        )}

        {milestone.completed && milestone.completedDate && (
          <div style={{ fontSize: 12, color: 'var(--gray-dark)', paddingLeft: 36 }}>
            Completed{' '}
            {new Date(milestone.completedDate + 'T12:00:00').toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}
      </motion.div>

      {showConfirm && createPortal(
        <div
          onClick={() => setShowConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--warm-white)',
              border: '1px solid var(--warm-sand)',
              borderRadius: 16,
              padding: '24px 28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              minWidth: 280,
            }}
          >
            <p style={{ margin: '0 0 18px', fontSize: 15, color: 'var(--foreground)', fontWeight: 500 }}>
              Mark this milestone as complete?
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setShowConfirm(false); onComplete(milestone.id); }}
                style={{
                  background: 'var(--green-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  background: 'var(--warm-cream)',
                  color: 'var(--gray-dark)',
                  border: '1px solid var(--warm-sand)',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
