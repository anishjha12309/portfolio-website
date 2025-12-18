"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function BackgroundBeams({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Aurora gradient */}
          <linearGradient id="aurora-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,243,255,0)" />
            <stop offset="30%" stopColor="rgba(0,243,255,0.15)" />
            <stop offset="50%" stopColor="rgba(188,19,254,0.2)" />
            <stop offset="70%" stopColor="rgba(0,243,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,243,255,0)" />
          </linearGradient>
          <linearGradient id="aurora-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(188,19,254,0)" />
            <stop offset="40%" stopColor="rgba(188,19,254,0.12)" />
            <stop offset="60%" stopColor="rgba(0,243,255,0.12)" />
            <stop offset="100%" stopColor="rgba(188,19,254,0)" />
          </linearGradient>
          <linearGradient id="aurora-gradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(138,43,226,0)" />
            <stop offset="50%" stopColor="rgba(138,43,226,0.1)" />
            <stop offset="100%" stopColor="rgba(138,43,226,0)" />
          </linearGradient>
        </defs>
        
        {/* Aurora wave beams */}
        <motion.path
          d="M0,200 Q250,100 500,200 T1000,200 T1500,200"
          stroke="url(#aurora-gradient-1)"
          strokeWidth="60"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.6, 0.6, 0],
            translateY: [0, -20, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,400 Q300,300 600,400 T1200,400"
          stroke="url(#aurora-gradient-2)"
          strokeWidth="40"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.5, 0],
            translateY: [0, 30, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.path
          d="M-100,300 Q200,250 500,350 T1100,300"
          stroke="url(#aurora-gradient-3)"
          strokeWidth="80"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </svg>
      
      {/* Nebula glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: resolvedTheme === "dark" 
            ? "radial-gradient(circle, rgba(0,243,255,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-30%", "30%", "-30%"],
          y: ["-20%", "20%", "-20%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: "10%", left: "20%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: resolvedTheme === "dark"
            ? "radial-gradient(circle, rgba(188,19,254,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,0,0,0.015) 0%, transparent 70%)",
        }}
        animate={{
          x: ["30%", "-30%", "30%"],
          y: ["10%", "-20%", "10%"],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: "50%", right: "10%" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl"
        style={{
          background: resolvedTheme === "dark"
            ? "radial-gradient(circle, rgba(138,43,226,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,0,0,0.01) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["20%", "-10%", "20%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ bottom: "20%", left: "40%" }}
      />
    </div>
  );
}
