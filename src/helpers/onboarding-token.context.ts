import { createContext } from 'react';

/**
 * Set by the public onboarding page (pages/employees/onboard.tsx). Bank
 * detail checks inside it use the onboarding token, because the visitor has
 * no login and POST /payouts/validate now requires one.
 */
export const OnboardingTokenContext = createContext<string | undefined>(
  undefined,
);
