"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  title: string;
  monthlyPrice: string;
  yearlyPrice: string;
  billingCycle: "monthly" | "yearly";
  description: string;
  features: string[];
  highlighted?: boolean;
  delay: number;
}

export const PricingCard = ({
  title,
  monthlyPrice,
  yearlyPrice,
  billingCycle,
  description,
  features,
  highlighted,
  delay,
}: PricingCardProps) => {
  const price = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`relative glass-card p-10 flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 group animate-slide-up ${
        highlighted
          ? "shifting-gradient-border shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] border-emerald-500/30"
          : "border-white/5 hover:border-white/10"
      }`}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10 flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300">
          {price}
        </span>
        {price !== "Free" && (
          <span className="text-muted-foreground text-sm font-medium ml-1">
            {billingCycle === "monthly" ? "/month" : "/month, billed annually"}
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-white/80 transition-colors"
          >
            <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1 group-hover:bg-emerald-500/20 transition-colors">
              <CheckIcon className="size-3.5 text-emerald-400 shrink-0" />
            </div>
            {f}
          </li>
        ))}
      </ul>
      {mounted && isLoaded && isSignedIn ? (
        <Button
          className={
            highlighted
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
          className={
            highlighted
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.7)] w-full h-14 rounded-2xl text-base transition-all hover:scale-[1.03]"
              : "w-full h-14 rounded-2xl text-base bg-background/50 backdrop-blur-sm border-black/10 dark:border-white/10 hover:bg-secondary/50 transition-all hover:scale-[1.03]"
          }
          variant={highlighted ? "default" : "outline"}
          asChild
        >
          <Link href="/sign-up">
            {highlighted ? "Get Started" : "Start Free"}
          </Link>
        </Button>
      )}
    </div>
  );
};
