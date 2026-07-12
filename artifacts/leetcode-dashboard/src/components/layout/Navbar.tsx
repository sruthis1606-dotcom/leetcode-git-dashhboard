import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useThemeSystem } from '@/components/ui/mask-view-transition-theme-toggle';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'wouter';

const maskGifUrl = "https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif";
const duration = "1.5s";

export function Navbar() {
  const { theme, toggleTheme } = useThemeSystem();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setIsOpen(false);
    if (newTheme === theme) return;
    if (!document.startViewTransition) {
      toggleTheme(newTheme);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => { toggleTheme(newTheme); });
    });
  };

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
        ::view-transition-old(root), ::view-transition-new(root) { mix-blend-mode: normal; }
        @keyframes scale {
          0% { -webkit-mask-size: 0; mask-size: 0; }
          10% { -webkit-mask-size: 50vmax; mask-size: 50vmax; }
          90% { -webkit-mask-size: 50vmax; mask-size: 50vmax; }
          100% { -webkit-mask-size: 2000vmax; mask-size: 2000vmax; }
        }
      `}</style>

      <div className="w-full px-6 pt-5 flex justify-center">
        <header className="w-full max-w-5xl rounded-full border border-neutral-200/80 bg-white/75 backdrop-blur-md px-8 py-3.5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/75 transition-all duration-300">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform duration-200">
                L
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white tracking-tight text-sm">
                LeetCode Git<span className="text-indigo-600 dark:text-indigo-400">.</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Compare
              </a>
              <a href="#" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Leaderboard
              </a>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-28 origin-top-right rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 z-[100]">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        theme === 'light'
                          ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Sun className="h-3 w-3" /> Light
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Moon className="h-3 w-3" /> Dark
                    </button>
                  </div>
                )}
              </div>

              <button className="hidden sm:inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all cursor-pointer shadow-sm">
                Get Started
              </button>
            </div>

          </div>
        </header>
      </div>
    </>
  );
}
