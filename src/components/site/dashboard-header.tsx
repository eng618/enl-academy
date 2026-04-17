'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Role } from '@/lib/supabase-types';
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
import { useEffect, useState } from 'react';
import { ThemeToggleClient } from './ThemeToggleClient';

const navByRole: Record<Role, Array<{ href: string; label: string }>> = {
  global_admin: [
    { href: '/dashboard/global-admin', label: 'Families' },
    { href: '/admin/invite', label: 'Invites' },
  ],
  parent: [
    { href: '/dashboard/parent', label: 'Students' },
    { href: '/admin/invite', label: 'Invites' },
  ],
  student: [{ href: '/dashboard/student', label: 'Today' }],
};

export function DashboardHeader() {
  const supabase = getBrowserSupabaseClient();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();

      if (profile) {
        setRole(profile.role);
      }
    };

    void load();
  }, [supabase]);

  const signOut = async () => {
    document.cookie = 'role=; path=/; max-age=0';
    await supabase.auth.signOut();
  };

  const navItems = role ? (navByRole[role] ?? []) : [];

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/dashboard">
          <Text as="span" variant="h4" className="font-title">
            ENL Academy
          </Text>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Dashboard sections">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button size="sm" onClick={signOut} variant="secondary">
            Sign out
          </Button>
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
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-md px-3 py-2">
                <button onClick={signOut}>Sign out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
