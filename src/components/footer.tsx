"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoonPhaseIndicator, ConstellationPattern } from "./astronomy-decorations";
import { APODWidget } from "./apod-widget";

const socialLinks = [
  { icon: Github, href: "https://github.com/anishjha12309", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/anish-jha-247310248/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:anishjha12309@gmail.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative py-8 px-4 border-t border-border overflow-hidden">
      {/* Background constellation */}
      <ConstellationPattern className="top-2 right-10" />
      <ConstellationPattern className="bottom-2 left-10 rotate-180" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side: Moon Phase */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <MoonPhaseIndicator />
          </div>

          {/* Center: APOD Widget */}
          <div className="w-full max-w-xs">
            <APODWidget />
          </div>

          {/* Right side: Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-muted-foreground hover:text-primary",
                  "transition-all duration-200 hover:-translate-y-0.5"
                )}
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

