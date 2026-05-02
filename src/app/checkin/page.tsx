'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import CheckinForm from '@/components/CheckinForm';
import { getCheckins } from '@/lib/storage';

export default function CheckinPage() {
  const alreadyCheckedIn = useMemo(() => {
    const checkins = getCheckins();
    const today = new Date().toISOString().slice(0, 10);
    return checkins.some((c) => c.date.slice(0, 10) === today);
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2rem 1rem' }}>
      <h1
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '1.5rem',
        }}
      >
        Daily Check-in
      </h1>

      {alreadyCheckedIn ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem' }}>
            You've already checked in today! 🎉
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
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <CheckinForm />
      )}
    </main>
  );
}
