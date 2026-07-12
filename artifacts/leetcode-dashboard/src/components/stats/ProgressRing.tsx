import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  color: string;         // stroke hex or tailwind stroke class
  bgColor: string;
  labelColor: string;
  delay?: number;
}

export function ProgressRing({ value, max, label, color, bgColor, labelColor, delay = 0 }: ProgressRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div
      className="group flex flex-col items-center gap-3 animate-in fade-in fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-center justify-center">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            strokeWidth="7"
            className={bgColor}
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            strokeWidth="7"
            strokeLinecap="round"
            className={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn('text-2xl font-bold tracking-tight', labelColor)}>{value}</span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">/{max}</span>
        </div>
      </div>
      <div className="text-center">
        <span className={cn('text-xs font-semibold uppercase tracking-wider', labelColor)}>{label}</span>
        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{(percent * 100).toFixed(1)}% solved</p>
      </div>
    </div>
  );
}
