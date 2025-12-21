"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, GitCommit, ExternalLink } from "lucide-react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
  url: string;
}

interface GitHubData {
  totalContributions: number;
  weeks: ContributionWeek[];
  recentCommits: Commit[];
}

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

// Get intensity level (0-4) for contribution count
function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

// Format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Unable to load GitHub activity');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get last 15 weeks for display (roughly 3.5 months) - fewer weeks for tighter look
  const displayWeeks = data?.weeks?.slice(-15) || [];

  return (
    <section id="github" className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Astronomy decorations */}
      <FloatingStar className="top-16 right-24 text-lg" delay={0.3} />
      <FloatingStar className="top-1/3 left-8 text-sm" delay={0.9} />
      <FloatingStar className="bottom-24 right-1/3 text-xs" delay={1.4} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-primary font-mono text-xl mr-2">04.</span>
            GitHub Activity
            <span className="ml-2 text-primary/40 dark:text-primary/60">⭐</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            My contribution history mapped across the cosmos.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Star Chart - Contribution Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "p-4 rounded-xl",
              "bg-card/50 backdrop-blur-sm border border-border",
              "hover:border-primary/30 transition-colors duration-300"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Github className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Star Chart</h3>
              {data && (
                <span className="ml-auto text-sm text-muted-foreground font-mono">
                  {data.totalContributions} contributions
                </span>
              )}
            </div>

            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : error ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                {error}
              </div>
            ) : (
              <div className="flex items-start gap-6">
                {/* Hover Info Display - fills empty space */}
                <div className="hidden sm:flex flex-col items-center justify-center w-28 h-20 shrink-0">
                  {hoveredDay ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-primary font-mono">
                        {hoveredDay.contributionCount}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(hoveredDay.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground/50 text-xs">
                      <div className="text-lg mb-1">✦</div>
                      Hover to explore
                    </div>
                  )}
                </div>

                {/* Contribution Grid */}
                <div className="overflow-x-auto scrollbar-hide flex-1">
                  <div className="flex gap-[2px] min-w-fit">
                    {displayWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-[2px]">
                        {week.contributionDays.map((day, dayIndex) => {
                          const level = getIntensityLevel(day.contributionCount);
                          return (
                            <motion.div
                              key={day.date}
                              className={cn(
                                "w-2.5 h-2.5 rounded-[2px] cursor-pointer",
                                level === 0 && "bg-border/50 dark:bg-border/40 border border-border/80",
                                level === 1 && "bg-primary/30 dark:bg-primary/35",
                                level === 2 && "bg-primary/50 dark:bg-primary/55",
                                level === 3 && "bg-primary/75 dark:bg-primary/75",
                                level === 4 && "bg-primary dark:bg-primary shadow-[0_0_8px_var(--primary)]"
                              )}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.2,
                                delay: (weekIndex * 7 + dayIndex) * 0.002,
                              }}
                              whileHover={{ scale: 1.5 }}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-[2px]">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "w-2.5 h-2.5 rounded-[2px]",
                          level === 0 && "bg-border/50 dark:bg-border/40 border border-border/80",
                          level === 1 && "bg-primary/30 dark:bg-primary/35",
                          level === 2 && "bg-primary/50 dark:bg-primary/55",
                          level === 3 && "bg-primary/75 dark:bg-primary/75",
                          level === 4 && "bg-primary dark:bg-primary"
                        )}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
            )}
          </motion.div>

          {/* Mission Log - Recent Commits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "p-4 rounded-xl",
              "bg-card/50 backdrop-blur-sm border border-border",
              "hover:border-primary/30 transition-colors duration-300"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <GitCommit className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Mission Log</h3>
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                latest commits
              </span>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : error ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                {error}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentCommits.map((commit, index) => (
                  <motion.a
                    key={commit.sha}
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block p-3 rounded-lg",
                      "bg-muted/30 hover:bg-muted/50",
                      "border border-transparent hover:border-primary/20",
                      "transition-all duration-200 group"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {commit.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-primary/70">
                            {commit.repo}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(commit.date)}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>
                  </motion.a>
                ))}

                {(!data?.recentCommits || data.recentCommits.length === 0) && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No recent commits found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
