"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ExternalLink, Image as ImageIcon, Video, X, Maximize2 } from "lucide-react";
import { APODData, getAPOD } from "@/lib/nasa-api";

// ============================================================================
// APOD WIDGET - Compact version for footer/sidebar
// ============================================================================

export function APODWidget() {
  const [mounted, setMounted] = useState(false);
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchAPOD = async () => {
      setIsLoading(true);
      const data = await getAPOD();
      setApodData(data);
      setIsLoading(false);
    };

    fetchAPOD();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`
          relative overflow-hidden rounded-lg border
          ${isDark 
            ? "border-primary/20 bg-black/40 backdrop-blur-sm" 
            : "border-primary/30 bg-white/60 backdrop-blur-sm"
          }
        `}
      >
        {/* Header */}
        <div className={`
          px-3 py-2 border-b flex items-center justify-between
          ${isDark ? "border-primary/20 bg-primary/5" : "border-primary/20 bg-primary/10"}
        `}>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-sm"
            >
              🌌
            </motion.span>
            <span className="text-xs font-mono font-medium">NASA APOD</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {apodData?.date || "Loading..."}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 rounded bg-muted"
              />
              <div className="flex-1">
                <div className="h-3 w-24 bg-muted rounded animate-pulse mb-2" />
                <div className="h-2 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ) : apodData ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full text-left group"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border border-border">
                  {apodData.media_type === "image" ? (
                    <img
                      src={apodData.thumbnail_url || apodData.url}
                      alt={apodData.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Video className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {apodData.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                    {apodData.explanation.slice(0, 80)}...
                  </p>
                  {apodData.copyright && (
                    <p className="text-[9px] text-muted-foreground/70 mt-1">
                      © {apodData.copyright}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-2">
              Unable to load today&apos;s picture
            </div>
          )}
        </div>
      </motion.div>

      {/* Full Modal */}
      <AnimatePresence>
        {showModal && apodData && (
          <APODModal apod={apodData} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// APOD MODAL - Full display
// ============================================================================

function APODModal({ apod, onClose }: { apod: APODData; onClose: () => void }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`
          relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl
          ${isDark ? "bg-gray-900" : "bg-white"}
          shadow-2xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`
            absolute top-4 right-4 z-10 p-2 rounded-full
            ${isDark ? "bg-black/50 hover:bg-black/70" : "bg-white/50 hover:bg-white/70"}
            backdrop-blur-sm transition-colors
          `}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Image */}
          <div className="relative md:w-2/3 bg-black flex items-center justify-center">
            {apod.media_type === "image" ? (
              <img
                src={apod.hdurl || apod.url}
                alt={apod.title}
                className="max-h-[60vh] md:max-h-[90vh] w-auto object-contain"
              />
            ) : (
              <iframe
                src={apod.url}
                title={apod.title}
                className="w-full aspect-video"
                allowFullScreen
              />
            )}
          </div>

          {/* Info panel */}
          <div className={`
            md:w-1/3 p-6 overflow-y-auto max-h-[30vh] md:max-h-[90vh]
            ${isDark ? "bg-gray-900" : "bg-white"}
          `}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌌</span>
              <span className="text-xs font-mono text-muted-foreground">
                NASA Astronomy Picture of the Day
              </span>
            </div>

            <h2 className="text-xl font-bold mb-2">{apod.title}</h2>

            <p className="text-sm text-muted-foreground mb-4">
              {apod.date}
            </p>

            <p className="text-sm leading-relaxed mb-6">
              {apod.explanation}
            </p>

            {apod.copyright && (
              <p className="text-xs text-muted-foreground mb-4">
                Image Credit: {apod.copyright}
              </p>
            )}

            <a
              href={apod.hdurl || apod.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                ${isDark 
                  ? "bg-primary/20 hover:bg-primary/30 text-primary" 
                  : "bg-primary/10 hover:bg-primary/20 text-primary"
                }
                transition-colors
              `}
            >
              <ExternalLink className="w-4 h-4" />
              View Full Resolution
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// APOD BACKGROUND - Subtle background decoration
// ============================================================================

export function APODBackground() {
  const [mounted, setMounted] = useState(false);
  const [apodData, setApodData] = useState<APODData | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchAPOD = async () => {
      const data = await getAPOD();
      if (data?.media_type === "image") {
        setApodData(data);
      }
    };

    fetchAPOD();
  }, [mounted]);

  if (!mounted || !apodData || resolvedTheme !== "dark") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url(${apodData.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
    </div>
  );
}
