"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "anish77jha@gmail.com",
    href: "mailto:anish77jha@gmail.com",
    emoji: "📡",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "/in/anish-jha-247310248/",
    href: "https://www.linkedin.com/in/anish-jha-247310248/",
    emoji: "🌐",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "anishjha12309",
    href: "https://github.com/anishjha12309",
    emoji: "🛸",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Faridabad, Haryana",
    href: null,
    emoji: "🌍",
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

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Astronomy decorations */}
      <FloatingStar className="top-16 left-16 text-lg" delay={0} />
      <FloatingStar className="top-32 right-24 text-sm" delay={0.6} />
      <FloatingStar className="bottom-24 left-1/3 text-base" delay={1.2} />
      <FloatingStar className="bottom-40 right-16 text-xs" delay={0.3} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm mb-2">
            06. What&apos;s Next? <span className="ml-1">🌟</span>
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In Touch
            <span className="ml-2 text-primary/40 dark:text-primary/60">✦</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            I&apos;m currently looking for new opportunities. Whether you have a
            question or just want to say hi, I&apos;ll try my best to get back to you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "p-6 rounded-xl relative",
              "bg-card border border-border",
              "dark:hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]"
            )}
          >
            <h3 className="text-xl font-semibold mb-6">
              Send a Message <span className="text-primary/50">📨</span>
            </h3>
            <ContactForm />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">
              Or reach out directly <span className="text-primary/50">🚀</span>
            </h3>
            
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  className="flex items-center gap-4"
                  whileHover={{ x: 4 }}
                >
                  <div className={cn(
                    "p-3 rounded-lg relative",
                    "bg-secondary text-foreground",
                    "dark:bg-muted"
                  )}>
                    <info.icon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 text-xs">{info.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="mailto:anish77jha@gmail.com"
              className={cn(
                "inline-flex items-center gap-2 mt-8",
                "px-8 py-4 rounded-full font-medium",
                "bg-primary text-primary-foreground",
                "dark:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
                "hover:opacity-90 transition-all duration-300"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-5 w-5" />
              Say Hello
              <span className="text-sm ml-1">✦</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
