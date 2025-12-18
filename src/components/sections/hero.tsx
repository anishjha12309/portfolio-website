"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";

// Dynamic import for Three.js to avoid SSR issues and improve performance
const HeroBackground = dynamic(
  () => import("@/components/three/hero-background").then((mod) => mod.HeroBackground),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const socialLinks = [
  { icon: Github, href: "https://github.com/anish77jha", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/anish-kumar-jha", label: "LinkedIn" },
  { icon: Mail, href: "mailto:anish77jha@gmail.com", label: "Email" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Astronomy Background - visible in both themes */}
      <HeroBackground />

      {/* Spotlight effect */}
      <Spotlight />

      {/* Content - pointer-events-none on container, but enabled on interactive elements */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pointer-events-none"
      >
        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base font-mono text-primary mb-4"
        >
          Hi, my name is
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className={cn(
            "text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4",
            "dark:bg-gradient-to-r dark:from-white dark:via-primary dark:to-secondary",
            "dark:bg-clip-text dark:text-transparent",
            "text-foreground"
          )}
        >
          Anish Kumar Jha
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6"
        >
          Full Stack & AI Engineer
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          I build exceptional digital experiences with modern web technologies.
          Currently focused on creating AI-powered applications and scalable systems.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#projects"
            className={cn(
              "px-8 py-3 rounded-full font-medium text-sm pointer-events-auto",
              "bg-primary text-primary-foreground",
              "dark:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
              "hover:opacity-90 transition-all duration-300",
              "dark:hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className={cn(
              "px-8 py-3 rounded-full font-medium text-sm pointer-events-auto",
              "border border-input bg-background",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors duration-300"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-3 rounded-full pointer-events-auto",
                "text-muted-foreground hover:text-foreground",
                "bg-secondary/50 hover:bg-secondary",
                "dark:hover:text-primary dark:hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]",
                "transition-all duration-300"
              )}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
