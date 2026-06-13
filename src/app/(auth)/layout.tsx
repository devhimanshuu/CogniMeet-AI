import Link from "next/link";
import Image from "next/image";
import { SparklesIcon, BotIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0e1a] text-white overflow-hidden px-4 py-12 md:px-6">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Side: Welcome Screen (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-6 flex-col justify-between h-full min-h-[500px] text-left space-y-8 animate-slide-up">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0a0e1a] rounded-full p-1.5">
                  <Image src="/logo.svg" height={24} width={24} alt="CogniMeet.AI" />
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">CogniMeet.AI</span>
            </Link>

            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Unlock the Power of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                Meeting Intelligence
              </span>
            </h1>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Experience zero-downtime audio summarization, real-time speaker attribution, and direct task board synchronization.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 max-w-sm">
            {[
              { icon: <BotIcon className="size-4 text-emerald-400" />, title: "Custom AI Presets", desc: "Deploy Scrum, Sales, or Product personas." },
              { icon: <ZapIcon className="size-4 text-cyan-400" />, title: "Direct Sync Integrations", desc: "Push summaries directly to Jira, Notion, and Slack." },
              { icon: <ShieldCheckIcon className="size-4 text-violet-400" />, title: "Enterprise Security", desc: "SOC2 audited, end-to-end 256-bit encryption." }
            ].map((f, i) => (
              <div key={i} className="flex gap-3 items-start bg-slate-900/40 border border-white/5 p-3.5 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="mt-0.5 rounded-full bg-slate-950 p-1.5 border border-white/10 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{f.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer operational badge */}
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational • SOC2 Certified
          </div>
        </div>

        {/* Right Side: Auth Card wrapper */}
        <div className="md:col-span-6 w-full flex justify-center items-center">
          <div className="w-full max-w-[420px] flex flex-col justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
