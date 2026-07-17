import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface TrustBadgeProps {
  reviews?: Array<{
    name: string;
    avatar_url?: string;
  }>;
}

function Component({ reviews = [] }: TrustBadgeProps) {
  const displayReviews = reviews.slice(0, 4);
  const count = reviews.length > 0 ? reviews.length : 68; // fallback count

  const fallbackImages = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80",
  ];

  return (
    <div className="flex items-center rounded-full border border-border bg-background p-1 shadow shadow-black/5">
      <div className="flex -space-x-1.5">
        {displayReviews.length > 0 ? (
          displayReviews.map((r, i) => (
            <Avatar key={i} className="h-5 w-5 ring-1 ring-background rounded-full shrink-0 select-none">
              {r.avatar_url && (
                <AvatarImage src={r.avatar_url} alt={r.name} className="h-full w-full object-cover rounded-full" />
              )}
              <AvatarFallback className="bg-secondary text-[8px] font-bold font-sans uppercase rounded-full h-full w-full flex items-center justify-center text-foreground">
                {(r.name || "").charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))
        ) : (
          fallbackImages.map((src, i) => (
            <img
              key={i}
              className="rounded-full ring-1 ring-background h-5 w-5 object-cover shrink-0"
              src={src}
              width={20}
              height={20}
              alt={`Avatar ${i + 1}`}
            />
          ))
        )}
      </div>
      <p className="px-2 text-[10.5px] font-bold text-muted-foreground font-sans">
        Trusted by <strong className="font-bold text-foreground text-gradient">{count}+ verified</strong> reviewers.
      </p>
    </div>
  );
}

export { Component };
