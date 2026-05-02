'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Star } from 'lucide-react';
import { getOnboardingComplete, setOnboardingComplete } from '@/lib/storage';

const slideVariants = {
  enter: (d: number) => ({ x: d * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -48, opacity: 0 }),
};

const FEATURES = [
  {
    Icon: Heart,
    title: 'Daily Check-in',
    sub: 'track energy, mood and brain fog in 30 seconds',
    color: '#E53935',
    bg: '#FFEBEE',
  },
  {
    Icon: Brain,
    title: 'Brain Exercises',
    sub: 'sharpen your memory with chemo-brain games',
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
  {
    Icon: Star,
    title: 'Life Milestones',
    sub: 'celebrate every step back to normal life',
    color: '#E65100',
    bg: '#FFF3E0',
  },
];

function StepDots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current ? 'var(--green-primary)' : '#E0E0E0',
            transition: 'width 0.2s ease, background 0.2s ease',
          }}
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (!getOnboardingComplete()) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const advance = () => {
    setDir(1);
    setStep((s) => s + 1);
  };

  const finish = () => {
    setOnboardingComplete();
    setShow(false);
    router.push('/checkin');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '36px 28px 28px',
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div
              key="s0"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <div style={{ textAlign: 'center', paddingBottom: 8 }}>
                <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 20 }}>🌱</div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    margin: '0 0 14px',
                    lineHeight: 1.25,
                  }}
                >
                  Welcome to BackOnTrack
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--gray-dark)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Your companion for life after treatment. Track your recovery, one day at a time.
                </p>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  margin: '0 0 22px',
                }}
              >
                Here&apos;s what you can do
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {FEATURES.map(({ Icon, title, sub, color, bg }) => (
                  <div
                    key={title}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={color} />
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--foreground)',
                          marginBottom: 3,
                        }}
                      >
                        {title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-dark)', lineHeight: 1.5 }}>
                        {sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <div style={{ textAlign: 'center', paddingBottom: 4 }}>
                <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 20 }}>✨</div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    margin: '0 0 12px',
                    lineHeight: 1.3,
                  }}
                >
                  Let&apos;s start with your first check-in
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--gray-dark)',
                    lineHeight: 1.6,
                    margin: '0 0 28px',
                  }}
                >
                  It only takes 30 seconds and helps you see how you&apos;re feeling over time.
                </p>
                <button
                  onClick={finish}
                  style={{
                    background: 'var(--green-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 24,
                    padding: '15px 28px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    letterSpacing: '0.01em',
                  }}
                >
                  Start my first check-in →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: dots + next (steps 0–1), dots only centred on step 2 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: step < 2 ? 'space-between' : 'center',
            marginTop: 28,
          }}
        >
          <StepDots current={step} />
          {step < 2 && (
            <button
              onClick={advance}
              style={{
                background: 'var(--green-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '10px 22px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
