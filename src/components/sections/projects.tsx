"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, ExternalLink } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Image from "next/image";

const projects = [
  {
    title: "CodeContext",
    description:
      "A robust AI-powered code intelligence platform to index entire repositories and deliver context-aware answers to natural-language queries across 50+ file codebases.",
    technologies: [
      "Next.js",
      "TypeScript",
      "TRPC",
      "Prisma",
      "Supabase",
      "LangChain",
      "AssemblyAI",
    ],
    url: "https://code-context.vercel.app/",
    image: "/CodeContext.png",
    featured: true,
  },
  {
    title: "TwitterScraper",
    description:
      "An async FastAPI backend powered by Playwright to bypass login constraints and reliably fetch real-time Twitter data. Built a Vercel-hosted React + TypeScript frontend.",
    technologies: [
      "Python",
      "FastAPI",
      "Playwright",
      "React",
      "TypeScript",
      "Docker",
      "Railway",
    ],
    url: "https://twitter-web-scraper.vercel.app/",
    image: "/Twitter-Scaper.png",
    featured: true,
  },
  {
    title: "YAP",
    description:
      "An event-driven messaging engine using Socket.io and Zustand for global state management, implementing optimistic UI updates and live socket listeners.",
    technologies: [
      "MongoDB",
      "Express.js",
      "React (Vite)",
      "Node.js",
      "Socket.io",
      "Zustand",
      "Docker",
    ],
    url: "https://yap-0glm.onrender.com/",
    image: "/Yap.png",
    featured: true,
  },
];

// Floating star decoration
function FloatingStar({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      className={cn("absolute text-primary/20 dark:text-primary/30 pointer-events-none", className)}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.2, 0.5, 0.2],
        y: [0, -5, 0],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut"
      }}
    >
      ✦
    </motion.span>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Astronomy decorations */}
      <FloatingStar className="top-24 right-16 text-lg" delay={0.2} />
      <FloatingStar className="top-1/3 left-12 text-sm" delay={0.8} />
      <FloatingStar className="bottom-40 right-1/4 text-xs" delay={1.3} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-primary font-mono text-xl mr-2">03.</span>
            Featured Projects
            <span className="ml-2 text-primary/40 dark:text-primary/60">🚀</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Some things I&apos;ve built with passion and purpose.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full group outline-none"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardSpotlight className="h-full flex flex-col overflow-hidden hover:border-primary/50 transition-colors duration-300">
                  {/* Project Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay with external link - lighter in light mode, stronger in dark mode */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-20 group-hover:opacity-25 dark:opacity-60 dark:group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                      {project.title}
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-0.5" />
                    </h3>

                    <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-md",
                            "bg-secondary/50 text-secondary-foreground",
                            "border border-transparent group-hover:border-primary/20",
                            "transition-colors duration-300"
                          )}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </CardSpotlight>
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Many More Coming Text */}
        <motion.p
          className="text-center mt-8 text-muted-foreground/70 text-sm italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2">
            <span>& many more coming soon</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀
            </motion.span>
          </span>
        </motion.p>

        {/* View More Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.a
            href="https://github.com/anishjha12309"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full",
              "border border-primary text-primary",
              "hover:bg-primary/10 transition-colors",
              "font-medium text-sm"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="h-4 w-4" />
            View More on GitHub
            <span className="text-xs ml-1">✦</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
