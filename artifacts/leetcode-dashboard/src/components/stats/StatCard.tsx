import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <Card
      className="overflow-hidden bg-card/40 backdrop-blur border-border/50 hover:bg-card/80 hover:border-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-3">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
          <Icon className="h-5 w-5 text-primary/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-mono font-bold tracking-tighter text-foreground">
            {value}
          </span>
          {subtitle && <span className="text-xs font-mono text-muted-foreground/70">{subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
}