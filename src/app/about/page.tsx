import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030614] text-slate-900 dark:text-slate-200 selection:bg-emerald-500/30">
      <LandingNavbar />
      <div className="max-w-4xl mx-auto px-6 py-24 pt-36">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 mb-12 transition-colors">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="relative bg-white dark:bg-[#0a0e1a] rounded-full p-3 border border-black/10 dark:border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Image src="/logo.svg" height={40} width={40} alt="CogniMeet.AI" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">About CogniMeet.AI</h1>
        </div>
        
        <div className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            CogniMeet.AI was born out of a simple frustration: meetings are essential, but the overhead of taking notes, capturing action items, and following up is tedious and error-prone. We envisioned a world where you could be fully present in every conversation, knowing an intelligent coworker was capturing everything perfectly.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Our Mission</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Our mission is to eliminate meeting fatigue and lost information by providing the most accurate, zero-downtime AI meeting intelligence available. We want to empower teams to move faster, communicate better, and focus on what truly matters: doing great work.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Why We Built This</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Current transcription tools are often slow, lack accurate speaker attribution, and fail to provide actionable insights in real-time. By leveraging state-of-the-art AI infrastructure provided by Groq, and powerful real-time communication via Stream, we built CogniMeet to be instantly responsive. When a meeting ends, your insights are already waiting for you.
            </p>
          </section>

          <div className="my-16 p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Join us on our journey</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We are constantly innovating and pushing the boundaries of what AI can do for team productivity. Try CogniMeet.AI today and experience the future of meetings.
            </p>
            <Link href="/sign-up" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-colors">
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
