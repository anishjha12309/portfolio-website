"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Rocket, Star, Sparkles } from "lucide-react";
import { getCosmicEvents, getRandomCosmicFact, getNearEarthObjects } from "@/lib/nasa-api";

// ============================================================================
// TYPES
// ============================================================================

interface CosmicNotification {
  id: string;
  type: "meteor_shower" | "planetary_event" | "eclipse" | "space_milestone" | "fun_fact" | "asteroid_alert";
  title: string;
  message: string;
  emoji: string;
  importance: "low" | "medium" | "high";
}

// ============================================================================
// COSMIC TOAST COMPONENT
// ============================================================================

function CosmicToast({
  notification,
  onDismiss,
}: {
  notification: CosmicNotification;
  onDismiss: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Auto-dismiss after 8 seconds for low importance, 12 for others
  useEffect(() => {
    const timeout = setTimeout(
      onDismiss,
      notification.importance === "low" ? 8000 : 12000
    );
    return () => clearTimeout(timeout);
  }, [notification.importance, onDismiss]);

  const importanceColors = {
    low: isDark
      ? "border-cyan-500/30 bg-cyan-950/80"
      : "border-cyan-400/50 bg-cyan-50/90",
    medium: isDark
      ? "border-purple-500/30 bg-purple-950/80"
      : "border-purple-400/50 bg-purple-50/90",
    high: isDark
      ? "border-amber-500/40 bg-amber-950/80"
      : "border-amber-400/50 bg-amber-50/90",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        relative max-w-sm w-full rounded-lg border backdrop-blur-md
        shadow-xl overflow-hidden
        ${importanceColors[notification.importance]}
      `}
    >
      {/* Animated background glow for high importance */}
      {notification.importance === "high" && (
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Emoji icon */}
          <motion.span
            className="text-2xl flex-shrink-0"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {notification.emoji}
          </motion.span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm truncate">
                {notification.title}
              </span>
              {notification.importance === "high" && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </motion.span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Progress bar for auto-dismiss */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{
            duration: notification.importance === "low" ? 8 : 12,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}

// ============================================================================
// COSMIC NOTIFICATIONS CONTAINER
// ============================================================================

export function CosmicNotifications() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<CosmicNotification[]>([]);
  const [hasShownInitial, setHasShownInitial] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show initial notifications after mount
  useEffect(() => {
    if (!mounted || hasShownInitial) return;

    const showInitialNotifications = async () => {
      // Check for special cosmic events today
      const events = await getCosmicEvents();
      
      // Check for near-earth asteroids
      const neoData = await getNearEarthObjects();

      const newNotifications: CosmicNotification[] = [];

      // Add any cosmic events
      events.forEach((event, index) => {
        setTimeout(() => {
          setNotifications((prev) => [
            ...prev,
            {
              id: `event-${Date.now()}-${index}`,
              ...event,
            },
          ]);
        }, index * 3000 + 2000); // Stagger notifications
      });

      // Add asteroid alert if there are hazardous ones nearby
      if (neoData && neoData.hazardousCount > 0) {
        setTimeout(() => {
          setNotifications((prev) => [
            ...prev,
            {
              id: `neo-${Date.now()}`,
              type: "asteroid_alert",
              title: "Space Watch",
              message: `${neoData.count} asteroids passing Earth today, ${neoData.hazardousCount} potentially hazardous! 🔭`,
              emoji: "☄️",
              importance: "medium",
            },
          ]);
        }, events.length * 3000 + 4000);
      }

      // If no events, show a random cosmic fact after a delay
      if (events.length === 0 && (!neoData || neoData.hazardousCount === 0)) {
        setTimeout(async () => {
          const fact = await getRandomCosmicFact();
          setNotifications((prev) => [
            ...prev,
            {
              id: `fact-${Date.now()}`,
              ...fact,
            },
          ]);
        }, 5000);
      }

      setHasShownInitial(true);
    };

    showInitialNotifications();
  }, [mounted, hasShownInitial]);

  // Periodically show random cosmic facts
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      // 30% chance to show a fact every 2 minutes
      if (Math.random() < 0.3) {
        const fact = await getRandomCosmicFact();
        setNotifications((prev) => {
          // Don't stack more than 2 notifications
          if (prev.length >= 2) return prev;
          return [
            ...prev,
            {
              id: `fact-${Date.now()}`,
              ...fact,
            },
          ];
        });
      }
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  }, [mounted]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <CosmicToast
              notification={notification}
              onDismiss={() => dismissNotification(notification.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// LAUNCH NOTIFICATION HOOK (for manual triggering)
// ============================================================================

export function useCosmicNotification() {
  const [notifications, setNotifications] = useState<CosmicNotification[]>([]);

  const showNotification = (notification: Omit<CosmicNotification, "id">) => {
    setNotifications((prev) => [
      ...prev,
      {
        ...notification,
        id: `manual-${Date.now()}`,
      },
    ]);
  };

  const showRandomFact = async () => {
    const fact = await getRandomCosmicFact();
    showNotification(fact);
  };

  return { notifications, showNotification, showRandomFact };
}
