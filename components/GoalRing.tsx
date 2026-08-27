"use client";

import { useEffect, useState } from "react";
import { getDailyGoal, setDailyGoal, getTodayProgress } from "@/lib/storage";

const SIZE = 76;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function GoalRing() {
  const [goal, setGoal] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setGoal(getDailyGoal());
    setProgress(getTodayProgress());
  }, []);

  if (goal === null) return <div className="w-[76px] h-[76px]" />;

  const pct = Math.min(1, progress / goal);
  const dash = C * pct;

  function adjust(delta: number) {
    const next = Math.max(5, (goal ?? 15) + delta);
    setDailyGoal(next);
    setGoal(next);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => setEditing((v) => !v)}
        className="relative"
        aria-label="Meta diaria de tarjetas"
      >
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="var(--sage)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-sm text-ink">{progress}</span>
          <span className="text-[9px] text-ink-faint">/ {goal}</span>
        </span>
      </button>
      {editing && (
        <div className="flex items-center gap-2 text-xs text-ink-soft bg-surface border border-border rounded-full px-2 py-1">
          <button onClick={() => adjust(-5)} className="w-5 h-5 flex items-center justify-center">−</button>
          <span>meta: {goal}</span>
          <button onClick={() => adjust(5)} className="w-5 h-5 flex items-center justify-center">+</button>
        </div>
      )}
    </div>
  );
}
