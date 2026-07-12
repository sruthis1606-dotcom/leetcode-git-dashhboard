import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, accent = 'text-indigo-600 dark:text-indigo-400', delay = 0 }: StatCardProps) {
  return (
    <div
      className="group relative rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm px-6 py-5 shadow-sm hover:shadow-md hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{title}</span>
        <div className={cn('p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50', accent)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-1">
        <span className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</span>
        {subtitle && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
