import * as React from "react"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number
  children: React.ReactNode
}

export function TiltCard({ intensity = 14, children, className, ...props }: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const glowRef = React.useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card) return

    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const rx = (0.5 - y) * intensity
    const ry = (x - 0.5) * intensity

    card.style.setProperty("--rx", `${rx}deg`)
    card.style.setProperty("--ry", `${ry}deg`)

    if (glow) {
      glow.style.setProperty("--gx", `${x * 100}%`)
      glow.style.setProperty("--gy", `${y * 100}%`)
      glow.style.opacity = "1"
    }
  }

  const reset = () => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card) return

    card.style.setProperty("--rx", "0deg")
    card.style.setProperty("--ry", "0deg")

    if (glow) {
      glow.style.opacity = "0"
    }
  }

  return (
    <div className="[perspective:1200px] h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transformStyle: "preserve-3d",
          transition: "transform 0.18s ease-out",
        }}
        className={`relative h-full ${className || ""}`}
        {...props}
      >
        {children}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), oklch(1 0 0 / 18%), transparent 50%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  )
}

export default TiltCard
