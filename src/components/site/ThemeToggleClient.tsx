'use client';

import { ThemeToggle } from '@gv-tech/ui-web';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

export function ThemeToggleClient(props: ComponentProps<typeof ThemeToggle>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  return <ThemeToggle {...props} />;
}
