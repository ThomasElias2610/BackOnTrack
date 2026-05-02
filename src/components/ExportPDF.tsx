'use client';

import type { CheckinEntry } from '@/lib/types';

interface Props {
  checkins: CheckinEntry[];
}

const MOOD_LABELS: Record<string, string> = {
  '😊': 'Happy',
  '😐': 'Neutral',
  '😔': 'Low',
  '😤': 'Frustrated',
  '😴': 'Tired',
};

export default function ExportPDF({ checkins }: Props) {
  async function handleExport() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const margin = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - margin * 2;

    // Last 7 check-ins, oldest first
    const sorted = [...checkins]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse();

    // ── Title ──────────────────────────────────────────────────────────────
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 45, 45);
    doc.text('BackOnTrack Health Summary', margin, 30);

    // ── Date range ─────────────────────────────────────────────────────────
    let dateRangeText = 'No data recorded yet';
    if (sorted.length > 0) {
      const fmt = (s: string) =>
        new Date(s).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      dateRangeText = `Date Range: ${fmt(sorted[0].date)} – ${fmt(sorted[sorted.length - 1].date)}`;
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 103, 98);
    doc.text(dateRangeText, margin, 41);

    // ── Section heading ────────────────────────────────────────────────────
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 45, 45);
    doc.text('Last 7 Days Check-in Summary', margin, 56);

    // ── Table ──────────────────────────────────────────────────────────────
    const tableTop = 63;
    const rowH = 9;
    const colWidths = [62, 28, 28, 52]; // Date, Energy, Brain Fog, Mood
    const headers = ['Date', 'Energy', 'Brain Fog', 'Mood'];

    // Header row background
    doc.setFillColor(241, 248, 241);
    doc.rect(margin, tableTop, contentWidth, rowH, 'F');

    // Header text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 45, 45);
    let x = margin + 3;
    headers.forEach((h, i) => {
      doc.text(h, x, tableTop + 6);
      x += colWidths[i];
    });

    // Header bottom border
    doc.setDrawColor(200, 230, 201);
    doc.setLineWidth(0.4);
    doc.line(margin, tableTop + rowH, margin + contentWidth, tableTop + rowH);

    // Data rows
    doc.setFont('helvetica', 'normal');

    if (sorted.length === 0) {
      doc.setTextColor(176, 171, 163);
      doc.text('No check-in data available', margin + 3, tableTop + rowH + 6);
    } else {
      sorted.forEach((c, idx) => {
        const rowTop = tableTop + rowH + idx * rowH;

        // Alternating stripe
        if (idx % 2 === 1) {
          doc.setFillColor(250, 247, 242);
          doc.rect(margin, rowTop, contentWidth, rowH, 'F');
        }

        // Row separator
        doc.setDrawColor(232, 229, 224);
        doc.setLineWidth(0.2);
        doc.line(margin, rowTop + rowH, margin + contentWidth, rowTop + rowH);

        const dateLabel = new Date(c.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        const cells = [
          dateLabel,
          `${c.energy} / 5`,
          `${c.brainFog} / 5`,
          MOOD_LABELS[c.mood] ?? c.mood,
        ];

        doc.setTextColor(45, 45, 45);
        let cx = margin + 3;
        cells.forEach((cell, i) => {
          doc.text(cell, cx, rowTop + 6);
          cx += colWidths[i];
        });
      });
    }

    // ── Footer ─────────────────────────────────────────────────────────────
    const todayLabel = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(176, 171, 163);
    doc.text(`Generated on ${todayLabel} · BackOnTrack`, margin, pageHeight - 12);

    doc.save('backontrack-health-summary.pdf');
  }

  return (
    <button
      onClick={handleExport}
      style={{
        width: '100%',
        padding: '14px',
        borderRadius: 12,
        border: '1px solid var(--gray-soft)',
        background: 'var(--warm-cream)',
        color: 'var(--foreground)',
        fontSize: 15,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = 'var(--warm-sand)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = 'var(--warm-cream)')
      }
    >
      Export for my doctor 📄
    </button>
  );
}
