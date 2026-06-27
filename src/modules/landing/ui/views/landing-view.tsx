"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";
import { HeroSection } from "@/modules/landing/ui/components/hero-section";
import { FeaturesSection } from "@/modules/landing/ui/components/features-section";
import { HowItWorksSection } from "@/modules/landing/ui/components/how-it-works-section";
import { ProvidersSection } from "@/modules/landing/ui/components/providers-section";
import { PricingSection } from "@/modules/landing/ui/components/pricing-section";
import { CTASection } from "@/modules/landing/ui/components/cta-section";
import { FooterSection } from "@/modules/landing/ui/components/footer-section";

export const LandingView = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden gradient-bg-mesh text-foreground">
      <LandingNavbar />
      <HeroSection mounted={mounted} isSignedIn={isSignedIn} isLoaded={isLoaded} />
      <FeaturesSection />
      <HowItWorksSection />
      <ProvidersSection />
      <PricingSection />
      <CTASection mounted={mounted} />
      <FooterSection />
    </div>
  );
};
