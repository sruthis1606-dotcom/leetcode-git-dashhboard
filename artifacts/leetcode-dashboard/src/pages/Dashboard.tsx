import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchStats } from '@workspace/api-client-react';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressRing } from '@/components/stats/ProgressRing';
import { StatCard } from '@/components/stats/StatCard';
import { Code2, Trophy, Github, Mail, Search, Loader2, AlertTriangle, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(1, 'LeetCode username is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', github: '' },
  });

  const { mutate, data: stats, isPending, isError, error } = useFetchStats();

  const onSubmit = (values: FormValues) => {
    mutate({
      data: {
        username: values.username,
        email: values.email || null,
        github: values.github || null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 flex flex-col pb-16">
      <Navbar />

      {/* Hero / Input */}
      <div className={cn(
        'flex flex-col items-center px-4 transition-all duration-500',
        stats ? 'pt-10' : 'pt-20 pb-4'
      )}>

        {!stats && (
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              LeetCode + GitHub Stats in one place
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
              Your developer{' '}
              <span className="text-indigo-600 dark:text-indigo-400">scorecard.</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Enter your handles below and see your stats visualized instantly.
            </p>
          </div>
        )}

        {/* Form card — frosted glass pill container */}
        <div className="w-full max-w-3xl rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm px-6 py-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/80 transition-all duration-300">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* LeetCode */}
              <div className="flex-1 relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  placeholder="LeetCode username"
                  className={cn(
                    'w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none transition-all',
                    'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500',
                    form.formState.errors.username
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-neutral-200 dark:border-neutral-700'
                  )}
                  {...form.register('username')}
                />
              </div>

              {/* GitHub */}
              <div className="flex-1 relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  placeholder="GitHub username (optional)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                  {...form.register('github')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm cursor-pointer shrink-0"
              >
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Fetching</>
                ) : (
                  <><Search className="h-4 w-4" /> Fetch Stats</>
                )}
              </button>
            </div>

            {form.formState.errors.username && (
              <p className="mt-2 text-xs text-red-500">{form.formState.errors.username.message}</p>
            )}
          </form>
        </div>

        {/* Error */}
        {isError && (
          <div className="w-full max-w-3xl mt-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              {(error as any)?.error || 'Could not fetch stats. Check the username and try again.'}
            </p>
          </div>
        )}
      </div>

      {/* Stats Panel */}
      {stats && !isPending && (
        <div className="w-full max-w-5xl mx-auto px-4 mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">

          {/* Profile strip */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
                {stats.username.slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">{stats.username}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {stats.email !== 'Not provided' ? stats.email : 'LeetCode Profile'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Active
            </span>
          </div>

          {/* Top stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Solved"
              value={stats.totalSolved}
              subtitle="Problems completed"
              icon={Code2}
              accent="text-indigo-600 dark:text-indigo-400"
              delay={0}
            />
            <StatCard
              title="Global Ranking"
              value={stats.ranking ? `#${stats.ranking.toLocaleString()}` : '—'}
              subtitle="LeetCode world rank"
              icon={Trophy}
              accent="text-amber-500 dark:text-amber-400"
              delay={100}
            />
            <StatCard
              title="GitHub Repos"
              value={stats.githubRepos}
              subtitle="Public repositories"
              icon={GitFork}
              accent="text-neutral-600 dark:text-neutral-300"
              delay={200}
            />
          </div>

          {/* Difficulty rings */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-8">Problem Breakdown</p>
            <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
              <ProgressRing
                value={stats.easySolved}
                max={848}
                label="Easy"
                color="stroke-emerald-500"
                bgColor="stroke-emerald-100 dark:stroke-emerald-950"
                labelColor="text-emerald-600 dark:text-emerald-400"
                delay={300}
              />
              <ProgressRing
                value={stats.mediumSolved}
                max={1775}
                label="Medium"
                color="stroke-amber-500"
                bgColor="stroke-amber-100 dark:stroke-amber-950"
                labelColor="text-amber-600 dark:text-amber-400"
                delay={400}
              />
              <ProgressRing
                value={stats.hardSolved}
                max={770}
                label="Hard"
                color="stroke-rose-500"
                bgColor="stroke-rose-100 dark:stroke-rose-950"
                labelColor="text-rose-600 dark:text-rose-400"
                delay={500}
              />
            </div>
          </div>

          {/* GitHub + email row (if provided) */}
          {(stats.githubRepos > 0 || stats.email !== 'Not provided') && (
            <div className="rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 px-6 py-5 flex flex-wrap gap-6 animate-in fade-in duration-500" style={{ animationDelay: '600ms' }}>
              {stats.githubRepos > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Github className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">GitHub</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{stats.githubRepos} public repos</p>
                  </div>
                </div>
              )}
              {stats.email && stats.email !== 'Not provided' && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Mail className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Email</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{stats.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!stats && !isPending && !isError && (
        <div className="flex flex-col items-center justify-center mt-16 gap-3 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
            <Code2 className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs">
            Your stats will appear here after you enter a username above.
          </p>
        </div>
      )}
    </div>
  );
}
