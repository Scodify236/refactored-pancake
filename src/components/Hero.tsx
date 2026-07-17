"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between md:justify-center md:gap-8 py-8 md:py-0 px-2 sm:px-6 overflow-hidden select-none isolate">
      <style>{`
        .hero-title {
          color: var(--foreground);
          text-shadow: 0 1px 2px rgba(0,0,0,0.04);
          letter-spacing: -0.02em;
        }
        .dark .hero-title {
          color: transparent;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,0.98) 0%,
            rgba(255,255,255,0.55) 30%,
            rgba(240,203,135,0.7) 50%,
            rgba(255,255,255,0.6) 65%,
            rgba(255,255,255,0.95) 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          filter: drop-shadow(0 4px 32px rgba(240,203,135,0.18)) drop-shadow(0 1px 4px rgba(0,0,0,0.4));
          animation: heroShimmer 9s linear infinite;
        }
        @keyframes heroShimmer {
          0%   { background-position: 250% center; }
          100% { background-position: 0%   center; }
        }

        /* Animated gradient orbs */
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.08); }
          66%       { transform: translate(-30px, 20px) scale(0.96); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-50px, 30px) scale(1.1); }
          70%       { transform: translate(35px, -20px) scale(0.95); }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, 40px) scale(1.06); }
        }
        .hero-orb-1 { animation: orb1 14s ease-in-out infinite; }
        .hero-orb-2 { animation: orb2 18s ease-in-out infinite; }
        .hero-orb-3 { animation: orb3 12s ease-in-out infinite; }
      `}</style>

      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary amber/gold orb — top center */}
        <div
          className="hero-orb-1 absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.13] dark:opacity-[0.09]"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.82 0.18 85) 0%, transparent 70%)" }}
        />
        {/* Secondary blue/indigo orb — bottom left */}
        <div
          className="hero-orb-2 absolute -bottom-20 -left-20 w-[500px] h-[400px] rounded-full opacity-[0.08] dark:opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.65 0.2 265) 0%, transparent 70%)" }}
        />
        {/* Tertiary green/teal orb — right */}
        <div
          className="hero-orb-3 absolute top-1/3 -right-10 w-[420px] h-[360px] rounded-full opacity-[0.07] dark:opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.72 0.18 165) 0%, transparent 70%)" }}
        />

        {/* Soft top vignette to fade orbs into the bg */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        {/* Soft bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Heading ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center order-1 mt-28 sm:mt-0 pointer-events-none w-full">
        <h1 className="hero-title flex flex-row items-center justify-center gap-1.5 sm:gap-4 lg:gap-6 px-1 py-2 w-full flex-wrap text-[2.8rem] xs:text-[3.2rem] sm:text-6xl md:text-8xl lg:text-9xl leading-[1.05]">
          <span className="font-serif italic font-medium">Exchange</span>
          <span className="font-sans font-extrabold tracking-tighter">Gift Cards.</span>
        </h1>
      </div>

      {/* ── Description & Pill tags ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto md:my-0 order-2 px-1 w-full pointer-events-none">
        <p className="text-sm sm:text-lg md:text-xl font-light text-foreground/80 max-w-[92%] sm:max-w-md md:max-w-xl px-1 leading-relaxed">
          Turn your unused Amazon, Flipkart, Roblox, League of Legends, Overwatch 2, and Sea of Thieves gift cards into UPI cash or USDT instantly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-7 max-w-xl px-4 pointer-events-auto">
          <span className="text-[9.5px] font-bold tracking-widest uppercase text-muted-foreground/70 mr-1 font-mono">We Accept:</span>
          {["Amazon", "Flipkart", "Roblox", "Overwatch 2", "League of Legends", "Sea of Thieves"].map((card) => (
            <span
              key={card}
              className="text-[10px] font-semibold px-3 py-1 rounded-full bg-foreground/[0.04] border border-border/50 text-foreground/85 shadow-sm hover:border-primary/40 hover:text-foreground transition-colors duration-200"
            >
              {card}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTAs ── */}
      <div
        className={cn(
          "relative z-10 pointer-events-auto flex flex-col items-center justify-center gap-4 mt-4 md:mt-8 mb-4 md:mb-0 order-4 transition-all duration-1000 transform px-1",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="flex flex-row items-center gap-3">
          {/* Primary CTA */}
          <a
            href="https://wa.me/919120138828"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex h-10 md:h-12 items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-gradient-to-b from-primary/90 to-primary px-5 md:px-8 text-xs md:text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.15),0_12px_32px_rgba(240,203,135,0.25)] ring-1 ring-primary/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.2),0_16px_40px_rgba(240,203,135,0.35)] active:scale-[0.98] cursor-pointer"
          >
            <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white dark:fill-black shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
            </svg>
            <span className="inline md:hidden">Start Trade</span>
            <span className="hidden md:inline">Start Trade on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>

          {/* Secondary CTA */}
          <a
            href="#brands"
            className="relative inline-flex h-10 md:h-12 items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-card/70 backdrop-blur-md px-5 md:px-8 text-xs md:text-sm font-semibold text-card-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.06)] ring-1 ring-border/60 transition-all duration-200 hover:scale-[1.02] hover:ring-border active:scale-[0.98] cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="inline md:hidden">Cards</span>
            <span className="hidden md:inline">See Card Brands</span>
          </a>
        </div>

        {/* Small trust line — no badge, just text */}
        <p className="text-[10px] text-muted-foreground/60 font-sans font-medium tracking-wide">
          Instant settlement · Admin verified · Secure escrow
        </p>
      </div>
    </div>
  );
}

export default Hero;
