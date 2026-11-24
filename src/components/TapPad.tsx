"use client";

import type { ReactNode } from "react";
import type { Phase } from "@/lib/reaction";

const bg: Record<Phase, string> = {
  idle: "bg-idle",
  wait: "bg-wait",
  go: "bg-go",
  early: "bg-early",
  result: "bg-idle",
  done: "bg-idle",
};

type Props = { phase: Phase; onTap: () => void; children: ReactNode };

export function TapPad({ phase, onTap, children }: Props) {
  return (
    <button
      type="button"
      data-phase={phase}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onTap();
        }
      }}
      className={`${bg[phase]} flex min-h-0 flex-1 touch-manipulation select-none flex-col items-center justify-center gap-3 rounded-3xl p-6 text-center text-white outline-offset-4 focus-visible:outline-4 focus-visible:outline-fg active:scale-[.985] motion-safe:transition-transform`}
    >
      {children}
    </button>
  );
}
