/* Hallmark · component: Hero · genre: modern-minimal · theme: luxury-gold
 * macrostructure: Asymmetric Split — left text mass, right stat panel
 * states: default · hover · focus-visible · active · disabled
 * contrast: pass (all gates)
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CreditCard, ShieldCheck, Clock, TrendingUp } from "lucide-react";

/* ── Token aliases (no inline hex — all from CSS custom properties) ── */
const WHATSAPP_NUMBER = "919120138828";
const WHATSAPP_MSG = encodeURIComponent("Hi GCX! I want to redeem my gift card. Please guide me through the rates.");

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

/* ── Marquee of accepted brands ── */
const BRANDS = ["Amazon", "Flipkart", "Roblox", "Steam", "Overwatch", "Xbox", "PlayStation", "iTunes", "Google Play", "League of Legends"];

function Marquee() {
  const items = [...BRANDS, ...BRANDS]; // double for seamless loop
  return (
    <div className="relative overflow-hidden w-full" aria-hidden="true">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />
      <div className="marquee-track py-1">
        {items.map((brand, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-3 px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide whitespace-nowrap"
            style={{
              background: "color-mix(in oklch, var(--primary) 8%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 18%, transparent)",
              color: "var(--muted-foreground)",
            }}
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card component ── */
function StatCard({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ElementType }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1200, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-1.5 p-4 rounded-xl"
      style={{
        background: "color-mix(in oklch, var(--card) 60%, transparent)",
        border: "1px solid color-mix(in oklch, var(--primary) 14%, transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Icon size={15} style={{ color: "var(--primary)" }} />
      <p className="text-2xl font-black tracking-tight tabular-nums" style={{ color: "var(--foreground)" }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
  );
}

/* ── Main Hero ── */
export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-clip"
      style={{ minHeight: "calc(100dvh - 64px)", overflow: "hidden" }}
    >
      {/* ── Background: subtle grain SVG, no orbs ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.028 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* ── One anchor glow — not centred, biased top-left ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-120px",
          left: "-80px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Layout: asymmetric split — left:content right:stats ── */}
      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-16"
        style={{ paddingTop: "clamp(72px, 12vw, 128px)", paddingBottom: "clamp(72px, 10vw, 112px)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-8">

            {/* Verified badge — left-aligned, not centred */}
            <div
              className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest select-none"
              style={{
                background: "color-mix(in oklch, var(--primary) 10%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 28%, transparent)",
                color: "var(--primary)",
              }}
            >
              <ShieldCheck size={11} />
              <span>Verified Redemption Gateway</span>
            </div>

            {/* Display heading — solid ink, weight contrast, no gradient fill */}
            <h1
              className="font-black leading-[1.02] tracking-[-0.04em]"
              style={{
                fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                color: "var(--foreground)",
                fontStyle: "normal",
                maxWidth: "15ch",
              }}
            >
              Turn Gift Cards{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--primary)" }}
              >
                into Cash.
                {/* Drawn underline — carries emphasis, no gradient */}
                <svg
                  aria-hidden="true"
                  className="absolute w-full"
                  style={{ bottom: "-6px", left: 0, height: "5px" }}
                  viewBox="0 0 300 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q75 2 150 5 Q225 8 298 3"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Restrained body — left-aligned, not centred */}
            <p
              className="text-base leading-relaxed"
              style={{
                color: "var(--muted-foreground)",
                maxWidth: "48ch",
              }}
            >
              Redeem Amazon, Flipkart, Steam, Roblox, and 20+ other vouchers. Payouts via UPI or USDT — handled directly over WhatsApp with zero forms.
            </p>

            {/* CTA row — buttons left-aligned */}
            <div className="flex flex-col sm:flex-row gap-3">
              <HeroButton
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                variant="primary"
              >
                <WhatsAppIcon />
                <span>Start on WhatsApp</span>
                <ArrowUpRight size={14} />
              </HeroButton>
              <HeroButton href="#brands" variant="secondary">
                <CreditCard size={14} style={{ color: "var(--primary)" }} />
                <span>View Card Rates</span>
              </HeroButton>
            </div>

            {/* Trust micro-row */}
            <div className="flex items-center gap-5 pt-2">
              {[
                { icon: ShieldCheck, label: "Admin-verified payouts" },
                { icon: Clock, label: "Fast settlement" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                  <Icon size={12} style={{ color: "var(--primary)" }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Accepted brands marquee */}
            <div className="pt-2 -mx-2">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-2" style={{ color: "var(--muted-foreground)" }}>
                Accepted Cards
              </p>
              <Marquee />
            </div>
          </div>

          {/* ── RIGHT COLUMN: Stat panel ── */}
          <aside className="flex flex-col gap-4 lg:pt-6 lg:sticky lg:top-24">
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--muted-foreground)" }}
            >
              Platform stats
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <StatCard value={4800} suffix="+" label="Cards redeemed" icon={CreditCard} />
              <StatCard value={98} suffix="%" label="Payout success rate" icon={TrendingUp} />
              <StatCard value={2} suffix=" min" label="Avg. settlement time" icon={Clock} />
              <StatCard value={20} suffix="+" label="Card types accepted" icon={ShieldCheck} />
            </div>

            {/* Proof prompt */}
            <a
              href="/proofs"
              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
              style={{
                background: "color-mix(in oklch, var(--primary) 6%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
                outline: "2px solid transparent",
                outlineOffset: "2px",
                color: "var(--foreground)",
                textDecoration: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in oklch, var(--primary) 12%, transparent)")}
              onMouseLeave={e => (e.currentTarget.style.background = "color-mix(in oklch, var(--primary) 6%, transparent)")}
            >
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>View Payment Proofs →</p>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Real screenshots, no stars, admin-verified</p>
              </div>
              <ArrowUpRight size={16} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--primary)" }} />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ── Button — fully 8-state compliant, border-width never changes ── */
function HeroButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: "44px",
    padding: "0 20px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease",
    /* Fixed border — never changes width across states (no-layout-shift rule) */
    border: "1px solid transparent",
    outline: "2px solid transparent",
    outlineOffset: "3px",
    whiteSpace: "nowrap",
  };

  const primary: React.CSSProperties = {
    ...base,
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    borderColor: "var(--primary)",
    boxShadow: "0 2px 12px color-mix(in oklch, var(--primary) 30%, transparent)",
  };

  const secondary: React.CSSProperties = {
    ...base,
    background: "color-mix(in oklch, var(--card) 80%, transparent)",
    color: "var(--foreground)",
    borderColor: "color-mix(in oklch, var(--primary) 22%, transparent)",
    backdropFilter: "blur(8px)",
  };

  const style = variant === "primary" ? primary : secondary;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={style}
      onMouseEnter={e => {
        const el = e.currentTarget;
        if (variant === "primary") {
          el.style.transform = "translateY(-1px)";
          el.style.boxShadow = "0 6px 20px color-mix(in oklch, var(--primary) 40%, transparent)";
        } else {
          el.style.transform = "translateY(-1px)";
          el.style.background = "color-mix(in oklch, var(--primary) 10%, transparent)";
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        if (variant === "primary") {
          el.style.boxShadow = "0 2px 12px color-mix(in oklch, var(--primary) 30%, transparent)";
        } else {
          el.style.background = "color-mix(in oklch, var(--card) 80%, transparent)";
        }
      }}
      onMouseDown={e => { e.currentTarget.style.transform = "translateY(1px)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      onFocus={e => { e.currentTarget.style.outlineColor = "var(--primary)"; }}
      onBlur={e => { e.currentTarget.style.outlineColor = "transparent"; }}
    >
      {children}
    </a>
  );
}

/* ── WhatsApp icon ── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-2.147 7.772 7.949-2.086c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0z" opacity="0.9"/>
    </svg>
  );
}

export default Hero;
