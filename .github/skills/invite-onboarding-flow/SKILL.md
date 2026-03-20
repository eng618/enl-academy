---
name: invite-onboarding-flow
description: Implement and verify invite-only onboarding with role-safe profile creation.
---

# Skill: Invite Onboarding Flow

## Use when

- Building /invite/[token] flow
- Creating admin invite management
- Wiring login/callback/profile bootstrap

## Checklist

1. Add invites data model (token, role, family_id, expires_at, accepted_at).
2. Build admin-only invite creation path.
3. Validate invite token exists, is unexpired, and unused.
4. Require authenticated user before acceptance.
5. Create profile from invite-derived role and family.
6. Mark invite accepted and prevent reuse.
7. Redirect user to role-specific landing page.

## Guardrails

- Never accept role or family from client payload.
- Never allow token reuse after accepted_at is set.
- Handle expired and invalid tokens with explicit UX states.

## Verification

- New invited parent can sign up and receive parent role.
- New invited student can sign up and receive student role.
- Reusing token fails with clear error.
