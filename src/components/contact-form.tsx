"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormStatus = "idle" | "loading";

// Custom toast styles matching the theme
const toastStyles = {
  success: {
    style: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--primary))",
      boxShadow: "0 0 20px rgba(0, 243, 255, 0.2)",
    },
    iconTheme: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--background))",
    },
  },
  error: {
    style: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--destructive))",
    },
    iconTheme: {
      primary: "hsl(var(--destructive))",
      secondary: "hsl(var(--background))",
    },
  },
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ContactFormData> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      // Success toast
      toast.success(
        <div className="flex items-center gap-2">
          <span>🚀</span>
          <div>
            <p className="font-semibold">Message sent!</p>
            <p className="text-sm opacity-80">I&apos;ll get back to you soon.</p>
          </div>
        </div>,
        toastStyles.success
      );

      setFormData({ name: "", email: "", message: "" });
      setStatus("idle");
    } catch (err) {
      console.error("Error submitting form:", err);
      
      // Error toast
      toast.error(
        <div className="flex items-center gap-2">
          <span>😕</span>
          <div>
            <p className="font-semibold">Houston, we&apos;ve a problem here</p>
            <p className="text-sm opacity-80">Please try again later.</p>
          </div>
        </div>,
        toastStyles.error
      );

      setStatus("idle");
    }
  };

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-lg",
    "bg-secondary/50 border border-input",
    "text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
    "transition-all duration-200"
  );

  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "var(--font-sans)",
          },
        }}
      />
      
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={cn(inputClasses, errors.name && "border-destructive")}
            disabled={status === "loading"}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={cn(inputClasses, errors.email && "border-destructive")}
            disabled={status === "loading"}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={5}
            className={cn(
              inputClasses,
              "resize-none",
              errors.message && "border-destructive"
            )}
            disabled={status === "loading"}
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive mt-1"
              >
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "w-full px-6 py-3 rounded-lg font-medium",
            "flex items-center justify-center gap-2",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:shadow-[0_0_15px_rgba(0,243,255,0.3)]",
            "dark:hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
          )}
          whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
          whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </motion.button>
      </motion.form>
    </>
  );
}