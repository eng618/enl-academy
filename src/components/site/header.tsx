'use client';

import { Button, Text, ThemeToggle } from '@gv-tech/ui-web';
import Link from 'next/link';

const navItems = [
  { href: '#welcome', label: 'Welcome' },
  { href: '#about', label: 'About' },
  { href: '#faith', label: 'Faith' },
  { href: '#learning', label: 'Learning' },
  { href: '#rhythm', label: 'Rhythm' },
  { href: '#resources', label: 'Resources' },
] as const;

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#welcome" className="min-w-0">
          <Text as="span" variant="h4" className="text-foreground block truncate">
            ENL Christian Homeschool
          </Text>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main sections">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <ThemeToggle variant="ternary" />
      </div>
    </header>
  );
}
