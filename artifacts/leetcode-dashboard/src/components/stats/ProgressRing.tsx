import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  colorClass: string; // stroke color class
  textColorClass: string;
  className?: string;
}

export function ProgressRing({ value, max, label, colorClass, textColorClass, className }: ProgressRingProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center w-full group", className)}>
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            className="text-muted stroke-current opacity-30"
            strokeWidth="6"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
          />
          {/* Progress track */}
          <circle
            className={cn("stroke-current transition-all duration-1000 ease-out", colorClass)}
            strokeWidth="6"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        
        {/* Centered Stats */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={cn("text-3xl font-bold font-mono tracking-tighter", textColorClass)}>
            {value}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono mt-0 border-t border-border/40 pt-[1px] w-4/5 text-center">
            /{max}
          </span>
        </div>
      </div>
      
      {/* Label and Ratio */}
      <div className="mt-4 flex flex-col items-center">
        <span className="text-sm font-semibold tracking-wider uppercase text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground font-mono mt-1 opacity-70">
          {(percent * 100).toFixed(1)}% solved
        </span>
      </div>
    </div>
  );
}