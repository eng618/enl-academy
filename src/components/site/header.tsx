'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@gv-tech/ui-web';
import { Session } from '@supabase/supabase-js';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [session, setSession] = useState<Session | null>(null);
  const supabase = getBrowserSupabaseClient();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: onAuthData } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      subscription = onAuthData.subscription;
    };

    loadSession();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const signIn = async () => {
    const email = window.prompt('Enter email for magic link (supabase)');
    if (!email) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      window.alert(`Sign in error: ${error.message}`);
    } else {
      window.alert('Check your email for a magic link to sign in.');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert(`Sign out error: ${error.message}`);
    }
  };

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

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/planner">Planner</Link>
          </Button>
          {session ? (
            <Button size="sm" onClick={signOut} variant="secondary">
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={signIn} variant="secondary">
              Sign in
            </Button>
          )}
        </div>

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
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-md px-3 py-2">
                <a href="/planner">Planner</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-md px-3 py-2">
                {session ? <button onClick={signOut}>Sign out</button> : <button onClick={signIn}>Sign in</button>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
