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
    <header className="site-header">
      <div className="site-frame site-header-inner">
        <Link href="#welcome" className="min-w-0">
          <Text as="span" variant="h4" className="site-title text-foreground">
            ENL Christian Homeschool
          </Text>
        </Link>

        <nav className="site-nav" aria-label="Main sections">
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
