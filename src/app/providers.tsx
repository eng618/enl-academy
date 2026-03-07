'use client';

import { ThemeProvider, useTheme } from '@gv-tech/ui-web';
import { type ReactNode, useEffect } from 'react';

import { applySemanticTokens } from '@/theme/semanticTokens';

function ThemeVariables(): null {
  const { tokens } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
      const cssName = tokenName.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      root.style.setProperty(`--${cssName}`, tokenValue);
    });

    applySemanticTokens(root, tokens);
  }, [tokens]);

  return null;
}

type ProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeVariables />
      {children}
    </ThemeProvider>
  );
}
