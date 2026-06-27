import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030614] text-slate-900 dark:text-slate-200 selection:bg-emerald-500/30">
      <LandingNavbar />
      <div className="max-w-4xl mx-auto px-6 py-24 pt-36">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 mb-12 transition-colors">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Agreement to Terms</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and CogniMeet.AI ("Company", "we", "us", or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. Intellectual Property Rights</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. User Representations</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Prohibited Activities</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
