import { getRoleLandingPath } from './role-landing';

describe('getRoleLandingPath', () => {
  it('returns global admin dashboard for global_admin role', () => {
    expect(getRoleLandingPath('global_admin')).toBe('/dashboard/global-admin');
  });

  it('returns parent dashboard for parent role', () => {
    expect(getRoleLandingPath('parent')).toBe('/dashboard/parent');
  });

  it('returns student dashboard for student role', () => {
    expect(getRoleLandingPath('student')).toBe('/dashboard/student');
  });
});
