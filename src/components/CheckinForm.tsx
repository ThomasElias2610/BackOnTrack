'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BatteryLow, Battery, BatteryMedium, BatteryFull, BatteryCharging, Cloud } from 'lucide-react';
import Link from 'next/link';
import { saveCheckin, getCheckins, calculateStreak } from '@/lib/storage';
import type { CheckinEntry } from '@/lib/types';

const TOTAL_STEPS = 4;

const BATTERY_ICONS = [BatteryLow, Battery, BatteryMedium, BatteryFull, BatteryCharging];
const MOODS = ['😊', '😐', '😔', '😤', '😴'];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const transition = { duration: 0.28, ease: 'easeInOut' as const };

export default function CheckinForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [energy, setEnergy] = useState<number | null>(null);
  const [brainFog, setBrainFog] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  function goNext() {
    setDir(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDir(-1);
    setStep((s) => s - 1);
  }

  function canAdvance() {
    if (step === 0) return energy !== null;
    if (step === 1) return brainFog !== null;
    if (step === 2) return mood !== null;
    return true;
  }

  function handleSubmit() {
    const entry: CheckinEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      energy: (energy ?? 3) as CheckinEntry['energy'],
      brainFog: (brainFog ?? 3) as CheckinEntry['brainFog'],
      mood: mood ?? '😊',
      note: note.trim() || undefined,
    };
    saveCheckin(entry);
    const all = getCheckins();
    setStreak(calculateStreak(all));
    setDone(true);
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
          Check-in saved!
        </p>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          🔥 {streak} {streak === 1 ? 'day' : 'days'} in a row!
        </p>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: 'var(--green-primary)',
            color: '#fff',
            borderRadius: '999px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i === step ? 'var(--green-primary)' : 'var(--gray-soft)',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      {/* Animated step content */}
      <div style={{ overflow: 'hidden', position: 'relative', minHeight: 260 }}>
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            style={{ width: '100%' }}
          >
            {step === 0 && (
              <StepEnergy selected={energy} onSelect={setEnergy} />
            )}
            {step === 1 && (
              <StepBrainFog selected={brainFog} onSelect={setBrainFog} />
            )}
            {step === 2 && (
              <StepMood selected={mood} onSelect={setMood} />
            )}
            {step === 3 && (
              <StepNote value={note} onChange={setNote} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '0.75rem' }}>
        {step > 0 ? (
          <button
            onClick={goBack}
            style={{
              flex: '0 0 auto',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: '1.5px solid var(--gray-soft)',
              background: 'transparent',
              color: 'var(--gray-dark)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={goNext}
            disabled={!canAdvance()}
            style={{
              flex: '1 1 auto',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: 'none',
              background: canAdvance() ? 'var(--green-primary)' : 'var(--gray-soft)',
              color: canAdvance() ? '#fff' : 'var(--gray-mid)',
              fontWeight: 600,
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
              fontSize: '0.95rem',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              flex: '1 1 auto',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--green-primary)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Save Check-in
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step sub-components ────────────────────────────────────────────────────────

function StepEnergy({ selected, onSelect }: { selected: number | null; onSelect: (v: number) => void }) {
  return (
    <div>
      <h2 style={questionStyle}>How's your energy today?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        {BATTERY_ICONS.map((Icon, i) => {
          const val = i + 1;
          const active = selected === val;
          return (
            <button
              key={i}
              onClick={() => onSelect(val)}
              style={{
                ...iconBtnBase,
                background: active ? 'var(--green-subtle)' : 'var(--warm-cream)',
                border: `2px solid ${active ? 'var(--green-primary)' : 'var(--gray-soft)'}`,
                color: active ? 'var(--green-primary)' : 'var(--gray-dark)',
              }}
              aria-label={`Energy level ${val}`}
            >
              <Icon size={28} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBrainFog({ selected, onSelect }: { selected: number | null; onSelect: (v: number) => void }) {
  return (
    <div>
      <h2 style={questionStyle}>How's the brain fog?</h2>
      <p style={{ textAlign: 'center', color: 'var(--gray-dark)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
        1 = clear · 5 = very foggy
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.25rem' }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const val = i + 1;
          const filled = selected !== null && val <= selected;
          return (
            <button
              key={i}
              onClick={() => onSelect(val)}
              style={{
                ...iconBtnBase,
                background: filled ? 'var(--green-subtle)' : 'var(--warm-cream)',
                border: `2px solid ${filled ? 'var(--green-primary)' : 'var(--gray-soft)'}`,
                color: filled ? 'var(--green-primary)' : 'var(--gray-dark)',
              }}
              aria-label={`Brain fog level ${val}`}
            >
              <Cloud size={26} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepMood({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 style={questionStyle}>How are you feeling?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {MOODS.map((emoji) => {
          const active = selected === emoji;
          return (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                border: `3px solid ${active ? 'var(--green-primary)' : 'transparent'}`,
                background: active ? 'var(--green-subtle)' : 'var(--warm-cream)',
                fontSize: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.15s, background 0.15s',
                outline: 'none',
              }}
              aria-label={emoji}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepNote({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 style={questionStyle}>Anything to note?</h2>
      <p style={{ textAlign: 'center', color: 'var(--gray-dark)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
        Optional
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. slept well, headache..."
        style={{
          display: 'block',
          width: '100%',
          marginTop: '1.5rem',
          padding: '0.875rem 1rem',
          borderRadius: '12px',
          border: '1.5px solid var(--gray-soft)',
          background: 'var(--warm-cream)',
          color: 'var(--foreground)',
          fontSize: '1rem',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const questionStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  margin: 0,
};

const iconBtnBase: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.15s, background 0.15s, color 0.15s',
  outline: 'none',
  padding: 0,
};
