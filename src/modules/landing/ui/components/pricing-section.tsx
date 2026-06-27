"use client";

import { useState } from "react";
import { PricingCard } from "./pricing-card";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
      <div className="w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 animate-slide-up">
            Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Start Free, Scale When Ready
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Get robust multi-llm intelligence for your meetings. Toggle to yearly billing for a 20% discount.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1.5 rounded-full mb-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-muted-foreground hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "yearly"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
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
  );
};
