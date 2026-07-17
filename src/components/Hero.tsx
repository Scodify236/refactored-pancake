/* Hallmark · component: Hero · genre: atmospheric · theme: modern-minimal
 * states: default · hover · active
 * contrast: pass (46-50)
 */
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CreditCard, ShieldCheck, Zap, Coins, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-center py-20 px-4 sm:px-8 overflow-hidden select-none isolate bg-background">
      <style>{`
        .headline-span {
          background: linear-gradient(135deg, #ffffff 30%, #f0cb87 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .dark .headline-span {
          filter: drop-shadow(0 2px 10px rgba(240, 203, 135, 0.15));
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float-card {
          animation: floatCard 8s ease-in-out infinite;
        }
        @keyframes subtleGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-subtle-glow {
          animation: subtleGlow 6s ease-in-out infinite;
        }
      `}</style>

      {/* ── Background Grid & Glowing Aura ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric gradient */}
        <div 
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.15] dark:opacity-[0.1] blur-[120px] animate-subtle-glow"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.18 85) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-[0.06] blur-[100px]"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.22 265) 0%, transparent 70%)" }}
        />
        {/* Vignettes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Asymmetrical Hero Content Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Context Editorial Console */}
        <div className="lg:col-span-7 text-left space-y-8 flex flex-col justify-center">
          
          {/* Trust Banner Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/[0.03] border border-border/60 text-[10px] font-bold uppercase tracking-wider text-primary w-fit">
            <Zap size={11} className="fill-primary/10" />
            <span>Secure Redemption Gateway</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold font-display leading-[1.05] tracking-tight text-foreground">
              Exchange your <br />
              <span className="headline-span">gift cards</span> for cash.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl">
              Turn Amazon, Flipkart, Roblox, Steam, and other unused card codes directly into secure UPI transfers or decentralized USDT stablecoin deposits.
            </p>
          </div>

          {/* Supported tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[9px] font-bold font-mono uppercase text-muted-foreground/60 tracking-wider">Redeeming:</span>
            {["Amazon Pay", "Flipkart Vouchers", "Roblox Gift Cards", "Overwatch", "League of Legends"].map((c) => (
              <span key={c} className="text-[10px] font-medium px-3 py-1 rounded-lg bg-foreground/[0.02] border border-border/40 text-foreground/80">
                {c}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-4 pt-4">
            <a
              href="https://wa.me/919120138828"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary/95 to-primary px-8 text-xs font-bold text-primary-foreground shadow-[0_4px_12px_rgba(240,203,135,0.25)] hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white dark:fill-black shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
              </svg>
              <span>Redeem Card via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#brands"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-card border border-border/80 hover:border-primary/40 px-6 text-xs font-bold text-foreground transition duration-200"
            >
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Browse Card Catalog</span>
            </a>
          </div>

          {/* Safe Badge Footer */}
          <div className="flex items-center gap-5 text-[10px] text-muted-foreground/60 font-mono pt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-400" /> Admin Moderated
            </span>
            <span className="h-3 w-px bg-border/60" />
            <span className="flex items-center gap-1.5">
              <Coins size={12} className="text-emerald-400" /> Secure Escrow
            </span>
          </div>

        </div>

        {/* Right Column: Tactile Rate redemptions console visual */}
        <div className="lg:col-span-5 flex items-center justify-center w-full">
          <div className="relative w-full max-w-sm animate-float-card">
            
            {/* Visual Glass Box */}
            <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase">Gateway Console</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Box redemptions diagram */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-foreground/[0.02] border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                      GC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Gift Card</p>
                      <p className="text-[9px] text-muted-foreground">Amazon, Roblox, etc.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-foreground">Redeem</span>
                </div>

                <div className="flex justify-center my-1.5 text-primary">
                  <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ArrowUpDown size={12} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-foreground/[0.02] border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      $
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Settlement Payout</p>
                      <p className="text-[9px] text-muted-foreground">UPI Bank or USDT</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">Received</span>
                </div>
              </div>

              {/* Status */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                <span>Avg Settlement</span>
                <span className="text-foreground font-bold font-sans">Under 10 Mins</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero;
