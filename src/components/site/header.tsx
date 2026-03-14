'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@gv-tech/ui-web';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggleClient } from './ThemeToggleClient';

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
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link href="#welcome">
          <Text as="span" variant="h4" className="font-title">
            ENL Christian Homeschool
          </Text>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Main sections">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center">
          <ThemeToggleClient variant="ternary" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={6} align="end" className="w-[18rem] p-2">
              {navItems.map((item) => (
                <DropdownMenuItem asChild key={item.href} className="rounded-md px-3 py-2">
                  <a href={item.href}>{item.label}</a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-md px-3 py-2">
                <a href="#resources">Resources</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
