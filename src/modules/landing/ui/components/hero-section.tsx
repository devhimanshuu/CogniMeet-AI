"use client";

import Link from "next/link";
import { SparklesIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

interface HeroSectionProps {
  mounted: boolean;
  isSignedIn: boolean | undefined;
  isLoaded: boolean;
}

export const HeroSection = ({ mounted, isSignedIn, isLoaded }: HeroSectionProps) => {
  return (
    <section className="dark bg-[#0a0e1a] text-white relative min-h-screen flex flex-col items-center justify-center pt-28 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 overflow-hidden border-b border-white/5">
      {/* Full Viewport Particle Text Background */}
      <ParticleTextEffect
        words={[
          "COGNIMEET",
          "AI COWORKERS",
          "SMART NOTES",
          "WEB SEARCH",
          "ACTION ITEMS",
          "LIVE INSIGHTS",
          "ZERO DOWNTIME",
        ]}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-[15%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-40 right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-[40%] w-[600px] h-[400px] bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Foreground Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center justify-between min-h-[75vh] md:min-h-[80vh] pointer-events-none">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl text-xs sm:text-sm mt-12 sm:mt-20 animate-slide-up pointer-events-auto">
          <SparklesIcon className="size-3.5 sm:size-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Powered by AI Agents — Groq, ElevenLabs & More
          </span>
        </div>

        {/* Spacer for Particle Text */}
        <div className="flex-1 min-h-[140px] md:min-h-[300px]" />

        {/* Bottom Content */}
        <div className="mt-auto pointer-events-auto w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-slate-950/60 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed relative z-10">
              CogniMeet.AI brings intelligent agents into your video meetings.
              They listen, take notes, extract action items, search the web, and
              generate insights — all in real time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 relative z-10">
              {mounted && isLoaded && isSignedIn ? (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl transition-all hover:scale-105"
                >
                  <Link href="/dashboard">
                    <SparklesIcon className="size-4 sm:size-5 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl transition-all hover:scale-105"
                >
                  <Link href="/sign-up">
                    <SparklesIcon className="size-4 sm:size-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/10 hover:bg-slate-800/50 px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl bg-slate-900/30 text-white backdrop-blur-sm transition-all hover:scale-105"
              >
                <a href="#features">
                  Discover Features
                  <ArrowRightIcon className="size-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <p
            className="mt-6 md:mt-8 text-xs font-medium text-slate-500 tracking-widest uppercase animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            Hover & click to interact with particles
          </p>
        </div>
      </div>
    </section>
  );
};
