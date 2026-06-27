import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030614] text-slate-900 dark:text-slate-200 selection:bg-emerald-500/30">
      <LandingNavbar />
      <div className="max-w-4xl mx-auto px-6 py-24 pt-36">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 mb-12 transition-colors">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Introduction</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              At CogniMeet.AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI meeting intelligence services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. Data Collection</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We collect information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. How We Use Your Data</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive to facilitate account creation and logon process, to post testimonials, request feedback, and to manage user accounts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Data Security</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">5. Contact Us</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              If you have questions or comments about this notice, you may email us at support@cognimeet.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
