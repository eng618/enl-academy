'use client';

import { ScrollToTop, ThemeProvider } from '@gv-tech/ui-web';
import type { ReactNode } from 'react';

type ProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <ScrollToTop />
    </ThemeProvider>
  );
}
