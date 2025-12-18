"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Briefcase } from "lucide-react";

const experiences = [
  {
    title: "Software Developer Intern",
    company: "TBP Labs Technologies",
    location: "Remote",
    period: "Jun 2024 – Nov 2025",
    description: [
      "Engineered a 20+ page marketing platform using Next.js, achieving sub-1.2s LCP and 95+ Lighthouse scores",
      "Spearheaded TypeScript migration of 10,000+ lines, implementing complex drag-and-drop workflows",
      "Architected a resilience-first React Native communication layer with WebSocket auto-reconnection",
      "Delivered smooth 60fps interactions under high enterprise message volume",
    ],
    technologies: [
      "Next.js",
      "React Native",
      "TypeScript",
      "Redux Toolkit",
      "Framer Motion",
      "Firebase",
    ],
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 dark:bg-muted/20"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            <span className="text-primary font-mono text-xl mr-2">02.</span>
            Work Experience
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-20 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-0 md:left-8 top-0",
                "w-3 h-3 -translate-x-1/2 rounded-full",
                "bg-primary dark:shadow-[0_0_10px_rgba(0,243,255,0.5)]"
              )} />

              {/* Content Card */}
              <motion.div
                className={cn(
                  "p-6 rounded-xl",
                  "bg-card border border-border",
                  "dark:hover:border-primary/30 transition-colors duration-300",
                  "dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
                )}
                whileHover={{ y: -4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.title}
                    </h3>
                    <a
                      href="https://app.phloz.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary font-medium hover:underline transition-all"
                    >
                      <Briefcase className="h-4 w-4" />
                      {exp.company}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono mt-2 sm:mt-0">
                    {exp.period}
                  </div>
                </div>

                <ul className="space-y-3 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="text-primary mt-1">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "px-3 py-1 text-xs font-mono rounded-full",
                        "bg-primary/10 text-primary",
                        "dark:bg-primary/20"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
