"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// ============================================================================
// MOON PHASE CALCULATOR
// ============================================================================

function getMoonPhase(): { phase: string; emoji: string; illumination: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Calculate moon phase using a simplified algorithm
  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }

  jd = Math.floor(365.25 * c) + Math.floor(30.6001 * (e + 1)) + day - 694039.09;
  jd /= 29.5305882;
  b = Math.floor(jd);
  jd -= b;
  b = Math.round(jd * 8);

  if (b >= 8) b = 0;

  const phases = [
    { phase: "New Moon", emoji: "🌑", illumination: 0 },
    { phase: "Waxing Crescent", emoji: "🌒", illumination: 12.5 },
    { phase: "First Quarter", emoji: "🌓", illumination: 25 },
    { phase: "Waxing Gibbous", emoji: "🌔", illumination: 37.5 },
    { phase: "Full Moon", emoji: "🌕", illumination: 50 },
    { phase: "Waning Gibbous", emoji: "🌖", illumination: 62.5 },
    { phase: "Last Quarter", emoji: "🌗", illumination: 75 },
    { phase: "Waning Crescent", emoji: "🌘", illumination: 87.5 },
  ];

  return phases[b];
}

// ============================================================================
// MOON PHASE INDICATOR COMPONENT
// ============================================================================

export function MoonPhaseIndicator() {
  const [mounted, setMounted] = useState(false);
  const [moonData, setMoonData] = useState<{
    phase: string;
    emoji: string;
    illumination: number;
  } | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setMoonData(getMoonPhase());
  }, []);

  // Prevent hydration mismatch
  if (!mounted || !moonData) return null;

  return (
    <motion.div
      className="flex items-center gap-2 text-muted-foreground"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <span className="text-lg" title={moonData.phase}>
        {moonData.emoji}
      </span>
      <span className="text-xs font-mono">
        {moonData.phase}
      </span>
      {resolvedTheme === "dark" && (
        <motion.div
          className="w-1 h-1 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// FLOATING SATELLITE
// ============================================================================

export function FloatingSatellite() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Show satellite periodically
    const showSatellite = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 8000);
    };

    // Initial delay
    const initialTimeout = setTimeout(showSatellite, 5000);

    // Periodic appearances
    const interval = setInterval(showSatellite, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted || !isVisible || resolvedTheme !== "dark") return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      initial={{ left: "-5%", top: "15%" }}
      animate={{ left: "105%", top: "25%" }}
      transition={{ duration: 8, ease: "linear" }}
    >
      <span className="text-xl opacity-60">🛰️</span>
    </motion.div>
  );
}

// ============================================================================
// STAR SPARKLE DECORATION
// ============================================================================

export function StarSparkle({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      ✦
    </motion.span>
  );
}

// ============================================================================
// ORBITAL RING ANIMATION
// ============================================================================

export function OrbitalRing({
  size = 100,
  duration = 10,
  className,
}: {
  size?: number;
  duration?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        border: "1px solid var(--primary)",
        borderRadius: "50%",
        opacity: 0.2,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Orbiting dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-primary"
        style={{
          top: -4,
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 0 8px var(--primary)",
        }}
      />
    </motion.div>
  );
}

// ============================================================================
// CONSTELLATION PATTERN - Fixed for hydration
// ============================================================================

export function ConstellationPattern({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - render nothing until mounted
  if (!mounted) return null;
  if (resolvedTheme !== "dark") return null;

  // Simple constellation points
  const stars = [
    { x: 10, y: 20 },
    { x: 30, y: 10 },
    { x: 50, y: 25 },
    { x: 70, y: 15 },
    { x: 85, y: 30 },
  ];

  return (
    <svg
      className={`absolute opacity-20 pointer-events-none ${className}`}
      width="100"
      height="40"
      viewBox="0 0 100 40"
    >
      {/* Lines connecting stars */}
      {stars.slice(0, -1).map((star, i) => (
        <motion.line
          key={i}
          x1={star.x}
          y1={star.y}
          x2={stars[i + 1].x}
          y2={stars[i + 1].y}
          stroke="var(--primary)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: i * 0.3 }}
        />
      ))}
      {/* Star points */}
      {stars.map((star, i) => (
        <motion.circle
          key={i}
          cx={star.x}
          cy={star.y}
          r="2"
          fill="var(--primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// SHOOTING STARS - Random meteors streaking across the screen
// ============================================================================

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
  delay: number;
  size: number;
}

export function ShootingStars() {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const createShootingStar = () => {
      const newStar: ShootingStar = {
        id: Date.now() + Math.random(),
        // Start from top or right edge
        startX: Math.random() > 0.5 ? Math.random() * 100 : 80 + Math.random() * 20,
        startY: Math.random() > 0.5 ? Math.random() * 30 : Math.random() * 50,
        // Angle between 200-250 degrees (moving down-left)
        angle: 200 + Math.random() * 50,
        duration: 0.8 + Math.random() * 0.6,
        delay: 0,
        size: 2 + Math.random() * 2,
      };

      setStars((prev) => [...prev.slice(-4), newStar]);

      // Clean up old stars
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, (newStar.duration + 0.5) * 1000);
    };

    // Create shooting stars at random intervals (every 3-8 seconds)
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        createShootingStar();
        timeoutId = scheduleNext();
      }, delay);
    };

    // Initial star after 2 seconds
    let timeoutId = setTimeout(() => {
      createShootingStar();
      timeoutId = scheduleNext();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {stars.map((star) => {
        const angleRad = (star.angle * Math.PI) / 180;
        const distance = 150; // vw units traveled
        const endX = star.startX + Math.cos(angleRad) * distance;
        const endY = star.startY - Math.sin(angleRad) * distance;

        return (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: `${(endX - star.startX)}vw`,
              y: `${(endY - star.startY)}vh`,
            }}
            transition={{
              duration: star.duration,
              ease: "linear",
              opacity: {
                times: [0, 0.1, 0.7, 1],
                duration: star.duration,
              },
            }}
          >
            {/* The meteor head */}
            <div
              className="rounded-full"
              style={{
                width: star.size,
                height: star.size,
                backgroundColor: isDark ? "#fff" : "#1a1a1a",
                boxShadow: isDark
                  ? `
                    0 0 ${star.size * 2}px #fff,
                    0 0 ${star.size * 4}px #00f3ff,
                    0 0 ${star.size * 6}px #bc13fe
                  `
                  : `
                    0 0 ${star.size * 2}px rgba(0,0,0,0.4),
                    0 0 ${star.size * 4}px rgba(0,0,0,0.2)
                  `,
              }}
            />
            {/* The tail */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                right: star.size,
                width: 60 + star.size * 10,
                height: 1,
                background: isDark
                  ? `linear-gradient(to left, 
                      rgba(255,255,255,0.8), 
                      rgba(0,243,255,0.5) 30%, 
                      rgba(188,19,254,0.3) 60%,
                      transparent
                    )`
                  : `linear-gradient(to left, 
                      rgba(26,26,26,0.8), 
                      rgba(60,60,60,0.5) 30%, 
                      rgba(100,100,100,0.2) 60%,
                      transparent
                    )`,
                transform: `translateY(-50%) rotate(${180 - star.angle}deg)`,
                transformOrigin: 'right center',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
