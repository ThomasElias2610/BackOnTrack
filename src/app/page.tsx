"use client";

import Link from "next/link";
import { Heart, Brain, Star } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay },
});

const features = [
  {
    icon: Heart,
    title: "Daily Check-in",
    body: "Track your energy, mood, and brain fog in 30 seconds.",
  },
  {
    icon: Brain,
    title: "Brain Exercises",
    body: "Sharpen your memory with games designed for chemo-brain recovery.",
  },
  {
    icon: Star,
    title: "Life Milestones",
    body: "Celebrate every step back to the life you love.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--warm-white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Hero ── */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px 64px",
          background: "linear-gradient(160deg, var(--green-subtle) 0%, var(--warm-white) 60%)",
        }}
      >
        <motion.h1
          {...fadeUp(0)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "var(--foreground)",
            maxWidth: 720,
            marginBottom: 20,
          }}
        >
          Your companion for life after treatment
        </motion.h1>

        <motion.p
          {...fadeUp(0.1)}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "var(--gray-dark)",
            maxWidth: 560,
            lineHeight: 1.65,
            marginBottom: 40,
          }}
        >
          Track your recovery, train your mind, and celebrate every milestone —
          one day at a time.
        </motion.p>

        <motion.div {...fadeUp(0.2)}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "var(--green-primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 36px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(76,175,80,0.30)",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--green-light)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--green-primary)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* ── My Story ── */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "64px 24px",
          background: "var(--warm-cream)",
        }}
      >
        <motion.div
          {...fadeUp(0.3)}
          style={{
            maxWidth: 680,
            width: "100%",
            background: "#fff",
            borderLeft: "5px solid var(--green-primary)",
            borderRadius: 12,
            padding: "36px 40px",
            boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: 16,
            }}
          >
            Why I Built This
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--gray-dark)",
              lineHeight: 1.75,
            }}
          >
            I was diagnosed with Hodgkin&rsquo;s lymphoma during my final year at the
            University of Haifa. Treatment ended, but the journey didn&rsquo;t —
            brain fog, fatigue, and the challenge of returning to normal life
            were things no app seemed to address. BackOnTrack is what I wished
            I&rsquo;d had.
          </p>
        </motion.div>
      </section>

      {/* ── Feature Cards ── */}
      <section
        style={{
          padding: "64px 24px",
          background: "var(--warm-white)",
        }}
      >
        <motion.h2
          {...fadeUp(0.35)}
          style={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: 40,
          }}
        >
          Everything you need to move forward
        </motion.h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          {features.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              {...fadeUp(0.4 + i * 0.1)}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "32px 28px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                flex: "1 1 260px",
                maxWidth: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 14,
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "default",
              }}
              whileHover={{ y: -6, boxShadow: "0 8px 32px rgba(76,175,80,0.15)" }}
            >
              <div
                style={{
                  background: "var(--green-subtle)",
                  borderRadius: 12,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} color="var(--green-primary)" strokeWidth={2} />
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.93rem",
                  color: "var(--gray-dark)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: "center",
          padding: "28px 24px",
          borderTop: "1px solid var(--gray-soft)",
          background: "var(--warm-cream)",
          color: "var(--gray-mid)",
          fontSize: "0.85rem",
        }}
      >
        Built by a Hodgkin&rsquo;s lymphoma survivor and CS graduate from the
        University of Haifa
      </footer>
    </div>
  );
}
