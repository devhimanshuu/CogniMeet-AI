"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled ? "pt-4 px-4" : "pt-0 px-0 dark"}`}>
      <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
        ? "max-w-5xl bg-background/80 backdrop-blur-xl border border-border/30 shadow-lg shadow-black/10 rounded-full px-4 md:px-6 py-3 translate-y-0"
        : "max-w-7xl bg-transparent border-transparent px-6 py-5 rounded-none translate-y-0"
        }`}>
        <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0a0e1a] rounded-full p-1.5">
              <Image src="/logo.svg" height={24} width={24} alt="CogniMeet.AI" />
            </div>
          </div>
          <span className="text-lg font-bold gradient-text">CogniMeet.AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className={`text-sm transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Features</Link>
          <Link href="/#how-it-works" className={`text-sm transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>How It Works</Link>
          <Link href="/#pricing" className={`text-sm transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Pricing</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`size-9 rounded-xl border transition-colors ${scrolled
                  ? "text-muted-foreground hover:text-foreground border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  : "text-white/80 hover:text-white border-white/10 bg-white/10 hover:bg-white/20"
                }`}
            >
              {theme === "dark" ? <SunIcon className="size-4.5 text-emerald-400" /> : <MoonIcon className="size-4.5 text-violet-400" />}
            </Button>
          )}
          {mounted && isLoaded && isSignedIn ? (
            <>
              <Button
                variant="ghost"
                asChild
                className={scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className={scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRightIcon className="size-4 ml-1" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          className={`md:hidden size-9 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </Button>
      </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mt-2 p-4 animate-slide-up rounded-2xl border border-border/30 shadow-xl">
          <div className="flex flex-col gap-3">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground py-2">Features</Link>
            <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground py-2">How It Works</Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground py-2">Pricing</Link>
            <div className="border-t border-border/30 pt-3 flex flex-col gap-2">
              {mounted && (
                <Button
                  variant="outline"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center justify-center gap-2 border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground"
                >
                  {theme === "dark" ? (
                    <>
                      <SunIcon className="size-4 text-emerald-400" />
                      <span>Switch to Light Theme</span>
                    </>
                  ) : (
                    <>
                      <MoonIcon className="size-4 text-violet-500" />
                      <span>Switch to Dark Theme</span>
                    </>
                  )}
                </Button>
              )}
              {mounted && isLoaded && isSignedIn ? (
                <>
                  <Button variant="ghost" asChild className="w-full"><Link href="/dashboard">Dashboard</Link></Button>
                  <div className="flex justify-center py-2">
                    <UserButton />
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full"><Link href="/sign-in">Sign In</Link></Button>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                    <Link href="/sign-up">Get Started Free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
