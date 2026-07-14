import { useEffect, useRef } from "react";
import { defineAnchorTrustBadge } from "./AnchorTrustBadge.js";

export interface AnchorTrustBadgeProps {
  score: number;
  anchorName?: string;
  className?: string;
}

/**
 * Thin React wrapper around the <anchor-trust-badge> custom element.
 * Registers the element once (idempotent) and passes props through as
 * attributes — the element itself owns all rendering and accessibility
 * behavior, so this wrapper stays framework-agnostic in spirit.
 */
export function AnchorTrustBadge({ score, anchorName, className }: AnchorTrustBadgeProps) {
  const ref = useRef<HTMLElement & { score?: number }>(null);

  useEffect(() => {
    defineAnchorTrustBadge();
  }, []);

  return (
    // @ts-expect-error -- custom element, not in the JSX intrinsic element list
    <anchor-trust-badge
      ref={ref}
      class={className}
      score={String(score)}
      anchor-name={anchorName}
    />
  );
}
