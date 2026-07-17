"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between md:justify-center md:gap-10 py-12 md:py-0 px-4 sm:px-8 overflow-hidden select-none isolate bg-black text-white">
      {/* ── WebGL Shader Background ── */}
      <WebGLShader />

      {/* ── Content Container ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto border border-[#27272a]/55 bg-black/60 backdrop-blur-md p-1.5 rounded-[2.5rem] mt-24 md:mt-0">
        <main className="relative border border-[#27272a]/55 py-10 px-4 sm:px-8 rounded-[2.2rem] overflow-hidden bg-gradient-to-b from-zinc-900/40 to-black/80">
          {/* Header Tag */}
          <div className="my-2 flex items-center justify-center gap-1.5">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
            </span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-green-500">Available for Payouts</p>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 text-white text-center text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none">
            Design is Everything
          </h1>

          {/* Description */}
          <p className="text-white/60 px-2 sm:px-6 text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Convert your unused digital vouchers securely. Exchanging Amazon, Flipkart, Roblox, gaming & shopping cards into instant local bank payout or USDT.
          </p>

          {/* Accept list pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-xl mx-auto">
            {["Amazon", "Flipkart", "Roblox", "Overwatch 2", "League of Legends", "Sea of Thieves"].map((card) => (
              <span
                key={card}
                className="text-[9.5px] font-bold tracking-tight px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80"
              >
                {card}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Primary Action */}
            <a
              href="https://wa.me/919120138828"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <LiquidButton className="text-white border border-white/20 rounded-full font-bold shadow-lg" size="lg">
                Start Trade on WhatsApp <ArrowRight size={14} className="ml-1.5" />
              </LiquidButton>
            </a>

            {/* Secondary Action */}
            <a
              href="#brands"
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-6 text-xs font-bold text-white/90 transition-all hover:bg-white/[0.08]"
            >
              <CreditCard size={14} className="text-primary" />
              See Card Brands
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.05] text-[9.5px] text-white/40 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" /> Admin Verified
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-emerald-400" /> Secure Escrow
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Hero;
