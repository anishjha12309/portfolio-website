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

const skillCategories = [
  {
    name: "Frontend",
    color: "#60a5fa",
    skills: ["React", "Next.js", "Tailwind", "TypeScript", "Framer Motion"],
    description: "Building responsive, interactive, and beautiful user interfaces.",
    icon: "🎨"
  },
  {
    name: "Backend",
    color: "#34d399", 
    skills: ["Node.js", "Express", "tRPC", "Socket.io", "FastAPI"],
    description: "Robust server-side logic and scalable APIs.",
    icon: "⚙️"
  },
  {
    name: "AI & ML",
    color: "#a78bfa",
    skills: ["LangChain", "Gemini", "Claude", "OpenAI", "Python"],
    description: "Integrating intelligence into applications.",
    icon: "🤖"
  },
  {
    name: "Database",
    color: "#facc15",
    skills: ["Postgres", "Supabase", "Prisma", "Redis", "MongoDB"],
    description: "Optimized data storage and management.",
    icon: "💾"
  },
  {
    name: "DevOps",
    color: "#f87171",
    skills: ["Docker", "Git", "Vercel", "AWS", "CI/CD"],
    description: "Streamlined deployment and infrastructure.",
    icon: "🚀"
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 dark:bg-muted/20 relative overflow-hidden"
    >
      {/* Astronomy decorations */}
      <FloatingStar className="top-16 right-20 text-lg" delay={0.1} />
      <FloatingStar className="top-40 left-16 text-sm" delay={0.7} />
      <FloatingStar className="bottom-28 right-1/3 text-base" delay={1.1} />
      <FloatingStar className="bottom-16 left-24 text-xs" delay={0.4} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-primary font-mono text-xl mr-2">05.</span>
            Skills & Technologies
            <span className="ml-2 text-primary/40 dark:text-primary/60">✨</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            My technical expertise across different domains, ranging from modern frontend frameworks to scalable backend systems and AI integration.
          </p>
        </motion.div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group relative h-full"
            >
              <div 
                className={cn(
                  "h-full p-6 rounded-2xl border border-border/50",
                  "bg-background/50 backdrop-blur-sm",
                  "hover:border-primary/30 transition-all duration-300",
                  "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                )}
              >
                {/* Accent Line */}
                <div 
                  className="absolute top-6 left-0 w-1 h-8 rounded-r-full" 
                  style={{ backgroundColor: category.color }} 
                />

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pl-3">
                  <span className="text-2xl" role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 pl-3 min-h-[40px]">
                  {category.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 pl-3">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md",
                        "bg-secondary/50 text-secondary-foreground",
                        "border border-transparent hover:border-border/50 transition-colors"
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
