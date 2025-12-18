"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Astronomy decorations */}
      <FloatingStar className="top-20 left-10 text-lg" delay={0} />
      <FloatingStar className="top-40 right-20 text-sm" delay={0.5} />
      <FloatingStar className="bottom-32 left-1/4 text-xs" delay={1} />
      <FloatingStar className="bottom-20 right-10 text-base" delay={1.5} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            <span className="text-primary font-mono text-xl mr-2">01.</span>
            About Me
            <span className="ml-2 text-primary/40 dark:text-primary/60">✦</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Text Content */}
          <motion.div
            className="md:col-span-2 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-muted-foreground leading-relaxed">
              Hello! I&apos;m Anish, a passionate Full Stack Developer and AI Engineer 
              based in Faridabad, India. I enjoy building things that live on the internet, 
              whether that be websites, applications, or anything in between.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently, I&apos;m pursuing my Bachelor&apos;s in Computer Science at 
              <span className="text-foreground font-medium"> Maharaja Agrasen Institute of Technology</span>. 
              My focus is on creating accessible, AI-powered digital experiences that solve 
              real-world problems.
            </p>
          

            <div className="pt-4">
              <p className="text-sm font-mono text-muted-foreground mb-3">
                <span className="text-primary mr-1">🚀</span> Technologies I work with:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "JavaScript/TypeScript",
                  "React / Next.js",
                  "Node.js / Express",
                  "Python / FastAPI",
                  "PostgreSQL / MongoDB",
                  "LangChain / AI SDKs",
                ].map((tech) => (
                  <motion.span
                    key={tech}
                    className={cn(
                      "text-sm flex items-center gap-2",
                      "text-muted-foreground"
                    )}
                    whileHover={{ x: 4, color: "var(--primary)" }}
                  >
                    <span className="text-primary">▹</span>
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Image - Sleek hexagonal design */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative group">
              {/* Main image container with hexagon clip */}
              <div className={cn(
                "relative w-48 h-48 sm:w-56 sm:h-56",
                "overflow-hidden",
                "transition-transform duration-300 group-hover:scale-105"
              )}
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
              >
                {/* User Profile Image */}
                <div className="absolute inset-0 bg-muted/20"> {/* Fallback/Loading bg */}
                  <img 
                    src="/anish-profile.jpg" 
                    alt="Anish Kumar Jha"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: "center 50%" }}
                  />
                </div>
                
                {/* Overlay gradient for better text contrast if needed, or just aesthetic sheen */}
                <div className={cn(
                  "absolute inset-0 opacity-20 group-hover:opacity-10 opacity-0 transition-opacity duration-300",
                  "bg-gradient-to-t from-primary/40 to-transparent"
                )} />
              </div>

              {/* Orbital accent ring */}
              <motion.div
                className={cn(
                  "absolute -inset-4 border border-primary/20 dark:border-primary/30",
                  "pointer-events-none"
                )}
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Corner accents */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full" />
              
              {/* Status indicator */}
              <motion.div
                className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2",
                  "flex items-center gap-1.5 px-3 py-1",
                  "bg-background/80 backdrop-blur-sm border border-border rounded-full",
                  "text-xs font-mono text-muted-foreground"
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Open to work
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
