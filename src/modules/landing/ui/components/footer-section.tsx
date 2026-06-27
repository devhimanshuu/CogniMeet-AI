"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Twitter as TwitterIcon,
  GlobeIcon,
} from "lucide-react";

export const FooterSection = () => {
  return (
    <footer className="relative border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#030614] pt-24 pb-12 overflow-hidden flex flex-col items-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Big Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full flex justify-center z-0 overflow-hidden">
        <span className="text-[18vw] font-black tracking-tighter uppercase whitespace-nowrap select-none bg-gradient-to-b from-slate-900/10 to-slate-900/0 dark:from-white/10 dark:to-white/0 bg-clip-text text-transparent">
          COGNIMEET
        </span>
      </div>

      <div className="w-full px-8 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
          {/* Branding Column */}
          <div className="col-span-2 md:col-span-5 space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="relative bg-white dark:bg-[#0a0e1a] rounded-full p-2 border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-transform group-hover:scale-105 duration-300">
                <Image src="/logo.svg" height={28} width={28} alt="CogniMeet.AI" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 tracking-tight">
                CogniMeet.AI
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The world&apos;s most advanced AI meeting coworker. Zero-downtime, speaker-attributed meeting
              intelligence for teams that move fast.
            </p>

            <div className="flex items-center gap-3 pt-4">
              <a
                href="https://github.com/devhimanshuu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <GithubIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/himanshu-guptaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <LinkedinIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </a>
              <a
                href="https://x.com/devhimanshuu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <TwitterIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </a>
              <a
                href="https://himanshuguptaa.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <GlobeIcon className="size-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-2 md:col-start-7 space-y-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 space-y-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 py-2 px-4 rounded-full border border-black/5 dark:border-white/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-emerald-400/90 tracking-wide uppercase">
              All Systems Operational
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} CogniMeet.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
