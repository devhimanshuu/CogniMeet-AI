"use client";

import Link from "next/link";
import { useState } from "react";
import { SparklesIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface CTASectionProps {
  mounted: boolean;
}

export const CTASection = ({ mounted }: CTASectionProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [ctaCoords, setCtaCoords] = useState({ x: 0, y: 0 });
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCtaCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full w-full mx-auto" />
      <div className="w-full text-center relative z-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {/* Glowing cursor tracking card */}
        <div
          onMouseMove={handleCtaMouseMove}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          style={{
            background: ctaHovered
              ? `radial-gradient(600px circle at ${ctaCoords.x}px ${ctaCoords.y}px, rgba(16, 185, 129, 0.12), transparent 45%), var(--cta-bg)`
              : "var(--cta-bg)",
            transition: "background 0.3s ease",
          }}
          className="glass-card p-16 md:p-24 rounded-[3rem] border border-black/10 dark:border-white/10 shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <SparklesIcon className="size-16 text-emerald-400 mx-auto relative z-10" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white relative z-10">
            Ready to Transform Your Meetings?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed relative z-10">
            Join teams around the world using AI-powered meeting intelligence to make every sync count.
          </p>

          {mounted && isLoaded && isSignedIn ? (
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] px-12 h-16 text-lg rounded-2xl relative z-10 transition-transform hover:scale-[1.05] duration-300"
            >
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRightIcon className="size-5 ml-3" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] px-12 h-16 text-lg rounded-2xl relative z-10 transition-transform hover:scale-[1.05] duration-300"
            >
              <Link href="/sign-up">
                Get Started For Free
                <ArrowRightIcon className="size-5 ml-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
