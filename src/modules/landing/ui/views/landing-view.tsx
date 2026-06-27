"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  SparklesIcon,
  VideoIcon,
  BotIcon,
  FileTextIcon,
  BrainCircuitIcon,
  ZapIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
  MenuIcon,
  XIcon,
  BarChart3Icon,
  MessagesSquareIcon,
  TargetIcon,
  GlobeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Twitter as TwitterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";


/* ───────────── Pricing Card ───────────── */
const PricingCard = ({ title, monthlyPrice, yearlyPrice, billingCycle, description, features, highlighted, delay }: {
  title: string; monthlyPrice: string; yearlyPrice: string; billingCycle: "monthly" | "yearly"; description: string; features: string[]; highlighted?: boolean; delay: number;
}) => {
  const price = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`relative glass-card p-10 flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 group animate-slide-up ${highlighted
          ? "shifting-gradient-border shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] border-emerald-500/30"
          : "border-white/5 hover:border-white/10"
        }`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10 flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300">{price}</span>
        {price !== "Free" && (
          <span className="text-muted-foreground text-sm font-medium ml-1">
            {billingCycle === "monthly" ? "/month" : "/month, billed annually"}
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-white/80 transition-colors">
            <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1 group-hover:bg-emerald-500/20 transition-colors">
              <CheckIcon className="size-3.5 text-emerald-400 shrink-0" />
            </div>
            {f}
          </li>
        ))}
      </ul>
      {mounted && isLoaded && isSignedIn ? (
        <Button
          className={highlighted
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.7)] w-full h-14 rounded-2xl text-base transition-all hover:scale-[1.03]"
            : "w-full h-14 rounded-2xl text-base bg-background/50 backdrop-blur-sm border-black/10 dark:border-white/10 hover:bg-secondary/50 transition-all hover:scale-[1.03]"
          }
          variant={highlighted ? "default" : "outline"}
          asChild
        >
          <Link href={highlighted ? "/upgrade" : "/dashboard"}>
            {highlighted ? "Upgrade Now" : "Go to Dashboard"}
          </Link>
        </Button>
      ) : (
        <Button
          className={highlighted
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.7)] w-full h-14 rounded-2xl text-base transition-all hover:scale-[1.03]"
            : "w-full h-14 rounded-2xl text-base bg-background/50 backdrop-blur-sm border-black/10 dark:border-white/10 hover:bg-secondary/50 transition-all hover:scale-[1.03]"
          }
          variant={highlighted ? "default" : "outline"}
          asChild
        >
          <Link href="/sign-up">{highlighted ? "Get Started" : "Start Free"}</Link>
        </Button>
      )}
    </div>
  );
};

/* ───────────── Main Landing View ───────────── */
export const LandingView = () => {
  const { theme } = useTheme();
  const [activeWorkStep, setActiveWorkStep] = useState(0); // 0: Configure, 1: Meet, 2: Automate
  const [summaryStep, setSummaryStep] = useState(0);
  const [actionItemChecked, setActionItemChecked] = useState(false);
  const [analyticsHovered, setAnalyticsHovered] = useState(false);
  const [activeProvider, setActiveProvider] = useState("groq");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const [ctaCoords, setCtaCoords] = useState({ x: 0, y: 0 });
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCtaCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="min-h-screen gradient-bg-mesh text-foreground">
      <LandingNavbar />

      {/* ═══ HERO ═══ */}
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
            "ZERO DOWNTIME"
          ]}
        />

        {/* Background Effects (to give a nice glow behind the text) */}
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
            <span className="text-slate-300 font-medium">Powered by AI Agents — Groq, ElevenLabs & More</span>
          </div>

          {/* Spacer to allow the Particle Text (which is centered) to be clearly visible */}
          <div className="flex-1 min-h-[140px] md:min-h-[300px]" />

          {/* Bottom Content */}
          <div className="mt-auto pointer-events-auto w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-slate-950/60 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed relative z-10">
                CogniMeet.AI brings intelligent agents into your video meetings. They listen, take notes, extract action items, search the web, and generate insights — all in real time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 relative z-10">
                {mounted && isLoaded && isSignedIn ? (
                  <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl transition-all hover:scale-105">
                    <Link href="/dashboard">
                      <SparklesIcon className="size-4 sm:size-5 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl transition-all hover:scale-105">
                    <Link href="/sign-up">
                      <SparklesIcon className="size-4 sm:size-5 mr-2" />
                      Get Started Free
                    </Link>
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-slate-800/50 px-8 md:px-10 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl bg-slate-900/30 text-white backdrop-blur-sm transition-all hover:scale-105">
                  <a href="#features">
                    Discover Features
                    <ArrowRightIcon className="size-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="mt-6 md:mt-8 text-xs font-medium text-slate-500 tracking-widest uppercase animate-fade-in" style={{ animationDelay: "1s" }}>
              Hover & click to interact with particles
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
              <SparklesIcon className="size-3" /> Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>Everything Your Meetings Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>Powered by a multi-provider AI fallback architecture that never lets you down.</p>
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
                  <div className={`transition-all duration-500 delay-200 ${summaryStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                    <p className="font-semibold text-cyan-400 mb-1">⚡ Action Item</p>
                    <p className="text-slate-700 dark:text-white/70 pl-3 border-l border-cyan-500/30">Sarah to complete Stripe webhook integration by Friday.</p>
                  </div>
                  <div className={`transition-all duration-500 delay-400 ${summaryStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
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
                    <span className="text-slate-700 dark:text-white/70">Let's verify Tavily fallback.</span>
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
                  <span className="text-[10px] text-slate-600 dark:text-white/55 font-mono overflow-hidden whitespace-nowrap text-ellipsis w-full">"Groq rate limits 2026"</span>
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
                  <div className={`size-3.5 rounded border transition-all duration-300 flex items-center justify-center ${actionItemChecked ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'border-black/20 dark:border-white/20 text-transparent'}`}>
                    ✓
                  </div>
                  <span className={`transition-all duration-300 ${actionItemChecked ? 'line-through text-slate-400 dark:text-white/40' : 'text-slate-700 dark:text-white/70'}`}>
                    Test fallback routing
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 6: Meeting Analytics Dashboard (Double Column) */}
            <div className="md:col-span-2 glass-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_45px_-15px_rgba(244,63,94,0.1)] group flex flex-col justify-between overflow-hidden relative min-h-[350px]"
              onMouseEnter={() => setAnalyticsHovered(true)}
              onMouseLeave={() => setAnalyticsHovered(false)}>
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
                    <div className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-500" /> Sarah (45%)</div>
                    <div className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-cyan-500" /> Parth (30%)</div>
                    <div className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-violet-500" /> AI Agent (25%)</div>
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
                  <div className="size-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white text-[10px]">AI</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Bella</p>
                    <p className="text-[9px] text-muted-foreground">Scrum Master Persona</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-[10px] text-slate-800 dark:text-white">
                  <div className="flex justify-between text-slate-600 dark:text-white/60">
                    <span>Voice Model:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono">ElevenLabs v2</span>
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
              <ZapIcon className="size-3" /> How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>Three Steps to Smarter Meetings</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              From setup to automation, see how CogniMeet.AI handles meeting intelligence for your team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Step selectors */}
            <div className="lg:col-span-5 space-y-6">
              {[
                {
                  step: 0,
                  number: "01",
                  title: "Configure Your Agent",
                  description: "Give your AI coworker a customized role, select synthesis voices, and adjust parameters to fit your sprint style.",
                },
                {
                  step: 1,
                  number: "02",
                  title: "Meet & Converse",
                  description: "Host your video conference. The agent joins, listens, attributes speakers, and executes live lookups automatically.",
                },
                {
                  step: 2,
                  number: "03",
                  title: "Review & Act",
                  description: "Review AI-generated summaries, action items, key decisions, and continue chatting with your agent for follow-ups.",
                }
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setActiveWorkStep(item.step)}
                  onMouseEnter={() => setActiveWorkStep(item.step)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-5 relative overflow-hidden group cursor-pointer ${activeWorkStep === item.step
                      ? "bg-black/5 dark:bg-white/[0.04] border-black/10 dark:border-white/10 shadow-lg"
                      : "bg-transparent border-transparent hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                    }`}
                >
                  {activeWorkStep === item.step && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.step === 0 ? "bg-emerald-500" : item.step === 1 ? "bg-cyan-500" : "bg-violet-500"
                      }`} />
                  )}
                  <div className={`size-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-transform group-hover:scale-105 shrink-0 ${activeWorkStep === item.step
                      ? (item.step === 0 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : item.step === 1 ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-violet-500/15 border-violet-500/30 text-violet-400")
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-500 dark:text-white/55"
                    }`}>
                    {item.number}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 transition-colors ${activeWorkStep === item.step ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-white/70"}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
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
                  <span className="text-[11px] font-mono text-slate-500 dark:text-white/40 tracking-wider">COGNIMEET_SIMULATOR.EXE</span>
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
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">Ready</span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-500 dark:text-white/60 block">System Persona Prompt</label>
                          <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-xl p-3 text-[11px] font-mono text-slate-800 dark:text-white/80 leading-relaxed min-h-[75px] shadow-inner">
                            <span className="text-emerald-500 dark:text-emerald-400">Instruction:</span> You are a Senior Scrum Master. Attend meetings, capture API changes, update task priority lists, and generate code schemas.
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
                          <div className="size-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs mb-2 shadow-inner">P</div>
                          <span className="text-[10px] text-slate-900 dark:text-white font-medium">You</span>
                          <span className="text-[8px] text-emerald-500 dark:text-emerald-400 font-medium">Speaking...</span>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-3 flex flex-col items-center">
                          <div className="size-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs mb-2 shadow-inner">S</div>
                          <span className="text-[10px] text-slate-900 dark:text-white font-medium">Sarah</span>
                          <span className="text-[8px] text-muted-foreground">Muted</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-col items-center relative">
                          <div className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <div className="size-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white text-xs mb-2 shadow-inner">🤖</div>
                          <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold">AI Assistant</span>
                          <span className="text-[8px] text-emerald-500 dark:text-emerald-400/80">Listening</span>
                        </div>
                      </div>

                      {/* Transcript */}
                      <div className="bg-black/5 dark:bg-[#0b0f19] border border-black/5 dark:border-white/5 rounded-xl p-3 text-[11px] font-mono text-slate-800 dark:text-white/70 space-y-1.5 shadow-inner">
                        <p><span className="text-cyan-500 dark:text-cyan-400">Sarah:</span> "We need custom radial cursor glows in the dashboard."</p>
                        <p className="text-emerald-500 dark:text-emerald-400"><span className="text-emerald-500 dark:text-emerald-400">🤖 AI Agent:</span> "Added action item for Parth: implement cursor glow."</p>
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
                        <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded font-medium">Complete</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">AI Summary</span>
                          <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">Structured Markdown summary with key takeaways.</p>
                          <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">&#10003; Generated</div>
                        </div>

                        <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                          <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">Action Items</span>
                          <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">Commitments extracted with assignees identified.</p>
                          <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">&#10003; 4 Items</div>
                        </div>

                        <div className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl p-3 transition-colors">
                          <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 block mb-1">AI Follow-up Chat</span>
                          <p className="text-[8px] text-slate-500 dark:text-white/50 leading-tight">Ask your agent questions about the meeting anytime.</p>
                          <div className="mt-2 text-[8px] text-emerald-500 dark:text-emerald-400 font-semibold">&#10003; Ready</div>
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

      {/* ═══ AI PROVIDERS ═══ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-4 animate-slide-up">Cascading Reliability</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>Zero-Downtime AI Architecture</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Every request cascades through multiple premium models. If a provider experiences latency or outage, the engine switches in milliseconds.
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
                  <path d="M 0 88 C 50 88, 50 15, 100 15" stroke={activeProvider === "groq" ? "#10b981" : "rgba(255,255,255,0.1)"} strokeWidth={activeProvider === "groq" ? "2.5" : "1"} className={activeProvider === "groq" ? "animate-dash-fast" : ""} />
                  <path d="M 0 88 C 50 88, 50 65, 100 65" stroke={activeProvider === "openrouter" ? "#22d3ee" : "rgba(255,255,255,0.1)"} strokeWidth={activeProvider === "openrouter" ? "2.5" : "1"} className={activeProvider === "openrouter" ? "animate-dash-fast" : ""} />
                  <path d="M 0 88 C 50 88, 50 115, 100 115" stroke={activeProvider === "elevenlabs" ? "#a78bfa" : "rgba(255,255,255,0.1)"} strokeWidth={activeProvider === "elevenlabs" ? "2.5" : "1"} className={activeProvider === "elevenlabs" ? "animate-dash-fast" : ""} />
                  <path d="M 0 88 C 50 88, 50 165, 100 165" stroke={activeProvider === "huggingface" ? "#f59e0b" : "rgba(255,255,255,0.1)"} strokeWidth={activeProvider === "huggingface" ? "2.5" : "1"} className={activeProvider === "huggingface" ? "animate-dash-fast" : ""} />
                </svg>
              </div>

              {/* 3. Providers Stack */}
              <div className="col-span-3 flex flex-col gap-3 justify-center">
                {[
                  { key: "groq", name: "Groq", role: "Primary LLM", latency: "12ms", state: "Active Primary", color: "border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5" },
                  { key: "openrouter", name: "OpenRouter", role: "Fallback LLM", latency: "45ms", state: "Standby Failover", color: "border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-500/5" },
                  { key: "elevenlabs", name: "ElevenLabs", role: "Voice Synthesis", latency: "18ms", state: "Active Audio", color: "border-violet-500/20 hover:border-violet-500/40 text-violet-400 bg-violet-500/5" },
                  { key: "huggingface", name: "HuggingFace", role: "Final Fallback", latency: "140ms", state: "Standby Offline", color: "border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-500/5" }
                ].map((p) => (
                  <div
                    key={p.key}
                    onMouseEnter={() => setActiveProvider(p.key)}
                    className={`border rounded-xl p-3.5 transition-all duration-300 cursor-pointer ${p.color} ${activeProvider === p.key ? "scale-[1.03] bg-black/[0.02] dark:bg-white/[0.02]" : "opacity-60"
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
              {[
                { name: "Groq", role: "Primary LLM", details: "Active Primary • 12ms", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400" },
                { name: "OpenRouter", role: "Fallback LLM", details: "Standby • 45ms", color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400" },
                { name: "ElevenLabs", role: "Voice AI", details: "Active Audio • 18ms", color: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400" },
                { name: "HuggingFace", role: "Final Fallback", details: "Standby • Offline", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400" },
              ].map((p) => (
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

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
              Pricing Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>Start Free, Scale When Ready</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Get robust multi-llm intelligence for your meetings. Toggle to yearly billing for a 20% discount.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1.5 rounded-full mb-8">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${billingCycle === "monthly"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${billingCycle === "yearly"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                Yearly Billing
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold border border-emerald-500/10">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              delay={0.2}
              title="Free Plan"
              monthlyPrice="Free"
              yearlyPrice="Free"
              billingCycle={billingCycle}
              description="Perfect for individuals trying out meeting coworkers"
              features={[
                "Up to 5 meetings",
                "Up to 3 AI agents",
                "AI summaries & transcripts",
                "Post-meeting AI chat",
                "Basic analytics dashboard",
              ]}
            />
            <PricingCard
              delay={0.4}
              title="Pro Plan"
              monthlyPrice="$19"
              yearlyPrice="$15"
              billingCycle={billingCycle}
              description="For builders, startups, and high-velocity teams"
              features={[
                "Unlimited meetings",
                "Unlimited AI agents",
                "Priority LLM processing",
                "Advanced analytics dashboard",
                "Tavily web search integration",
                "Action items & key decisions",
                "Meeting health scoring",
              ]}
              highlighted
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full max-w-4xl mx-auto" />
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>

          {/* Glowing cursor tracking card */}
          <div
            onMouseMove={handleCtaMouseMove}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              background: ctaHovered
                ? `radial-gradient(600px circle at ${ctaCoords.x}px ${ctaCoords.y}px, rgba(16, 185, 129, 0.12), transparent 45%), var(--cta-bg)`
                : "var(--cta-bg)",
              transition: "background 0.3s ease"
            }}
            className="glass-card p-16 md:p-24 rounded-[3rem] border border-black/10 dark:border-white/10 shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <SparklesIcon className="size-16 text-emerald-400 mx-auto relative z-10" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white relative z-10">Ready to Transform Your Meetings?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed relative z-10">
              Join teams around the world using AI-powered meeting intelligence to make every sync count.
            </p>

            {mounted && isLoaded && isSignedIn ? (
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] px-12 h-16 text-lg rounded-2xl relative z-10 transition-transform hover:scale-[1.05] duration-300">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRightIcon className="size-5 ml-3" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] px-12 h-16 text-lg rounded-2xl relative z-10 transition-transform hover:scale-[1.05] duration-300">
                <Link href="/sign-up">
                  Get Started For Free
                  <ArrowRightIcon className="size-5 ml-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#030614] pt-24 pb-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
            {/* Branding Column */}
            <div className="col-span-2 md:col-span-5 space-y-6">
              <div className="flex items-center gap-3 group">
                <div className="relative bg-white dark:bg-[#0a0e1a] rounded-full p-2 border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-transform group-hover:scale-105 duration-300">
                  <Image src="/logo.svg" height={28} width={28} alt="CogniMeet.AI" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 tracking-tight">CogniMeet.AI</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                The world's most advanced AI meeting coworker. Zero-downtime, speaker-attributed meeting intelligence for teams that move fast.
              </p>
              
              <div className="flex items-center gap-3 pt-4">
                <a href="https://github.com/devhimanshuu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                   <GithubIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/himanshu-guptaa/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                   <LinkedinIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </a>
                <a href="https://x.com/devhimanshuu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                   <TwitterIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </a>
                <a href="https://himanshuguptaa.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                   <GlobeIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="col-span-1 md:col-span-2 md:col-start-7 space-y-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-2 space-y-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 py-2 px-4 rounded-full border border-black/5 dark:border-white/5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-emerald-400/90 tracking-wide uppercase">All Systems Operational</span>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} CogniMeet.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

