import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchStats } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressRing } from '@/components/stats/ProgressRing';
import { StatCard } from '@/components/stats/StatCard';
import { Search, Github, Mail, Code2, Trophy, GitCommit, AlertTriangle, Loader2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(1, "Required"),
  email: z.string().email("Invalid").optional().or(z.literal("")),
  github: z.string().optional().or(z.literal(""))
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', github: '' }
  });

  const { mutate, data: stats, isPending, isError, error } = useFetchStats();

  const onSubmit = (values: FormValues) => {
    mutate({ 
      data: { 
        username: values.username, 
        email: values.email || null, 
        github: values.github || null 
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className={cn(
        "flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-24 transition-all duration-700 ease-in-out",
        stats ? "lg:py-12" : "flex flex-col items-center justify-center"
      )}>
        <div className="w-full space-y-8">

          {/* Title Section (conditionally hidden/shrunk when stats exist) */}
          <div className={cn("text-center space-y-4 transition-all duration-500", stats ? "opacity-0 h-0 overflow-hidden" : "opacity-100 mb-12")}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
              Track your <span className="text-primary font-mono">&lt;grind/&gt;</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Enter your handles below to generate your comprehensive developer scoreboard.
            </p>
          </div>

          {/* Terminal Form Box */}
          <div className="w-full max-w-4xl mx-auto rounded-xl border border-border bg-card/40 backdrop-blur shadow-2xl overflow-hidden transition-all duration-500 hover:border-border/80">
            {/* Window Header */}
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <span>execute ~/fetch-stats.sh</span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* LeetCode Input */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">LeetCode *</Label>
                    <div className="relative group">
                      <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="username"
                        placeholder="username"
                        className="pl-9 font-mono bg-background/50 h-11 transition-colors focus-visible:ring-primary/50"
                        {...form.register("username")}
                      />
                    </div>
                    {form.formState.errors.username && (
                      <p className="text-xs text-destructive animate-in slide-in-from-top-1">{form.formState.errors.username.message}</p>
                    )}
                  </div>

                  {/* GitHub Input */}
                  <div className="space-y-2">
                    <Label htmlFor="github" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">GitHub (Opt)</Label>
                    <div className="relative group">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="github"
                        placeholder="username"
                        className="pl-9 font-mono bg-background/50 h-11 transition-colors focus-visible:ring-primary/50"
                        {...form.register("github")}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email (Opt)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        placeholder="hello@example.com"
                        className="pl-9 font-mono bg-background/50 h-11 transition-colors focus-visible:ring-primary/50"
                        {...form.register("email")}
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive animate-in slide-in-from-top-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isPending ? "bg-primary" : "bg-muted-foreground")}></span>
                      <span className={cn("relative inline-flex rounded-full h-2 w-2", isPending ? "bg-primary" : "bg-muted-foreground")}></span>
                    </span>
                    {isPending ? "Connecting to endpoints..." : "Awaiting input..."}
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="font-mono tracking-wide h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        FETCHING_
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        EXECUTE
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <div className="max-w-4xl mx-auto rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-destructive">Signal Interrupted</h4>
                <p className="text-sm text-destructive/80 mt-1">
                  {(error as any)?.error || "Failed to fetch developer statistics. Verify the usernames and try again."}
                </p>
              </div>
            </div>
          )}

          {/* Success Stats View */}
          {stats && !isPending && !isError && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-4">

              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-border/50 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">System Report</h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground font-mono">
                    <span className="text-primary font-bold">{stats.username}</span>
                    {stats.github && (
                      <>
                        <span className="opacity-30">/</span>
                        <span className="flex items-center gap-1 text-foreground">
                          <Github className="w-3.5 h-3.5"/> {stats.github}
                        </span>
                      </>
                    )}
                    {stats.email && (
                      <>
                        <span className="opacity-30">/</span>
                        <span className="flex items-center gap-1 text-foreground">
                          <Mail className="w-3.5 h-3.5"/> {stats.email}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-muted/50 text-xs font-mono text-muted-foreground border border-border/50">
                  STATUS: SECURE
                </div>
              </div>

              {/* Top Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Solved"
                  value={stats.totalSolved}
                  subtitle="Problems Conquered"
                  icon={Code2}
                  delay={100}
                />
                <StatCard
                  title="Global Ranking"
                  value={stats.ranking ? `#${stats.ranking.toLocaleString()}` : "N/A"}
                  subtitle="LeetCode World Rank"
                  icon={Trophy}
                  delay={200}
                />
                <StatCard
                  title="GitHub Repos"
                  value={stats.githubRepos}
                  subtitle="Public Repositories"
                  icon={GitCommit}
                  delay={300}
                />
              </div>

              {/* Rings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <Card className="bg-card/20 backdrop-blur border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both hover:bg-card/40 transition-colors" style={{ animationDelay: '400ms' }}>
                  <CardContent className="p-8 flex items-center justify-center">
                    <ProgressRing
                      value={stats.easySolved}
                      max={848}
                      label="Easy"
                      colorClass="text-emerald-500"
                      textColorClass="text-emerald-600 dark:text-emerald-400"
                    />
                  </CardContent>
                </Card>
                <Card className="bg-card/20 backdrop-blur border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both hover:bg-card/40 transition-colors" style={{ animationDelay: '500ms' }}>
                  <CardContent className="p-8 flex items-center justify-center">
                    <ProgressRing
                      value={stats.mediumSolved}
                      max={1775}
                      label="Medium"
                      colorClass="text-amber-500"
                      textColorClass="text-amber-600 dark:text-amber-400"
                    />
                  </CardContent>
                </Card>
                <Card className="bg-card/20 backdrop-blur border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both hover:bg-card/40 transition-colors" style={{ animationDelay: '600ms' }}>
                  <CardContent className="p-8 flex items-center justify-center">
                    <ProgressRing
                      value={stats.hardSolved}
                      max={770}
                      label="Hard"
                      colorClass="text-rose-500"
                      textColorClass="text-rose-600 dark:text-rose-400"
                    />
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}