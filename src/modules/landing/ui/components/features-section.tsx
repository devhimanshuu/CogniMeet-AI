"use client";

import { useState, useEffect } from "react";
import {
  SparklesIcon,
  BrainCircuitIcon,
  FileTextIcon,
  MessagesSquareIcon,
  GlobeIcon,
  TargetIcon,
  BarChart3Icon,
  BotIcon,
} from "lucide-react";

export const FeaturesSection = () => {
  const [summaryStep, setSummaryStep] = useState(0);
  const [actionItemChecked, setActionItemChecked] = useState(false);
  const [analyticsHovered, setAnalyticsHovered] = useState(false);

  useEffect(() => {
    const summaryInterval = setInterval(() => {
      setSummaryStep((s) => (s + 1) % 3);
    }, 3000);

    const actionInterval = setInterval(() => {
      setActionItemChecked((c) => !c);
    }, 2500);

    return () => {
      clearInterval(summaryInterval);
      clearInterval(actionInterval);
    };
  }, []);

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
      <div className="w-full relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
            <SparklesIcon className="size-3" /> Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Everything Your Meetings Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Powered by a multi-provider AI fallback architecture that never lets you down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: AI Summarization (Double Column) */}
          <div className="md:col-span-2 glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden relative min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <BrainCircuitIcon className="size-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">AI Summarization</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
                Get structured summaries with key decisions, action items, and topics — generated instantly after every meeting.
              </p>
            </div>

            {/* Mockup Preview */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-inner mt-4 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-white/80">CogniMeet AI Agent</span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">Real-Time Insight</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="transition-all duration-500">
                  <p className="font-semibold text-emerald-400 mb-1">✓ Key Decision</p>
                  <p className="text-slate-700 dark:text-white/70 pl-3 border-l border-emerald-500/30">Launch date set to Monday, June 18th.</p>
                </div>
                <div className={`transition-all duration-500 delay-200 ${summaryStep >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  <p className="font-semibold text-cyan-400 mb-1">⚡ Action Item</p>
                  <p className="text-slate-700 dark:text-white/70 pl-3 border-l border-cyan-500/30">Sarah to complete Stripe webhook integration by Friday.</p>
                </div>
                <div className={`transition-all duration-500 delay-400 ${summaryStep >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  <p className="font-semibold text-violet-400 mb-1">🗒 Note</p>
                  <p className="text-slate-700 dark:text-white/70 pl-3 border-l border-violet-500/30">Parth recommended implementing LLM fallback routing rules.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Real-Time Transcription (Single Column) */}
          <div className="glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(34,211,238,0.1)] group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <FileTextIcon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Live Transcription</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Accurate, speaker-attributed transcription powered by Stream Video with searchable history.
              </p>
            </div>

            {/* Waveform Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-inner space-y-3 mt-4">
              <div className="flex justify-center gap-1.5 h-10 items-center border-b border-black/5 dark:border-white/5 pb-3">
                <div className="w-1 bg-cyan-400 rounded-full h-8 animate-[pulse_0.8s_infinite_alternate]" />
                <div className="w-1 bg-emerald-400 rounded-full h-4 animate-[pulse_0.6s_infinite_alternate_0.2s]" />
                <div className="w-1 bg-cyan-500 rounded-full h-6 animate-[pulse_0.7s_infinite_alternate_0.1s]" />
                <div className="w-1 bg-violet-400 rounded-full h-9 animate-[pulse_0.9s_infinite_alternate_0.3s]" />
                <div className="w-1 bg-cyan-400 rounded-full h-5 animate-[pulse_0.5s_infinite_alternate_0.15s]" />
                <div className="w-1 bg-emerald-500 rounded-full h-7 animate-[pulse_0.8s_infinite_alternate_0.4s]" />
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex gap-2">
                  <span className="font-semibold text-cyan-400">Parth:</span>
                  <span className="text-slate-700 dark:text-white/70">Let&apos;s verify Tavily fallback.</span>
                </div>
                <div className="flex gap-2 border-t border-black/5 dark:border-white/5 pt-1.5">
                  <span className="font-semibold text-emerald-400 animate-pulse">AI Co-worker:</span>
                  <span className="text-slate-600 dark:text-white/60 italic">Searching databases...</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Post-Meeting AI Chat (Single Column) */}
          <div className="glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(167,139,250,0.1)] group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                <MessagesSquareIcon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Post-Meeting AI Chat</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Ask follow-up questions about any meeting. Your AI agent remembers every single detail.
              </p>
            </div>

            {/* Chat Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-inner mt-4 space-y-3">
              <div className="text-[10px] text-right ml-auto bg-violet-500/20 text-violet-800 dark:text-violet-300 rounded-lg py-1.5 px-3 max-w-[85%] border border-violet-500/10">
                Who is deployment lead?
              </div>
              <div className="text-[10px] bg-black/5 dark:bg-white/5 text-slate-800 dark:text-white/80 rounded-lg py-1.5 px-3 max-w-[90%] border border-black/5 dark:border-white/10">
                Sarah is lead. Assistant backup is Parth.
              </div>
            </div>
          </div>

          {/* CARD 4: Live Web Search (Single Column) */}
          <div className="glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(59,130,246,0.1)] group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <GlobeIcon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Live Web Search</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                AI searches the web mid-conversation via Tavily to fact-check statements and retrieve fresh answers.
              </p>
            </div>

            {/* Search Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-inner mt-4 space-y-2.5">
              <div className="bg-black/5 dark:bg-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-2 border border-black/5 dark:border-white/5">
                <span className="text-[9px] text-blue-500 font-semibold">Tavily:</span>
                <span className="text-[10px] text-slate-600 dark:text-white/55 font-mono overflow-hidden whitespace-nowrap text-ellipsis w-full">
                  &quot;Groq rate limits 2026&quot;
                </span>
              </div>
              <div className="bg-emerald-500/10 rounded px-2 py-1 flex items-center justify-between border border-emerald-500/15">
                <span className="text-[9px] text-emerald-500 font-semibold">✓ Verified Source</span>
                <span className="text-[9px] text-slate-600 dark:text-white/60">Updated 1h ago</span>
              </div>
            </div>
          </div>

          {/* CARD 5: Smart Action Items (Single Column) */}
          <div className="glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(245,158,11,0.1)] group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <TargetIcon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Action Items</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                AI automatically extracts commitments, assigns owners, and syncs tasks directly to external boards.
              </p>
            </div>

            {/* Tasks Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-inner mt-4 space-y-2">
              <div className="flex items-center gap-2.5 text-[11px] text-slate-700 dark:text-white/70">
                <div className="size-3.5 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold">✓</div>
                <span className="line-through text-slate-400 dark:text-white/40">Configure Webhook</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-slate-700 dark:text-white/70">
                <div
                  className={`size-3.5 rounded border transition-all duration-300 flex items-center justify-center ${
                    actionItemChecked
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "border-black/20 dark:border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={`transition-all duration-300 ${
                    actionItemChecked
                      ? "line-through text-slate-400 dark:text-white/40"
                      : "text-slate-700 dark:text-white/70"
                  }`}
                >
                  Test fallback routing
                </span>
              </div>
            </div>
          </div>

          {/* CARD 6: Meeting Analytics Dashboard (Double Column) */}
          <div
            className="md:col-span-2 glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(244,63,94,0.1)] group flex flex-col justify-between overflow-hidden relative min-h-[350px]"
            onMouseEnter={() => setAnalyticsHovered(true)}
            onMouseLeave={() => setAnalyticsHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                <BarChart3Icon className="size-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Meeting Analytics</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
                Analyze speaker contribution, productivity coefficients, and focus trends to fine-tune your workflow.
              </p>
            </div>

            {/* Analytics Dashboard Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-inner mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5">
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Sentiment Score</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">96% Positive</span>
                </div>
                <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5">
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Meeting Efficiency</span>
                  <span className="text-lg font-bold text-emerald-500">Excellent</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block mb-2">Speaker Share Ratio</span>
                <div className="flex h-3 rounded-full overflow-hidden bg-black/10 dark:bg-white/5 relative">
                  <div className="bg-emerald-500 transition-all duration-1000" style={{ width: analyticsHovered ? "45%" : "35%" }} />
                  <div className="bg-cyan-500 transition-all duration-1000" style={{ width: analyticsHovered ? "30%" : "40%" }} />
                  <div className="bg-violet-500 transition-all duration-1000" style={{ width: analyticsHovered ? "25%" : "25%" }} />
                </div>
                <div className="flex gap-4 mt-3 text-[10px] justify-center text-slate-800 dark:text-white/70">
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> Sarah (45%)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-cyan-500" /> Parth (30%)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-violet-500" /> AI Agent (25%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 7: Customizable AI Co-workers (Single Column) */}
          <div className="glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="inline-flex p-3 rounded-2xl mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <BotIcon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">AI Coworkers</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Deploy custom voice agents with personalities tuned specifically for engineering, sales, or product sprints.
              </p>
            </div>

            {/* Agent Settings Mockup */}
            <div className="glass-card bg-black/5 dark:bg-[#0b0f19]/80 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-inner mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white text-[10px]">
                  AI
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Bella</p>
                  <p className="text-[9px] text-muted-foreground">Scrum Master Persona</p>
                </div>
              </div>
              <div className="space-y-1.5 text-[10px] text-slate-800 dark:text-white">
                <div className="flex justify-between text-slate-600 dark:text-white/60">
                  <span>Voice Model:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">OpenAI Realtime</span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/5 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
