"use client";

import { useState } from "react";
import { BotIcon, VideoIcon } from "lucide-react";

export const ProvidersSection = () => {
  const [activeProvider, setActiveProvider] = useState("groq");

  const providers = [
    {
      key: "groq",
      name: "Groq",
      role: "Primary LLM",
      latency: "12ms",
      state: "Active Primary",
      color: "border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5",
    },
    {
      key: "openrouter",
      name: "OpenRouter",
      role: "Fallback LLM",
      latency: "45ms",
      state: "Standby Failover",
      color: "border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-500/5",
    },
    {
      key: "elevenlabs",
      name: "ElevenLabs",
      role: "Voice Synthesis",
      latency: "18ms",
      state: "Active Audio",
      color: "border-violet-500/20 hover:border-violet-500/40 text-violet-400 bg-violet-500/5",
    },
    {
      key: "huggingface",
      name: "HuggingFace",
      role: "Final Fallback",
      latency: "140ms",
      state: "Standby Offline",
      color: "border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-500/5",
    },
  ];

  const mobileProviders = [
    {
      name: "Groq",
      role: "Primary LLM",
      details: "Active Primary • 12ms",
      color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    },
    {
      name: "OpenRouter",
      role: "Fallback LLM",
      details: "Standby • 45ms",
      color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
    },
    {
      name: "ElevenLabs",
      role: "Voice AI",
      details: "Active Audio • 18ms",
      color: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400",
    },
    {
      name: "HuggingFace",
      role: "Final Fallback",
      details: "Standby • Offline",
      color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-4 animate-slide-up">
            Cascading Reliability
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Zero-Downtime AI Architecture
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Every request cascades through multiple premium models. If a provider experiences latency or outage, the
            engine switches in milliseconds.
          </p>
        </div>

        {/* Network diagram container */}
        <div className="glass-card bg-background/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />

          {/* Desktop Network Map */}
          <div className="hidden md:grid grid-cols-12 gap-6 items-center min-h-[360px] relative z-10">
            {/* 1. Request Input */}
            <div className="col-span-3 flex flex-col items-center justify-center text-center p-6 glass-card bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/5 rounded-2xl h-44">
              <div className="size-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-3">
                <VideoIcon className="size-6 text-cyan-400" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Client Audio Stream</span>
              <span className="text-[10px] text-muted-foreground mt-1">WebRTC / WebSocket</span>
            </div>

            {/* SVG Connecting Paths 1 */}
            <div className="col-span-1 h-full relative min-h-[176px]">
              <svg className="absolute inset-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 88 H 100" stroke="url(#cyan-grad)" strokeWidth="2" strokeDasharray="5 3" className="animate-dash-fast" />
                <defs>
                  <linearGradient id="cyan-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 2. Fallback Router Engine */}
            <div className="col-span-4 flex flex-col items-center justify-center text-center p-8 glass-card border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] bg-slate-50/90 dark:bg-[#0b101c] rounded-3xl h-56 relative group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-5 blur-md group-hover:opacity-10 transition-opacity" />
              <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4 relative z-10 animate-pulse">
                <BotIcon className="size-8 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block relative z-10">CogniMeet AI Router</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 relative z-10 border border-emerald-500/20">
                100% Uptime Cascading
              </span>
            </div>

            {/* SVG Connecting Paths 2 */}
            <div className="col-span-1 h-full relative min-h-[176px]">
              <svg className="absolute inset-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 0 88 C 50 88, 50 15, 100 15"
                  stroke={activeProvider === "groq" ? "#10b981" : "rgba(255,255,255,0.1)"}
                  strokeWidth={activeProvider === "groq" ? "2.5" : "1"}
                  className={activeProvider === "groq" ? "animate-dash-fast" : ""}
                />
                <path
                  d="M 0 88 C 50 88, 50 65, 100 65"
                  stroke={activeProvider === "openrouter" ? "#22d3ee" : "rgba(255,255,255,0.1)"}
                  strokeWidth={activeProvider === "openrouter" ? "2.5" : "1"}
                  className={activeProvider === "openrouter" ? "animate-dash-fast" : ""}
                />
                <path
                  d="M 0 88 C 50 88, 50 115, 100 115"
                  stroke={activeProvider === "elevenlabs" ? "#a78bfa" : "rgba(255,255,255,0.1)"}
                  strokeWidth={activeProvider === "elevenlabs" ? "2.5" : "1"}
                  className={activeProvider === "elevenlabs" ? "animate-dash-fast" : ""}
                />
                <path
                  d="M 0 88 C 50 88, 50 165, 100 165"
                  stroke={activeProvider === "huggingface" ? "#f59e0b" : "rgba(255,255,255,0.1)"}
                  strokeWidth={activeProvider === "huggingface" ? "2.5" : "1"}
                  className={activeProvider === "huggingface" ? "animate-dash-fast" : ""}
                />
              </svg>
            </div>

            {/* 3. Providers Stack */}
            <div className="col-span-3 flex flex-col gap-3 justify-center">
              {providers.map((p) => (
                <div
                  key={p.key}
                  onMouseEnter={() => setActiveProvider(p.key)}
                  className={`border rounded-xl p-3.5 transition-all duration-300 cursor-pointer ${p.color} ${
                    activeProvider === p.key
                      ? "scale-[1.03] bg-black/[0.02] dark:bg-white/[0.02]"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-[8px] font-mono text-slate-600 dark:text-white/80">{p.latency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-600 dark:text-white/75">{p.role}</span>
                    <span className="text-[8px] font-semibold tracking-wider uppercase">{p.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view */}
          <div className="grid grid-cols-2 gap-4 md:hidden relative z-10">
            {mobileProviders.map((p) => (
              <div key={p.name} className={`bg-gradient-to-b ${p.color} border rounded-2xl p-5 shadow-lg`}>
                <p className="text-base font-bold mb-1 text-slate-900 dark:text-white">{p.name}</p>
                <p className="text-xs opacity-90">{p.role}</p>
                <p className="text-[9px] mt-2 opacity-70 font-mono">{p.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
