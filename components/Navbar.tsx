'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/cases', label: 'Cases' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/submit', label: 'Submit' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          People Search Bench
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* GitHub */}
          <Button variant="ghost" size="icon" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="size-4" />
            </a>
          </Button>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
