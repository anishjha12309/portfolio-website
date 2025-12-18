"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Trophy, Target, Clock, X } from "lucide-react";

const GAME_DURATION = 30; // seconds
const BEST_SCORE_KEY = "asteroid-destroyer-best-score";

export function AsteroidGame() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load best score from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, []);

  // Listen for asteroid destroy events
  useEffect(() => {
    const handleAsteroidDestroyed = () => {
      if (isPlaying) {
        setCurrentScore((prev) => prev + 1);
      }
    };

    window.addEventListener("asteroid-destroyed", handleAsteroidDestroyed);
    return () => {
      window.removeEventListener("asteroid-destroyed", handleAsteroidDestroyed);
    };
  }, [isPlaying]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Game over
          setIsPlaying(false);
          setShowGameOver(true);
          
          // Dispatch event after state update completes
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("game-state-changed", { detail: { isPlaying: false } }));
            }
          }, 0);
          
          // Check for new best score
          setCurrentScore((score) => {
            if (score > bestScore) {
              setBestScore(score);
              localStorage.setItem(BEST_SCORE_KEY, score.toString());
            }
            return score;
          });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, bestScore]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setCurrentScore(0);
    setShowGameOver(false);
    setIsMinimized(false);
    
    // Dispatch event after state update completes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("game-state-changed", { detail: { isPlaying: true } }));
      }
    }, 0);
  }, []);

  const closeGameOver = () => {
    setShowGameOver(false);
    
    // Dispatch event after state update completes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("game-state-changed", { detail: { isPlaying: false } }));
      }
    }, 0);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Game UI Panel - Top Right */}
      <motion.div
        className={cn(
          "fixed z-50 right-4",
          "bg-background/90 backdrop-blur-md border border-border",
          "rounded-xl shadow-lg",
          "dark:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        style={{ top: "5rem" }}
      >
        {isMinimized ? (
          // Minimized state
          <motion.button
            className="p-3 flex items-center gap-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="h-5 w-5" />
            {isPlaying && (
              <span className="text-sm font-mono font-bold">{timeLeft}s</span>
            )}
          </motion.button>
        ) : (
          // Expanded state
          <div className="p-4 min-w-[180px]">
            {/* Header with minimize */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Asteroid Hunter</span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Scores */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  Best
                </span>
                <span className="font-mono font-bold text-primary">{bestScore}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <motion.span
                  className="font-mono font-bold"
                  key={currentScore}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {currentScore}
                </motion.span>
              </div>
            </div>

            {/* Timer / Start Button */}
            {isPlaying ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <motion.span
                    className={cn(
                      "text-2xl font-mono font-bold",
                      timeLeft <= 10 ? "text-red-500" : "text-foreground"
                    )}
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    {timeLeft}s
                  </motion.span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Click asteroids to destroy!
                </p>
              </div>
            ) : (
              <motion.button
                onClick={startGame}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "px-4 py-2 rounded-lg font-medium text-sm",
                  "bg-primary text-primary-foreground",
                  "dark:shadow-[0_0_15px_rgba(0,243,255,0.3)]",
                  "hover:opacity-90 transition-all"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-4 w-4" />
                Start Game
              </motion.button>
            )}
          </div>
        )}
      </motion.div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {showGameOver && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGameOver}
          >
            <motion.div
              className={cn(
                "bg-background border border-border rounded-2xl p-8 text-center",
                "dark:shadow-[0_0_40px_rgba(0,243,255,0.2)]",
                "max-w-sm mx-4"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              
              <div className="space-y-3 mb-6">
                <div className="text-4xl font-mono font-bold text-primary">
                  {currentScore}
                </div>
                <p className="text-muted-foreground">asteroids destroyed</p>
                
                {currentScore >= bestScore && currentScore > 0 && (
                  <motion.div
                    className="text-yellow-500 font-semibold flex items-center justify-center gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Trophy className="h-5 w-5" />
                    New Best Score!
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startGame}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium",
                    "bg-primary text-primary-foreground",
                    "dark:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={closeGameOver}
                  className="px-6 py-2 rounded-lg font-medium border border-border hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
