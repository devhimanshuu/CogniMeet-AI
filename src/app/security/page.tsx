import Link from "next/link";
import { ArrowLeftIcon, ShieldCheckIcon, LockIcon, ServerIcon, EyeOffIcon } from "lucide-react";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030614] text-slate-900 dark:text-slate-200 selection:bg-emerald-500/30">
      <LandingNavbar />
      <div className="max-w-4xl mx-auto px-6 py-24 pt-36">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 mb-12 transition-colors">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center size-12 rounded-full bg-emerald-500/10 text-emerald-500">
            <ShieldCheckIcon className="size-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Security at CogniMeet</h1>
        </div>
        
        <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 mb-16">
          Your meeting data is highly sensitive. We treat it with the utmost care, utilizing enterprise-grade security protocols to ensure your transcripts and action items remain private and protected.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
            <LockIcon className="size-8 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">End-to-End Encryption</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3. Data at rest is encrypted using AES-256 encryption.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
            <ServerIcon className="size-8 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Secure Infrastructure</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We host our infrastructure on highly secure, compliant cloud providers. We regularly undergo vulnerability scanning and penetration testing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
            <EyeOffIcon className="size-8 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Strict Access Controls</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your meeting transcripts are only accessible to you and authorized participants. We do not use your meeting data to train our foundational models.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
            <ShieldCheckIcon className="size-8 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Compliance & Privacy</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We are committed to complying with global privacy frameworks, including GDPR and CCPA, giving you full control over your data retention and deletion.
            </p>
          </div>
        </div>
        
        <div className="border-t border-black/10 dark:border-white/10 pt-8 mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            If you have found a security vulnerability, please report it immediately to security@cognimeet.ai.
          </p>
        </div>
      </div>
    </div>
  );
}
