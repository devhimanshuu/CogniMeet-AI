import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        variables: {
          colorPrimary: "#10b981",
          colorBackground: "#070a13",
          colorInputBackground: "#0b0f19",
          colorInputText: "#ffffff",
          colorTextSecondary: "#94a3b8",
          colorText: "#ffffff",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "1rem",
        },
        elements: {
          card: "bg-slate-950/80 border border-white/10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] backdrop-blur-xl w-full",
          headerTitle: "text-white font-bold text-xl",
          headerSubtitle: "text-slate-400 text-xs",
          socialButtonsBlockButton: "border border-white/10 bg-slate-900/50 hover:bg-slate-800/50 text-white font-semibold transition-colors rounded-xl",
          socialButtonsBlockButtonText: "text-white font-medium text-xs",
          formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] h-11 rounded-xl",
          formFieldLabel: "text-slate-300 font-semibold text-xs",
          formFieldInput: "border border-white/10 bg-slate-900/50 text-white focus:border-emerald-500/50 h-10 rounded-xl",
          footerActionText: "text-slate-400 text-xs",
          footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold text-xs",
          branding: "hidden",
        }
      }}
    />
  );
}
