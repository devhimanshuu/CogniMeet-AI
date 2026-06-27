"use client";

import { useState } from "react";
import { ZapIcon } from "lucide-react";

export const HowItWorksSection = () => {
  const [activeWorkStep, setActiveWorkStep] = useState(0);

  const steps = [
    {
      step: 0,
      number: "01",
      title: "Configure Your Agent",
      description:
        "Give your AI coworker a customized role, select synthesis voices, and adjust parameters to fit your sprint style.",
    },
    {
      step: 1,
      number: "02",
      title: "Meet & Converse",
      description:
        "Host your video conference. The agent joins, listens, attributes speakers, and executes live lookups automatically.",
    },
    {
      step: 2,
      number: "03",
      title: "Review & Act",
      description:
        "Review AI-generated summaries, action items, key decisions, and continue chatting with your agent for follow-ups.",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="w-full relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
            <ZapIcon className="size-3" /> How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Three Steps to Smarter Meetings
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            From setup to automation, see how CogniMeet.AI handles meeting intelligence for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Step selectors */}
          <div className="lg:col-span-5 space-y-6">
            {steps.map((item) => (
              <button
                key={item.step}
                onClick={() => setActiveWorkStep(item.step)}
                onMouseEnter={() => setActiveWorkStep(item.step)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-5 relative overflow-hidden group cursor-pointer ${
                  activeWorkStep === item.step
                    ? "bg-black/5 dark:bg-white/[0.04] border-black/10 dark:border-white/10 shadow-lg"
                    : "bg-transparent border-transparent hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                }`}
              >
                {activeWorkStep === item.step && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      item.step === 0
                        ? "bg-emerald-500"
                        : item.step === 1
                          ? "bg-cyan-500"
                          : "bg-violet-500"
                    }`}
                  />
                )}
                <div
                  className={`size-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-transform group-hover:scale-105 shrink-0 ${
                    activeWorkStep === item.step
                      ? item.step === 0
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : item.step === 1
                          ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                          : "bg-violet-500/15 border-violet-500/30 text-violet-400"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-500 dark:text-white/55"
                  }`}
                >
                  {item.number}
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold mb-1 transition-colors ${
                      activeWorkStep === item.step
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-white/70"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Mockup Interface Screen */}
          <div className="lg:col-span-7">
            <div className="glass-card bg-slate-50/90 dark:bg-[#080c16]/90 border border-black/5 dark:border-white/10 rounded-3xl p-1.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden group">
              {/* Window header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02]">
                <div className="flex gap-2">
                  <span className="size-3 rounded-full bg-rose-500/30" />
                  <span className="size-3 rounded-full bg-amber-500/30" />
                  <span className="size-3 rounded-full bg-emerald-500/30" />
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-white/40 tracking-wider">
                  COGNIMEET_SIMULATOR.EXE
                </span>
                <div className="w-12" />
              </div>

              {/* Dynamic View container */}
              <div className="p-8 min-h-[360px] flex flex-col justify-center relative bg-gradient-to-b from-transparent to-[#0a0e1a]/5 dark:to-[#0a0e1a]/40">
                {/* STEP 1: CONFIGURE */}
                {activeWorkStep === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Agent Builder</h4>
                        <p className="text-[10px] text-muted-foreground">Setup cognitive traits & fallback limits</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 dark:text-white/60 block">System Persona Prompt</label>
                        <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-xl p-3 text-[11px] font-mono text-slate-800 dark:text-white/80 leading-relaxed min-h-[75px] shadow-inner">
                          <span className="text-emerald-500 dark:text-emerald-400">Instruction:</span> You are a Senior
                          Scrum Master. Attend meetings, capture API changes, update task priority lists, and generate
                          code schemas.
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div className="space-y-1.5">
                          <span className="text-slate-500 dark:text-white/60 block">Voice Synthesizer</span>
                          <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-lg p-2 text-slate-700 dark:text-white/70">
                            ElevenLabs Bella v2
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-500 dark:text-white/60 block">Fallback Engine</span>
                          <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-lg p-2 text-emerald-600 dark:text-emerald-400 font-medium">
                            Groq (Llama-3)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: MEET */}
                {activeWorkStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Live Conference Call</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">02:14 / 45:00</span>
                    </div>

                    {/* Avatars */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-3 flex flex-col items-center">
                        <div className="size-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs mb-2 shadow-inner">
                          P
                        </div>
                        <span className="text-[10px] text-slate-900 dark:text-white font-medium">You</span>
                        <span className="text-[8px] text-emerald-500 dark:text-emerald-400 font-medium">Speaking...</span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-3 flex flex-col items-center">
                        <div className="size-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs mb-2 shadow-inner">
                          S
                        </div>
                        <span className="text-[10px] text-slate-900 dark:text-white font-medium">Sarah</span>
                        <span className="text-[8px] text-muted-foreground">Muted</span>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-col items-center relative">
                        <div className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="size-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white text-xs mb-2 shadow-inner">
                          🤖
                        </div>
                        <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold">AI Assistant</span>
                        <span className="text-[8px] text-emerald-500 dark:text-emerald-400/80">Listening</span>
                      </div>
                    </div>

                    {/* Transcript */}
                    <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-xl p-3 text-[11px] font-mono text-slate-800 dark:text-white/70 space-y-1.5 shadow-inner">
                      <p>
                        <span className="text-cyan-500 dark:text-cyan-400">Sarah:</span> &quot;We need custom radial
                        cursor glows in the dashboard.&quot;
                      </p>
                      <p className="text-emerald-500 dark:text-emerald-400">
                        <span className="text-emerald-500 dark:text-emerald-400">🤖 AI Agent:</span> &quot;Added action
                        item for Parth: implement cursor glow.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: AUTOMATE */}
                {activeWorkStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Meeting Intelligence</h4>
                        <p className="text-[10px] text-muted-foreground">Post-call AI analysis</p>
                      </div>
                      <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded font-medium">
                        Complete
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                          AI Summary
                        </span>
                        <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">
                          Structured Markdown summary with key takeaways.
                        </p>
                        <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">
                          &#10003; Generated
                        </div>
                      </div>

                      <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                        <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                          Action Items
                        </span>
                        <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">
                          Commitments extracted with assignees identified.
                        </p>
                        <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">
                          &#10003; 4 Items
                        </div>
                      </div>

                      <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                        <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 block mb-1">
                          AI Follow-up Chat
                        </span>
                        <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">
                          Ask your agent questions about the meeting anytime.
                        </p>
                        <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">
                          &#10003; Ready
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
