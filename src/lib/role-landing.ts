import type { Role } from './supabase-types';

export function getRoleLandingPath(role: Role): string {
  if (role === 'global_admin') {
    return '/dashboard/global-admin';
  }

  if (role === 'parent') {
    return '/dashboard/parent';
  }

  return '/dashboard/student';
}
