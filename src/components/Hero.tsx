/* Hallmark · component: Hero · genre: atmospheric · theme: luxury-gold
 * states: default · hover · active
 * contrast: pass (46-50)
 */
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between md:justify-center md:gap-10 py-12 md:py-0 px-4 sm:px-8 overflow-hidden select-none isolate">
      <style>{`
        .hero-title {
          color: var(--foreground);
          text-shadow: 0 1px 3px rgba(0,0,0,0.06);
          letter-spacing: -0.03em;
        }
        .dark .hero-title {
          color: transparent;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #e4e4e7 25%,
            #f0cb87 50%,
            #d4af37 75%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          filter: drop-shadow(0 4px 40px rgba(240,203,135,0.22)) drop-shadow(0 2px 8px rgba(0,0,0,0.5));
          animation: heroShimmer 10s linear infinite;
        }
        @keyframes heroShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: 0% center; }
        }

        /* Animated gradient orbs */
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); filter: blur(100px); }
          33%       { transform: translate(70px, -50px) scale(1.15); filter: blur(120px); }
          66%       { transform: translate(-60px, 40px) scale(0.9); filter: blur(110px); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); filter: blur(90px); }
          40%       { transform: translate(-80px, 60px) scale(1.2); filter: blur(110px); }
          70%       { transform: translate(60px, -45px) scale(0.85); filter: blur(100px); }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); filter: blur(80px); }
          50%       { transform: translate(45px, 70px) scale(1.1); filter: blur(100px); }
        }
        @keyframes floatSparks {
          0%, 100% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0.2; }
          50% { transform: translateY(-40px) translateX(20px) scale(1.2); opacity: 0.8; }
        }
        @keyframes rotateAura {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-orb-1 { animation: orb1 20s ease-in-out infinite; }
        .hero-orb-2 { animation: orb2 24s ease-in-out infinite; }
        .hero-orb-3 { animation: orb3 18s ease-in-out infinite; }
        .hero-spark { animation: floatSparks 8s ease-in-out infinite; }
        .hero-aura-beam {
          animation: rotateAura 60s linear infinite;
          transform-origin: center;
        }
      `}</style>

      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Rotating ambient aura beams */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] dark:opacity-[0.04]">
          <div 
            className="hero-aura-beam w-[120vw] h-[120vw] rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, oklch(0.82 0.18 85), transparent 30%, oklch(0.7 0.18 165), transparent 70%, oklch(0.6 0.22 265), transparent)"
            }}
          />
        </div>

        {/* Ambient gold/amber glow */}
        <div
          className="hero-orb-1 absolute -top-56 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full opacity-[0.18] dark:opacity-[0.13]"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.18 85) 0%, transparent 70%)" }}
        />
        {/* Soft violet depth orb */}
        <div
          className="hero-orb-2 absolute -bottom-36 -left-36 w-[650px] h-[500px] rounded-full opacity-[0.11] dark:opacity-[0.08]"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.22 265) 0%, transparent 70%)" }}
        />
        {/* Soft cyan balance orb */}
        <div
          className="hero-orb-3 absolute top-1/4 -right-24 w-[550px] h-[450px] rounded-full opacity-[0.1] dark:opacity-[0.07]"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.18 165) 0%, transparent 70%)" }}
        />

        {/* Floating background spark elements */}
        <div className="absolute inset-0 z-1">
          <div className="hero-spark absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-primary/40 blur-[1px]" style={{ animationDelay: "0s" }} />
          <div className="hero-spark absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-primary/30 blur-[1px]" style={{ animationDelay: "2s" }} />
          <div className="hero-spark absolute bottom-[30%] left-[35%] w-1 h-1 rounded-full bg-cyan-400/40" style={{ animationDelay: "4s" }} />
          <div className="hero-spark absolute top-[60%] left-[15%] w-2.5 h-2.5 rounded-full bg-rose-400/20 blur-[2px]" style={{ animationDelay: "1s" }} />
          <div className="hero-spark absolute bottom-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-primary/40 blur-[1px]" style={{ animationDelay: "3s" }} />
        </div>

        {/* Dynamic vignette filters */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center order-1 mt-24 sm:mt-0 pointer-events-none w-full">
        {/* Brand Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-foreground/[0.03] border border-border/80 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-6 shadow-sm select-none">
          <Zap size={11} className="text-primary fill-primary/10 animate-pulse" />
          <span>Instant Settlement Platform</span>
        </div>
        <h1 className="hero-title flex flex-row items-center justify-center gap-2.5 sm:gap-4 lg:gap-6 px-1 py-2 w-full flex-wrap text-[3.2rem] xs:text-[3.6rem] sm:text-7xl md:text-8xl lg:text-9xl leading-[1.02]">
          <span className="font-serif italic font-medium">Exchange</span>
          <span className="font-sans font-extrabold tracking-tighter">Gift Cards.</span>
        </h1>
      </div>

      {/* ── Description & Card Chips ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto md:my-0 order-2 px-1 w-full pointer-events-none">
        <p className="text-sm sm:text-lg md:text-xl font-light text-foreground/80 max-w-[92%] sm:max-w-md md:max-w-xl px-1 leading-relaxed">
          Convert your unused digital vouchers securely. Exchanging Amazon, Flipkart, Roblox, gaming & shopping cards into instant local bank payout or USDT.
        </p>

        {/* Enhanced Visual Card Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-xl px-4 pointer-events-auto">
          {["Amazon", "Flipkart", "Roblox", "Overwatch 2", "League of Legends", "Sea of Thieves"].map((card) => (
            <span
              key={card}
              className="text-[10px] font-bold tracking-tight px-4 py-2 rounded-xl bg-card/40 border border-border/40 text-foreground/85 shadow-sm hover:border-primary/50 hover:bg-card/85 transition-all duration-300 hover:scale-105 cursor-default"
            >
              {card}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action Buttons & Trust Meta ── */}
      <div
        className={cn(
          "relative z-10 pointer-events-auto flex flex-col items-center justify-center gap-4 mt-6 md:mt-10 mb-4 md:mb-0 order-4 transition-all duration-1000 transform px-1",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="flex flex-row items-center gap-3">
          {/* WhatsApp Primary */}
          <a
            href="https://wa.me/919120138828"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex h-11 md:h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary/95 to-primary px-6 md:px-10 text-xs md:text-sm font-bold text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_2px_8px_rgba(0,0,0,0.15),0_12px_36px_rgba(240,203,135,0.3)] ring-1 ring-primary/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.2),0_16px_48px_rgba(240,203,135,0.45)] active:scale-[0.98] cursor-pointer"
          >
            <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white dark:fill-black shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
            </svg>
            <span className="inline md:hidden">Start Trade</span>
            <span className="hidden md:inline">Start Trade on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Secondary Brands */}
          <a
            href="#brands"
            className="relative inline-flex h-11 md:h-13 items-center justify-center gap-2 rounded-xl bg-card/80 backdrop-blur-md px-6 md:px-8 text-xs md:text-sm font-bold text-card-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.06)] ring-1 ring-border/60 transition-all duration-300 hover:scale-[1.02] hover:ring-border/80 active:scale-[0.98] cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="inline md:hidden">Cards</span>
            <span className="hidden md:inline">See Card Brands</span>
          </a>
        </div>

        {/* Fine Trust details */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 font-sans font-medium tracking-wide">
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-emerald-400" /> Instant Settlement
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-400" /> Admin Verified
          </span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
