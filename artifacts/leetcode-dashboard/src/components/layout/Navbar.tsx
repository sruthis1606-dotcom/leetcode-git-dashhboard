import React from 'react';
import { useThemeSystem } from '@/components/ui/mask-view-transition-theme-toggle';
import { flushSync } from 'react-dom';
import { Moon, Sun, Terminal } from 'lucide-react';
import { Link } from 'wouter';

export function Navbar() {
  const { theme, toggleTheme } = useThemeSystem();

  const handleThemeChange = (newTheme: "light" | "dark") => {
    if (newTheme === theme) return;
    if (!document.startViewTransition) {
      toggleTheme(newTheme);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => { toggleTheme(newTheme); });
    });
  };

  const maskGifUrl = "https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif";
  const duration = "1.5s";

  return (
    <>
      <style>{`
        :root {
          --expo-in: linear(
            0 0%, 0.0085 31.26%, 0.0167 40.94%,
            0.0289 48.86%, 0.0471 55.92%,
            0.0717 61.99%, 0.1038 67.32%,
            0.1443 72.07%, 0.1989 76.7%,
            0.2659 80.89%, 0.3465 84.71%,
            0.4419 88.22%, 0.554 91.48%,
            0.6835 94.51%, 0.8316 97.34%, 1 100%
          );
        }
        ::view-transition-group(root) { animation-timing-function: var(--expo-in); }
        ::view-transition-new(root) {
          -webkit-mask: url('${maskGifUrl}') center / 0 no-repeat;
          mask: url('${maskGifUrl}') center / 0 no-repeat;
          animation: scale ${duration};
          animation-fill-mode: both;
        }
        ::view-transition-old(root), .dark::view-transition-old(root) {
          animation: scale ${duration};
          animation-fill-mode: both;
        }
        ::view-transition-old(root), ::view-transition-new(root) {
          mix-blend-mode: normal;
        }
        @keyframes scale {
          0% { -webkit-mask-size: 0; mask-size: 0; }
          10% { -webkit-mask-size: 50vmax; mask-size: 50vmax; }
          90% { -webkit-mask-size: 50vmax; mask-size: 50vmax; }
          100% { -webkit-mask-size: 2000vmax; mask-size: 2000vmax; }
        }
      `}</style>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="font-bold font-mono tracking-tight text-lg">LC_GIT_DASH</span>
          </Link>
          <button
            onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>
    </>
  );
}