import type { Role } from './supabase-types';

export function getRoleLandingPath(role: Role): string {
  if (role === 'global_admin') {
    return '/planner?role=global_admin';
  }

  if (role === 'parent') {
    return '/planner?role=parent';
  }

  return '/planner?role=student';
}
