import Component from "@/components/ui/particle-effect-for-hero";

export default function DemoOne() {
  return <Component />;
}

interface TrustBadgeProps {
  reviews: Array<{ name: string; avatar_url: string }>;
}

export function Component({ reviews }: TrustBadgeProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex -space-x-2 overflow-hidden">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-primary/20 border border-primary/30 flex items-center justify-center text-[8px] font-bold text-primary"
          >
            {r.name.charAt(0)}
          </div>
        ))}
      </div>
      <div className="text-left">
        <p className="text-[10px] font-bold text-foreground leading-none">Trust Verified</p>
        <p className="text-[8px] text-muted-foreground">Admin Curated Ledger</p>
      </div>
    </div>
  );
}
